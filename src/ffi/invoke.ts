import { invoke } from "@tauri-apps/api/tauri";
import { AudioFileUploadMessage } from "../components/UploadSample";

const defaultMsg = (cmnd: string) => `Command ${cmnd} invoked by TS`

enum Command {
    Default = "default_sound",
    Upload = "upload_sample",
    AllSamples = "samples_list",
    DeleteSample = "delete_sample",
    PlaySample = "play_sample"
}

export default class Invoker {
    static playBeep = async () =>
        await invoke(Command.Default, { msg: defaultMsg(Command.Default) })

    static uploadSample = async (message: AudioFileUploadMessage) => {
        await invoke(Command.Upload, { message })
    }

    static samplesList = async (): Promise<[{ duration: number, name: string }]> => {
        return await invoke(Command.AllSamples)
    }

    static deleteSample = async (name: string) => {
        return await invoke(Command.DeleteSample, { name })
    }

    static playSample = async (name: string) => {
        await invoke(Command.PlaySample, { name })
    }
}