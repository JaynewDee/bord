use crate::audio::BoardConfig;

use super::audio::{play_beep, Sample};
use super::io::{SampleHandler, SampleMessage, TempHandler};

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn default_sound(msg: &str) {
    println!("Received message from front end ::: {}", msg);
    // Play sound

    let _ = play_beep();
}

#[tauri::command]
pub fn upload_sample(message: SampleMessage) {
    SampleHandler::save_sample(message);
}

#[tauri::command]
pub fn samples_list() -> Vec<Sample> {
    let all_samples = SampleHandler::get_all_entries();

    all_samples.iter().for_each(|s| {
        let _ = SampleHandler::metadata(&s.name);
    });

    all_samples
}

#[tauri::command]
pub fn delete_sample(name: &str) -> Vec<Sample> {
    SampleHandler::delete_one(name);

    let all_samples = SampleHandler::get_all_entries();

    all_samples
}

#[tauri::command]
pub fn board_config() -> BoardConfig {
    SampleHandler::read_board_config()
}
