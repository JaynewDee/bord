use super::audio::play_beep;
use super::io::{SampleHandler, SampleMessage, SoundsList, TempHandler};

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
    SampleHandler::save_sample(message);
}

#[tauri::command]
pub fn samples_list() -> SoundsList {
    let all_samples = SampleHandler::get_all_entries();

    all_samples.iter().for_each(|s| {
        SampleHandler::metadata(s);
    });

    all_samples
}

#[tauri::command]
pub fn delete_sample(name: &str) -> SoundsList {
    SampleHandler::delete_one(name);

    let all_samples = SampleHandler::get_all_entries();

    all_samples
}

#[tauri::command]
pub fn play_sample(name: &str) {
    println!("{}", &name);
    SampleHandler::play_sample(name);
}
