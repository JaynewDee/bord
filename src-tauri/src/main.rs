#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use ffi::{default_sound, delete_sample, greet, play_sample, samples_list, upload_sample};
use tauri::Manager;

mod audio;
mod ffi;
mod io;

const _APP_NAME: &str = "BORD";

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
        .setup(|app| app_setup(app))
        .invoke_handler(tauri::generate_handler![
            greet,
            default_sound,
            upload_sample,
            samples_list,
            play_sample,
            delete_sample
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
