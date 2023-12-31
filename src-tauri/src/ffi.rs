use super::io::SampleHandler;
use crate::audio::{AllSamples, AudioInterface, BoardConfig, Sample};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
pub struct SaveSampleMessage {
    id: u32,
    path: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct PadAssignMessage {
    pub sample: Sample,
    pub pad_key: String,
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
    matches!(SampleHandler::save_sample(&message.path), Ok(_result))
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

#[tauri::command]
pub fn update_config(message: PadAssignMessage) -> BoardConfig {
    SampleHandler::update_config_pad(message)
}

#[tauri::command]
pub fn reset_board_config() -> BoardConfig {
    SampleHandler::init_board_config();
    SampleHandler::read_board_config()
}
