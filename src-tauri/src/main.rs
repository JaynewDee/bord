#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use ffi::{board_config, delete_sample, greet, ping, samples_list, update_config, upload_sample};
use tauri::Manager;

mod audio;
mod ffi;
mod io;

const _APP_NAME: &str = "bord";

fn app_setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    app.listen_global("play_sample", |event| {
        if let Some(pl) = event.payload() {
            let v: String = serde_json::from_str(pl).unwrap();
            let _ = crate::io::SampleHandler::play_sample(v);
        }
    });

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            app_setup(app).unwrap();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            ping,
            upload_sample,
            samples_list,
            board_config,
            delete_sample,
            update_config
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
