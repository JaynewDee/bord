use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use cpal::{Device, SupportedStreamConfig};
use serde::{Deserialize, Serialize};
use soloud::*;
use std::thread;
use std::time::{self, Duration};
use std::{
    fs::{DirEntry, File},
    path::PathBuf,
};

// Send appropriate message when the sample is on a board but,
//      for whatever reason,
//      it no longer exists
// However, for the most part, we don't want this to ever happen.
//      Find opportunities within other transactions to check for consistency
//          between front and backend state

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct BoardConfig {
    pub pads: Pads,
}

impl From<Vec<Pad>> for BoardConfig {
    fn from(pads: Vec<Pad>) -> Self {
        pads.into_iter()
            .fold(BoardConfig::default(), |mut acc, val| {
                match val.id.as_ref() {
                    "a_1" => acc.pads.a_1 = val,
                    "a_2" => acc.pads.a_2 = val,
                    "a_3" => acc.pads.a_3 = val,
                    "b_1" => acc.pads.b_1 = val,
                    "b_2" => acc.pads.b_2 = val,
                    "b_3" => acc.pads.b_3 = val,
                    "c_1" => acc.pads.c_1 = val,
                    "c_2" => acc.pads.c_2 = val,
                    "c_3" => acc.pads.c_3 = val,
                    _ => (),
                }
                acc
            })
    }
}

#[derive(Debug, Serialize, Deserialize, Default, Clone)]
pub struct Sample {
    pub id: String,
    pub name: String,
    pub filename: String,
    pub duration: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Pad {
    pub id: String,
    pub name: String,
    pub sample: Option<Sample>,
}

impl Default for Pad {
    fn default() -> Self {
        Self {
            id: "".to_string(),
            name: "Unassigned".to_string(),
            sample: None,
        }
    }
}

impl Pad {
    pub fn new(id: &str) -> Self {
        Self {
            id: id.to_string(),
            name: "Unassigned".to_string(),
            sample: None,
        }
    }
}
#[derive(Debug, Serialize, Deserialize)]
pub struct Pads {
    a_1: Pad,
    a_2: Pad,
    a_3: Pad,
    b_1: Pad,
    b_2: Pad,
    b_3: Pad,
    c_1: Pad,
    c_2: Pad,
    c_3: Pad,
}

impl Default for Pads {
    fn default() -> Self {
        Self {
            a_1: Pad::new("a_1"),
            a_2: Pad::new("a_2"),
            a_3: Pad::new("a_3"),
            b_1: Pad::new("b_1"),
            b_2: Pad::new("b_2"),
            b_3: Pad::new("b_3"),
            c_1: Pad::new("c_1"),
            c_2: Pad::new("c_2"),
            c_3: Pad::new("c_3"),
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct PadsIterator {
    pads: Pads,
    current_index: usize,
}

impl Iterator for PadsIterator {
    type Item = Pad;

    fn next(&mut self) -> Option<Self::Item> {
        match self.current_index {
            0 => {
                self.current_index += 1;
                Some(self.pads.a_1.clone())
            }
            1 => {
                self.current_index += 1;
                Some(self.pads.a_2.clone())
            }
            2 => {
                self.current_index += 1;
                Some(self.pads.a_3.clone())
            }
            3 => {
                self.current_index += 1;
                Some(self.pads.b_1.clone())
            }
            4 => {
                self.current_index += 1;
                Some(self.pads.b_2.clone())
            }
            5 => {
                self.current_index += 1;
                Some(self.pads.b_3.clone())
            }
            6 => {
                self.current_index += 1;
                Some(self.pads.c_1.clone())
            }
            7 => {
                self.current_index += 1;
                Some(self.pads.c_2.clone())
            }
            8 => {
                self.current_index += 1;
                Some(self.pads.c_3.clone())
            }
            _ => None,
        }
    }
}

impl IntoIterator for Pads {
    type IntoIter = PadsIterator;
    type Item = Pad;

    fn into_iter(self) -> Self::IntoIter {
        PadsIterator {
            pads: self,
            current_index: 0,
        }
    }
}

pub type SamplesList = Vec<Sample>;

#[derive(Serialize, Deserialize)]
pub struct AllSamples {
    list: SamplesList,
}

impl From<Vec<DirEntry>> for AllSamples {
    fn from(entries: Vec<DirEntry>) -> Self {
        let samps = entries.into_iter().map(Sample::from).collect();

        Self { list: samps }
    }
}

impl From<DirEntry> for Sample {
    fn from(value: DirEntry) -> Self {
        let path = value.path();

        if path.is_file() {
            if let Some(file_name) = path.file_name() {
                if let Some(file_name_str) = file_name.to_str() {
                    let sample = Sample {
                        id: nanoid::nanoid!(),
                        name: file_name_str.to_owned(),
                        filename: file_name_str.to_owned(),
                        // Probably shouldn't open every file just for duration.  Should record duration on save?
                        duration: Self::duration(&File::open(path).unwrap()),
                    };
                    return sample;
                }
            }
        }
        Sample::default()
    }
}

pub trait AudioDetails {
    fn duration(f: &File) -> f64;
    fn mime_type(p: PathBuf) -> String;
}

impl AudioDetails for Sample {
    fn duration(f: &File) -> f64 {
        let duration = mp3_duration::from_file(f).unwrap();
        duration.as_secs_f64()
    }
    fn mime_type(p: PathBuf) -> String {
        let data_type = infer::get_from_path(p).unwrap();
        data_type.unwrap().mime_type().to_string()
    }
}

pub struct AudioInterface;

impl AudioInterface {
    // Default beep sound acts as a ping to audio state on backend
    pub fn play_beep() -> Result<(), anyhow::Error> {
        let (device, config) = Self::output_config()?;
        let sample_rate = config.sample_rate().0 as f32;

        let sample_buffer = Self::generate_sound_sample(440.0, sample_rate, 2.0); // 440Hz sine wave for 2 seconds
        let mut offset = 0;

        let stream = device.build_output_stream(
            &config.into(),
            move |output_buffer: &mut [f32], _| {
                for sample in output_buffer.iter_mut() {
                    *sample = match sample_buffer.get(offset) {
                        Some(&value) => value,
                        None => break,
                    };
                    offset += 1;
                }
            },
            |err| eprintln!("An error occurred on the audio stream: {:?}", err),
            Some(time::Duration::from_secs(5)),
        )?;

        stream.play()?;

        thread::sleep(time::Duration::from_secs(1));

        Ok(())
    }

    fn output_config() -> Result<(Device, SupportedStreamConfig), anyhow::Error> {
        let host = cpal::default_host();
        let device = host
            .default_output_device()
            .expect("Failed to get default output device");
        let config = device
            .default_output_config()
            .expect("Failed to get default output config");
        Ok((device, config))
    }

    fn generate_sound_sample(frequency: f32, sample_rate: f32, duration: f32) -> Vec<f32> {
        let sample_len = (sample_rate * duration) as usize;

        (0..sample_len)
            .map(|i| ((i as f32 * frequency * 2.0 * std::f32::consts::PI / sample_rate).sin()))
            .collect()
    }

    pub fn play_from_file(filepath: std::path::PathBuf) -> Result<(), Box<dyn std::error::Error>> {
        let start = time::Instant::now();

        let mut thread_handles = Vec::new();

        let sample_handle = std::thread::spawn(move || {
            AudioManager::new().with_interruption(filepath);
        });

        thread_handles.push(sample_handle);

        for handle in thread_handles {
            handle.join().unwrap();
        }

        let elapsed = time::Instant::now() - start;

        println!("End of 'play_from_file' ");
        println!("Elapsed duration: {:?}", &elapsed);

        Ok(())
    }
}

use std::sync::{Arc, Mutex};

struct AudioManager {
    current_sample: Arc<Mutex<Option<PathBuf>>>,
}

impl AudioManager {
    pub fn new() -> Self {
        Self {
            current_sample: Arc::new(Mutex::new(None)),
        }
    }

    pub fn with_interruption(&self, sample_path: PathBuf) {
        let sl = Soloud::default().unwrap();

        let mut wav = audio::Wav::default();

        wav.load(sample_path.clone()).unwrap();
        let mut current_sample_guard = self.current_sample.lock().unwrap();

        println!("{:#?}", current_sample_guard);
        let audio_handle = sl.play(&wav);

        if (*current_sample_guard).is_some() {
            sl.stop(audio_handle);

            *current_sample_guard = Some(sample_path);
        }

        while sl.active_voice_count() > 0 {
            thread::sleep(Duration::from_millis(100));
        }

        *current_sample_guard = None;
    }
}
