// write audio to new file at temp destination
use std::{
    fs::File,
    io::{Read, Write},
    path::PathBuf,
};

use serde::{Deserialize, Serialize};

pub struct SampleHandler;

#[derive(Deserialize, Serialize, Debug)]
pub struct SampleMessage {
    id: u32,
    path: String,
}

pub trait TempHandler {
    fn destination(path: &str) -> PathBuf;
    fn get_all_entries() -> SoundsList;
    fn data_dir() -> PathBuf;
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

impl SampleHandler {
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

    pub fn delete_one(name: &str) {
        let mut data_dir = Self::data_dir();

        data_dir.push(name);

        let path = std::path::Path::new(&data_dir);

        std::fs::remove_file(path);

        println!("Sample {} removed.", &name);
    }

    pub fn metadata(filename: &str) -> Result<std::fs::Metadata, std::io::Error> {
        let mut data_dir = Self::data_dir();
        data_dir.push(filename);

        let mut file = File::open(&data_dir).unwrap();
        let mut tag = id3::Tag::read_from_path(&data_dir).unwrap();

        file.metadata()

        // Get the file size in bytes.
        // let file_size = file.metadata().unwrap().len();

        // // Calculate the total duration in seconds based on the average bit rate and file size.
        // let total_duration = (file_size * 8) as f64 / (average_bit_rate * 1000) as f64;

        // println!("Total duration: {:.2} seconds", total_duration);
        // total_duration
    }
}
