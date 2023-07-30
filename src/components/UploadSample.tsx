import { Dispatch, SetStateAction, useEffect } from "react";
import Invoker from "../ffi/invoke";
import { listen } from '@tauri-apps/api/event';

export type AudioFileUploadMessage = {
    id: number,
    path: string,
}

type Setter = Dispatch<SetStateAction<any>>;

type DropEvent = { event: string, windowLabel: string, payload: string[], id: number };

function DropZone({ setUserSamples }: { setUserSamples: Setter }) {

    useEffect(() => {
        useFileDrop(setUserSamples);
    }, [])

    return (
        <div className="file-drop-zone">
            DROP MP3 SAMPLES ONTO THE WINDOW TO ADD THEM
        </div>

    )
}

export function UploadSampleForm({ setUserSamples }: { setUserSamples: Setter }) {
    return (
        <div>
            <DropZone setUserSamples={setUserSamples} />
        </div>
    )
}


function useFileDrop(setter: Dispatch<SetStateAction<any>>) {
    const _ = listen("tauri://file-drop", async (e: DropEvent) => {
        const transferEntity: AudioFileUploadMessage = {
            id: e.id,
            path: e.payload[0]
        }

        await Invoker.uploadSample(transferEntity)
        Invoker.samplesList().then(samples => setter(samples))
    })
}