import { invoke } from "@tauri-apps/api/tauri";
import { AudioFileUploadMessage } from "../components/UploadSample";

const defaultMsg = (cmnd: string) => `Command ${cmnd} invoked by TS`

enum Command {
    Default = "default_sound",
    Upload = "upload_sample"
}

export const playBeep = async () =>
    await invoke(Command.Default, { msg: defaultMsg(Command.Default) })

export const uploadSample = async (message: AudioFileUploadMessage) => {
    await invoke(Command.Upload, { message })
}