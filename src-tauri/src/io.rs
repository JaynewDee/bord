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

pub trait TempFileHandler {
    fn destination(path: &str) -> PathBuf;
}

impl TempFileHandler for FileHandler {
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
