use std::{
    fs::{DirEntry, File, OpenOptions},
    io::{Read, Seek, Write},
    path::{Path, PathBuf},
};

use crate::{audio::Pad, ffi::PadAssignMessage};

use super::audio::{AllSamples, AudioInterface, BoardConfig, Pads};

pub struct SampleHandler;

trait PathManager<P: AsRef<Path> + ?Sized> {
    fn carve(dir: &P);
    fn temp() -> P;
    fn append(source: &mut P, target: &P) -> P;
    fn filename(p: &mut P) -> P;
    fn exists(p: &P) -> bool;
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

    fn exists(p: &PathBuf) -> bool {
        p.exists()
    }
}
pub trait FileManager<F: Read + Write + Seek> {
    fn dir_entries() -> Vec<DirEntry>;
}

impl FileManager<File> for SampleHandler {
    fn dir_entries() -> Vec<DirEntry> {
        let path = Self::data_dir();

        let mut dir_list: Vec<DirEntry> = vec![];

        let entries = std::fs::read_dir(path).unwrap();

        for entry in entries {
            dir_list.push(entry.unwrap());
        }

        dir_list
    }
}

impl SampleHandler {
    fn sample_destination(source: &str) -> PathBuf {
        let path_buf = PathBuf::from(source);

        let last: PathBuf = path_buf.file_name().unwrap().into();

        let mut destination_path: PathBuf = Self::data_dir();

        Self::carve(&destination_path);

        destination_path.push(last);
        destination_path
    }

    fn data_dir() -> PathBuf {
        let mut destination_path: PathBuf = Self::temp();

        destination_path.push("bord_data");

        destination_path
    }

    fn config_dir() -> PathBuf {
        let mut config_path: PathBuf = Self::temp();

        config_path.push("bord_config");

        config_path
    }

    pub fn file_path(filename: &str) -> PathBuf {
        let mut data_dir = Self::data_dir();

        data_dir.push(filename);

        data_dir
    }

    fn sample_buffer(file: &File) -> Vec<u8> {
        let metadata = file.metadata().unwrap();

        let file_size = metadata.len();

        Vec::with_capacity(file_size as usize)
    }

    pub fn save_sample(path: &str) -> Result<String, anyhow::Error> {
        let mut file = File::open(path).unwrap();
        let destination = Self::sample_destination(path);

        let mut buffer = Self::sample_buffer(&file);
        file.read_to_end(&mut buffer).unwrap();

        let mut output_file = File::create(destination).unwrap();

        output_file.write_all(&buffer)?;

        Ok("Sample saved to user's collection.".to_string())
    }

    pub fn delete_one(name: &str) {
        let mut data_dir = Self::data_dir();

        data_dir.push(name);

        let path = std::path::Path::new(&data_dir);

        let _ = std::fs::remove_file(path);

        println!("Sample {} removed.", &name);
    }

    pub fn play_sample(filename: String) -> Result<(), Box<dyn std::error::Error>> {
        let full_path = Self::file_path(&filename);

        AudioInterface::play_from_file(full_path).unwrap();

        Ok(())
    }

    fn write_board_config(config: BoardConfig) -> Result<(), anyhow::Error> {
        let mut config_path = Self::config_dir();

        config_path.push("board_config.json");

        let file = OpenOptions::new()
            .write(true)
            .create(true)
            .open(&config_path);

        let new_config = serde_json::to_string(&config).unwrap();

        if let Ok(mut created) = file {
            println!("{:#?}", &new_config);
            created.write_all(new_config.as_bytes())?;
        };

        Ok(())
    }

    // Careful!
    pub fn init_board_config() {
        println!("Initializing config ... ");
        let mut config_path = Self::config_dir();

        Self::carve(&config_path);

        config_path.push("board_config.json");

        let file = OpenOptions::new()
            .write(true)
            .create(true)
            .truncate(true)
            .open(&config_path);

        let template = serde_json::to_string(&BoardConfig::default()).unwrap();

        if let Ok(mut creation) = file {
            creation.write_all(template.as_bytes()).unwrap();

            println!(
                "Successfully initialized board configuration @ {:#?}",
                &config_path
            );
        } else {
            println!(
                "Failed to initialize board configuration @ {:#?}",
                &config_path
            )
        }
    }

    pub fn read_board_config() -> BoardConfig {
        let mut temp_path = Self::config_dir();

        temp_path.push("board_config.json");

        if !Self::exists(&temp_path) {
            Self::init_board_config();
        };

        if let Ok(mut config) = File::open(&temp_path) {
            let mut data = String::new();

            config.read_to_string(&mut data).unwrap();

            match serde_json::from_str(&data) {
                Ok(config) => {
                    println!("{:#?}", &config);
                    config
                }
                Err(_e) => {
                    // println!("{}", &data);
                    // println!("{:#?}", e);
                    BoardConfig {
                        pads: Pads::default(),
                    }
                }
            }
        } else {
            BoardConfig {
                pads: Pads::default(),
            }
        }
    }

    pub fn update_config_pad(update_message: PadAssignMessage) -> BoardConfig {
        let sample = update_message.sample;
        let pad_key = update_message.pad_key;

        let prev_config = Self::read_board_config();

        let mut new_config: Vec<Pad> = Vec::with_capacity(9);

        prev_config.pads.into_iter().for_each(|mut p| {
            if p.id == pad_key {
                println!("Key match");
                p.sample = Some(sample.clone());
                p.name = sample.name.to_owned();
            }
            new_config.push(p);
        });

        Self::write_board_config(new_config.into()).unwrap();
        Self::read_board_config()
    }

    pub fn sample_entries() -> AllSamples {
        let entries = Self::dir_entries();

        AllSamples::from(entries)
    }
}
