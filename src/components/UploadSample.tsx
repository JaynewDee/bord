import { Dispatch, SetStateAction } from "react";
import { samplesList, uploadSample } from "../ffi/invoke";
import { listen } from '@tauri-apps/api/event';

export type AudioFileUploadMessage = {
    id: number,
    path: string,
}

type Setter = Dispatch<SetStateAction<any>>;

type DropEvent = { event: string, windowLabel: string, payload: string[], id: number };

function DropZone({ setUserSamples }: { setUserSamples: Setter }) {

    const handleZoneEnter = async (topEvent: any) => {
        await listen("tauri://file-drop", async (e: DropEvent) => {
            const transferEntity: AudioFileUploadMessage = {
                id: e.id,
                path: e.payload[0]
            }

            if (topEvent.target.classList.contains("drop-zone")) {
                await uploadSample(transferEntity)
                await samplesList().then(samples => setUserSamples(samples))
            }
        })
    }

    return (
        <div className="file-drop-zone" onMouseEnter={handleZoneEnter} style={{ height: "3rem", width: "10rem", backgroundColor: "white", margin: "1rem auto" }}>
            <p className="drop-zone">DROP YOUR FILES HERE</p>
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