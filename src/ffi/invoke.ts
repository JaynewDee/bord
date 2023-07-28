import { invoke } from "@tauri-apps/api/tauri";

const defaultMsg = (cmnd: string) => `Command ${cmnd} invoked by TS`

enum Command {
    Default = "default_sound"
}

export const playBeep = async () =>
    await invoke(Command.Default, { msg: defaultMsg(Command.Default) })
