use super::io::SampleHandler;
use crate::audio::{AllSamples, AudioInterface, BoardConfig};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
pub struct SaveSampleMessage {
    id: u32,
    path: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct PadAssignMessage {
    sample_path: String,
    pad_assignment: usize,
}

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn ping(sound: &str) {
    match sound {
        "beep" => {
            let _ = AudioInterface::play_beep();
        }
        _ => {
            let _ = AudioInterface::play_beep();
        }
    };
}

#[tauri::command]
pub fn upload_sample(message: SaveSampleMessage) -> bool {
    if let Ok(_result) = SampleHandler::save_sample(&message.path) {
        true
    } else {
        false
    }
}

#[tauri::command]
pub fn samples_list() -> AllSamples {
    SampleHandler::sample_entries()
}

#[tauri::command]
pub fn delete_sample(name: &str) -> AllSamples {
    SampleHandler::delete_one(name);

    SampleHandler::sample_entries()
}

#[tauri::command]
pub fn board_config() -> BoardConfig {
    SampleHandler::read_board_config()
}
