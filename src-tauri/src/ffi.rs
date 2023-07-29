use crate::io::TempHandler;

use super::audio::play_beep;
use super::io::{FileHandler, SampleMessage, SoundsList};

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn default_sound(msg: &str) {
    println!("Received message from front end ::: {}", msg);
    // Play sound

    play_beep();
}
#[tauri::command]
pub fn upload_sample(message: SampleMessage) {
    FileHandler::save_sample(message);
}

#[tauri::command]
pub fn samples_list() -> SoundsList {
    FileHandler::get_all_entries()
}
