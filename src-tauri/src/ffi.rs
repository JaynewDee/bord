use crate::audio::{AudioInterface, BoardConfig, SamplesList};

use super::io::{SampleHandler, SampleMessage};

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn default_sound(msg: &str) {
    println!("Received message from front end ::: {}", msg);
    // Play sound

    let _ = AudioInterface::play_beep();
}

#[tauri::command]
pub fn upload_sample(message: SampleMessage) {
    SampleHandler::save_sample(message);
}

#[tauri::command]
pub fn samples_list() -> SamplesList {
    SampleHandler::sample_entries()
}

#[tauri::command]
pub fn delete_sample(name: &str) -> SamplesList {
    SampleHandler::delete_one(name);

    SampleHandler::sample_entries()
}

#[tauri::command]
pub fn board_config() -> BoardConfig {
    SampleHandler::read_board_config()
}
