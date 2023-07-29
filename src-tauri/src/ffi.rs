use std::{
    fs::File,
    io::{Read, Write},
    path::PathBuf,
};

use super::audio::play_beep;
use serde::{Deserialize, Serialize};
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

#[derive(Deserialize, Serialize, Debug)]
pub struct SampleMessage {
    id: u32,
    path: String,
}

#[tauri::command]
pub fn upload_sample(message: SampleMessage) {
    println!("{:?}", &message);
    let mut file = File::open(message.path).unwrap();

    let metadata = file.metadata().unwrap();
    let file_size = metadata.len();

    let mut buffer: Vec<u8> = Vec::with_capacity(file_size as usize);
    file.read_to_end(&mut buffer).unwrap();

    let destination_path: PathBuf = [
        std::env::temp_dir(),
        "bord_data".into(),
        "sample_1.mp3".into(),
    ]
    .iter()
    .collect();

    let mut output_file = File::create(&destination_path).unwrap();

    output_file.write_all(&buffer);
}
