#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use ffi::{default_sound, greet};

mod audio;
mod ffi;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, default_sound])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
