import { invoke } from "@tauri-apps/api/tauri";
import { AudioFileUploadMessage } from "../components/UploadSample";

const defaultMsg = (cmnd: string) => `Command ${cmnd} invoked by TS`

enum Command {
    Default = "default_sound",
    Upload = "upload_sample",
    AllSamples = "samples_list",
    BoardConfig = "board_config",
    UpdateConfig = "update_config",
    DeleteSample = "delete_sample",
    PlaySample = "play_sample"
}

export type SampleItem = {
    name: string,
    filename: string,
    duration: number
}

export type SamplesList = {
    list: SampleItem[]
}

export type BoardConfig = {
    pads: Pads,
}

export type Pad = {
    name: string,
    sample: SampleItem | undefined
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

export class Invoker {
    static initialize = async (): Promise<[SamplesList, BoardConfig]> => {
        const samples = await this.samplesList();
        const config = await this.boardConfig();

        return [samples, config]
    }

    static playBeep = async () =>
        await invoke(Command.Default, { msg: defaultMsg(Command.Default) })

    static uploadSample = async (message: AudioFileUploadMessage): Promise<boolean> => {
        return await invoke(Command.Upload, { message })
    }

    static samplesList = async (): Promise<SamplesList> => {
        return await invoke(Command.AllSamples)
    }

    static boardConfig = async (): Promise<BoardConfig> => {
        return await invoke(Command.BoardConfig)
    }

    static updateConfig = async (pad_num: number, sample: SampleItem): Promise<BoardConfig> => {
        return await invoke(Command.UpdateConfig, { pad_num, sample })
    }

    static deleteSample = async (name: string): Promise<SamplesList> => {
        return await invoke(Command.DeleteSample, { name })
    }

    static playSample = async (name: string) => {
        await invoke(Command.PlaySample, { name })
    }
}