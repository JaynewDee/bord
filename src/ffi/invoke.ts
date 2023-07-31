import { invoke } from "@tauri-apps/api/tauri";
import { AudioFileUploadMessage } from "../components/UploadSample";

const defaultMsg = (cmnd: string) => `Command ${cmnd} invoked by TS`

enum Command {
    Default = "default_sound",
    Upload = "upload_sample",
    AllSamples = "samples_list",
    BoardConfig = "board_config",
    DeleteSample = "delete_sample",
    PlaySample = "play_sample"
}

export type Sample = {
    name: string,
    filename: string,
    duration: number
}

export type SamplesList = {
    list: Sample[]
}

export type BoardConfig = {
    samples: Sample[],
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

    static deleteSample = async (name: string): Promise<SamplesList> => {
        return await invoke(Command.DeleteSample, { name })
    }

    static playSample = async (name: string) => {
        await invoke(Command.PlaySample, { name })
    }
}