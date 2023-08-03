import { invoke } from "@tauri-apps/api/tauri";
import { Dispatch, SetStateAction } from "react";

enum Command {
    Default = "default_sound",
    Upload = "upload_sample",
    AllSamples = "samples_list",
    BoardConfig = "board_config",
    UpdateConfig = "update_config",
    DeleteSample = "delete_sample",
    PlaySample = "play_sample",
    Ping = "ping"
}

type UpdateConfigMessage = {
    pad_key: string,
    sample: SampleItem
}

export class Invoker {
    static initialize = async (): Promise<[AllSamples, BoardConfig]> => {
        const samples = await this.samplesList();
        const config = await this.boardConfig();

        return [samples, config]
    }

    static ping = async (sound: string) =>
        await invoke(Command.Ping, { sound })

    static uploadSample = async (message: AudioFileUploadMessage): Promise<boolean> => {
        return await invoke(Command.Upload, { message })
    }

    static samplesList = async (): Promise<AllSamples> => {
        return await invoke(Command.AllSamples)
    }

    static boardConfig = async (): Promise<BoardConfig> => {
        return await invoke(Command.BoardConfig)
    }
    // padKey: "a_1" | "a_2".."b_1" | "c_3" etc
    static updateConfig = async (message: UpdateConfigMessage): Promise<BoardConfig> => {
        return await invoke(Command.UpdateConfig, { message })
    }

    static deleteSample = async (name: string): Promise<AllSamples> => {
        return await invoke(Command.DeleteSample, { name })
    }

    static playSample = async (name: string) => {
        await invoke(Command.PlaySample, { name })
    }
}

export type AudioFileUploadMessage = {
    id: number,
    path: string,
}

export type GenericSetter<T> = Dispatch<SetStateAction<T>>;

export type DropEvent = { event: string, windowLabel: string, payload: string[], id: number };

export type SampleItem = {
    name: string,
    filename: string,
    duration: number
}

export type SamplesList = SampleItem[]

export type AllSamples = {
    list: SamplesList
}

export type BoardConfig = {
    pads: Pads,
}

export type Pad = {
    id: string,
    name: string,
    sample: SampleItem
}

export type Pads = {
    a1: Pad,
    a2: Pad,
    a3: Pad,
    b1: Pad,
    b2: Pad,
    b3: Pad,
    c1: Pad,
    c2: Pad,
    c3: Pad
}