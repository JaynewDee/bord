use super::audio::play_beep;

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
