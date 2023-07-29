#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use ffi::{default_sound, delete_sample, greet, play_sample, samples_list, upload_sample};
use serde_json::Value;
use tauri::Manager;

mod audio;
mod ffi;
mod io;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            app.listen_global("play_sample", |event| {
                if let Some(pl) = event.payload() {
                    let v: String = serde_json::from_str(pl).unwrap();
                    crate::io::SampleHandler::play_sample(v);
                }
            });

            Ok(())
        })
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
