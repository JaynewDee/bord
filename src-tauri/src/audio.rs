use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use cpal::{Device, SupportedStreamConfig};
use serde::{Deserialize, Serialize};
use soloud::*;
use std::thread;
use std::time;
use std::{
    fs::{DirEntry, File},
    path::PathBuf,
};

#[derive(Debug, Serialize, Deserialize)]
pub struct BoardConfig {
    pub pads: Pads,
}

impl Default for BoardConfig {
    fn default() -> Self {
        Self {
            pads: Pads::default(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct Sample {
    pub id: String,
    pub name: String,
    pub filename: String,
    pub duration: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Pad {
    name: String,
    sample: Option<Sample>,
}

impl Default for Pad {
    fn default() -> Self {
        Self {
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
            a_1: Pad::default(),
            a_2: Pad::default(),
            a_3: Pad::default(),
            b_1: Pad::default(),
            b_2: Pad::default(),
            b_3: Pad::default(),
            c_1: Pad::default(),
            c_2: Pad::default(),
            c_3: Pad::default(),
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
        let samps = entries
            .into_iter()
            .map(|entry| Sample::from(entry))
            .collect();

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
        let data_type = infer::get_from_path(&p).unwrap();
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

    pub fn play_from_file(filepath: &std::path::PathBuf) -> Result<(), Box<dyn std::error::Error>> {
        let start = time::Instant::now();

        let sl = Soloud::default()?;

        let voice_count = sl.voice_count();
        println!("{}", &voice_count);
        AudioManager::new().with_interruption(filepath, &sl);
        let voice_count = sl.voice_count();
        println!("{}", &voice_count);

        let elapsed = time::Instant::now() - start;

        println!("End of 'play_from_file' ");
        println!("Elapsed duration: {:?}", &elapsed);

        Ok(())
    }
}

use std::sync::{Arc, Mutex};

struct AudioManager {
    // Mutex to hold the currently playing audio sample (if any)
    current_sample: Arc<Mutex<Option<PathBuf>>>,
}

impl AudioManager {
    pub fn new() -> Self {
        Self {
            current_sample: Arc::new(Mutex::new(None)),
        }
    }

    pub fn with_interruption(&self, sample_path: &PathBuf, sl: &Soloud) {
        let mut wav = audio::Wav::default();

        wav.load(sample_path).unwrap();

        // Lock the mutex to check if another sample is playing
        let mut current_sample_guard = self.current_sample.lock().unwrap();

        let audio_handle = sl.play(&wav);

        // If another sample is playing, stop it
        if let Some(_) = &*current_sample_guard {
            sl.stop(audio_handle);
        }

        // Update the currently playing sample
        *current_sample_guard = Some(sample_path.to_owned());

        // Simulate playback for 2 seconds (Replace this with your actual audio playback code)
        while sl.voice_count() > 0 {
            thread::sleep(time::Duration::from_millis(100));
        }
        // Release the lock and reset the current sample to None
        *current_sample_guard = None;
    }
}
