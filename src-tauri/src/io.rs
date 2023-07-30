// write audio to new file at temp destination
use std::{
    fs::{File, OpenOptions},
    io::{Read, Seek, Write},
    path::{Path, PathBuf},
};

use super::audio::{play_from_file, BoardConfig, Sample};
use serde::{Deserialize, Serialize};
pub struct SampleHandler;

#[derive(Deserialize, Serialize, Debug)]
pub struct SampleMessage {
    id: u32,
    path: String,
}

trait PathManager<P: AsRef<Path> + ?Sized> {
    fn carve(dir: &P) -> ();
    fn temp() -> P;
    fn append(source: &mut P, target: &P) -> P;
    fn filename(p: &mut P) -> P;
}

impl PathManager<PathBuf> for SampleHandler {
    fn carve(dir: &PathBuf) {
        std::fs::create_dir_all(dir).unwrap();
    }
    fn temp() -> PathBuf {
        std::env::temp_dir()
    }
    fn append(source: &mut PathBuf, target: &PathBuf) -> PathBuf {
        source.push(target);
        source.to_path_buf()
    }
    fn filename(p: &mut PathBuf) -> PathBuf {
        if let Some(segment) = p.file_name() {
            return PathBuf::from(segment);
        }
        PathBuf::new()
    }
}
trait FileManager<F: Read + Write + Seek, P: PathManager<Path> + ?Sized> {
    fn dir_entries(dir: P) -> Vec<F>;
}

trait AudioAware<A, F> {
    fn duration(f: &F) -> f64;
    fn mime_type(p: PathBuf) -> String;
}

impl SampleHandler {
    fn destination(path: &str) -> PathBuf {
        let path_buf = PathBuf::from(path);

        let segments: Vec<&std::ffi::OsStr> = path_buf.iter().collect();

        let last = segments[segments.len() - 1];

        let mut destination_path: PathBuf = std::env::temp_dir();

        destination_path.push("bord_data");

        Self::carve_path(&destination_path);

        destination_path.push(last);
        destination_path
    }

    fn carve_path(dir: &PathBuf) {
        std::fs::create_dir_all(dir).unwrap();
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

    pub fn get_all_entries() -> Vec<Sample> {
        let path = Self::data_dir();

        let entries = std::fs::read_dir(path).unwrap();

        let mut samples_list: Vec<Sample> = vec![];

        for entry in entries {
            let path = entry.unwrap().path();
            Self::mime_type(&path);
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

    fn mime_type(path: &PathBuf) -> String {
        let data_type = infer::get_from_path(path).unwrap();
        data_type.unwrap().mime_type().to_string()
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

    fn check_exists(path: &PathBuf) -> bool {
        let file = OpenOptions::new().open(path);

        if let Ok(read) = file {
            println!("Pre-existing config found.");
            true
        } else {
            println!("Config not found.");
            false
        }
    }

    fn init_board_config() {
        println!("Initializing config ... ");
        let mut config_path = Self::config_dir();

        Self::carve_path(&config_path);

        config_path.push("board_config.json");

        println!("{:#?}", &config_path);
        let file = OpenOptions::new().create(true).open(&config_path);

        println!("{:#?}", &file);
    }

    pub fn read_board_config() -> BoardConfig {
        let mut temp_path = Self::config_dir();

        temp_path.push("board_config.json");

        if !Self::check_exists(&temp_path) {
            Self::init_board_config();
        };

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
