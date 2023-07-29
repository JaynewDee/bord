import { ChangeEvent, useEffect, useState } from "react";
import { uploadSample } from "../ffi/invoke";
import { UnlistenFn, emit, listen } from '@tauri-apps/api/event';

export type AudioFileUploadMessage = {
    id: number,
    path: string,
}

function DropZone() {

    const handleZoneEnter = async (topEvent: any) => {
        await listen("tauri://file-drop", async (e: { event: string, windowLabel: string, payload: string[], id: number }) => {
            const transferEntity: AudioFileUploadMessage = {
                id: e.id,
                path: e.payload[0]
            }

            if (topEvent.target.classList.contains("drop-zone")) {
                await uploadSample(transferEntity)
            }
        })

    }

    return (
        <div className="file-drop-zone" onMouseEnter={handleZoneEnter} style={{ height: "3rem", width: "10rem", backgroundColor: "white", margin: "1rem auto" }}>
            <p className="drop-zone">DROP YOUR FILES HERE</p>
        </div>
    )
}

export function UploadSampleForm() {
    return (
        <div>
            <DropZone />
        </div>
    )
}