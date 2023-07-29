#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use ffi::{default_sound, delete_sample, greet, samples_list, upload_sample};

mod audio;
mod ffi;
mod io;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            default_sound,
            upload_sample,
            samples_list,
            delete_sample
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
