// write audio to new file at temp destination
use std::{
    fs::File,
    io::{Read, Write},
    path::PathBuf,
};

use super::audio::play_from_file;
use super::audio::{BoardConfig, Sample};
use serde::{Deserialize, Serialize};

pub struct SampleHandler;

#[derive(Deserialize, Serialize, Debug)]
pub struct SampleMessage {
    id: u32,
    path: String,
}

pub trait TempHandler {
    fn destination(path: &str) -> PathBuf;
    fn file_path(filename: &str) -> PathBuf;
    fn get_all_entries() -> Vec<Sample>;
    fn data_dir() -> PathBuf;
    fn config_dir() -> PathBuf;
}

pub type SoundsList = Vec<String>;

impl TempHandler for SampleHandler {
    fn destination(path: &str) -> PathBuf {
        let path_buf = PathBuf::from(path);

        let segments: Vec<&std::ffi::OsStr> = path_buf.iter().collect();

        let last = segments[segments.len() - 1];

        let mut destination_path: PathBuf = std::env::temp_dir();

        destination_path.push("bord_data");

        std::fs::create_dir_all(&destination_path).unwrap();
        destination_path.push(last);
        destination_path
    }

    fn data_dir() -> PathBuf {
        let mut destination_path: PathBuf = std::env::temp_dir();

        destination_path.push("bord_data");

        destination_path
    }

    fn config_dir() -> PathBuf {
        let mut config_path: PathBuf = std::env::temp_dir();

        config_path.push("bord_config");

        config_path
    }

    fn get_all_entries() -> Vec<Sample> {
        let path = Self::data_dir();

        let entries = std::fs::read_dir(path).unwrap();

        let mut samples_list: Vec<Sample> = vec![];

        for entry in entries {
            let path = entry.unwrap().path();

            if path.is_file() {
                if let Some(file_name) = path.file_name() {
                    if let Some(file_name_str) = file_name.to_str() {
                        let sample = Sample {
                            name: file_name_str.to_owned(),
                            filename: file_name_str.to_owned(),
                            // Probably shouldn't open every file just for duration.  Should record duration on save?
                            duration: Self::duration(&File::open(path).unwrap()),
                        };
                        samples_list.push(sample);
                    }
                }
            }
        }

        samples_list
    }

    fn file_path(filename: &str) -> PathBuf {
        let mut data_dir = Self::data_dir();

        data_dir.push(filename);

        data_dir
    }
}

impl SampleHandler {
    pub fn save_sample(message: SampleMessage) {
        let mut file = File::open(&message.path).unwrap();
        let destination = Self::destination(&message.path);
        let metadata = file.metadata().unwrap();

        let file_size = metadata.len();

        let mut buffer: Vec<u8> = Vec::with_capacity(file_size as usize);
        file.read_to_end(&mut buffer).unwrap();

        let mut output_file = File::create(&destination).unwrap();

        let _ = output_file.write_all(&buffer);
    }

    fn duration(file: &File) -> f64 {
        let duration = mp3_duration::from_file(&file).unwrap();

        duration.as_secs_f64()
    }

    pub fn delete_one(name: &str) {
        let mut data_dir = Self::data_dir();

        data_dir.push(name);

        let path = std::path::Path::new(&data_dir);

        let _ = std::fs::remove_file(path);

        println!("Sample {} removed.", &name);
    }

    pub fn metadata(filename: &str) -> Result<std::fs::Metadata, std::io::Error> {
        let mut data_dir = Self::data_dir();
        data_dir.push(filename);

        let file = File::open(&data_dir).unwrap();

        file.metadata()
    }

    pub fn play_sample(filename: String) -> Result<(), Box<dyn std::error::Error>> {
        let full_path = Self::file_path(&filename);

        play_from_file(&full_path)?;

        Ok(())
    }

    pub fn read_board_config() -> BoardConfig {
        let mut temp_path = Self::config_dir();
        temp_path.push("board_config.json");

        if let Ok(mut config) = File::open(&temp_path) {
            let mut data = String::new();

            config.read_to_string(&mut data).unwrap();

            if let Ok(config) = serde_json::from_str(&data) {
                config
            } else {
                BoardConfig { samples: vec![] }
            }
        } else {
            BoardConfig { samples: vec![] }
        }
    }
}
