// write audio to new file at temp destination
use std::{
    fs::File,
    io::{Read, Write},
    path::PathBuf,
};

use serde::{Deserialize, Serialize};
pub struct FileHandler;

#[derive(Deserialize, Serialize, Debug)]
pub struct SampleMessage {
    id: u32,
    path: String,
}

pub trait TempHandler {
    const ROOT: PathBuf = std::env::temp_dir();

    fn destination(path: &str) -> PathBuf;
    fn get_all_entries() -> SoundsList;
    fn data_dir() -> PathBuf;
}

pub type SoundsList = Vec<String>;

impl TempHandler for FileHandler {
    fn destination(path: &str) -> PathBuf {
        let path_buf = PathBuf::from(path);

        let segments: Vec<&std::ffi::OsStr> = path_buf.iter().collect();

        let last = segments[segments.len() - 1];

        let mut destination_path: PathBuf = Self::ROOT;

        destination_path.push("bord_data");

        std::fs::create_dir_all(&destination_path).unwrap();
        destination_path.push(last);
        destination_path
    }

    fn data_dir() -> PathBuf {
        let mut destination_path: PathBuf = Self::ROOT;

        destination_path.push("bord_data");

        destination_path
    }

    fn get_all_entries() -> SoundsList {
        let path = Self::data_dir();

        let entries = std::fs::read_dir(path).unwrap();

        let mut full_list: Vec<String> = vec![];

        for entry in entries {
            let entry = entry.unwrap();
            let path = entry.path();

            // Check if the entry is a file.
            if path.is_file() {
                // Get the file name as a string.
                if let Some(file_name) = path.file_name() {
                    if let Some(file_name_str) = file_name.to_str() {
                        full_list.push(file_name_str.to_owned());
                    }
                }
            }
        }

        full_list
    }
}

impl FileHandler {
    pub fn save_sample(message: SampleMessage) {
        let mut file = File::open(&message.path).unwrap();

        let destination = Self::destination(&message.path);
        let metadata = file.metadata().unwrap();

        let file_size = metadata.len();

        let mut buffer: Vec<u8> = Vec::with_capacity(file_size as usize);
        file.read_to_end(&mut buffer).unwrap();

        let mut output_file = File::create(&destination).unwrap();

        output_file.write_all(&buffer);
    }
}
