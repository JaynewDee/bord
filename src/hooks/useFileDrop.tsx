import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";
import { SamplesSetter } from "../components/Samples";
import { Invoker, DropEvent, AudioFileUploadMessage } from "../ffi/invoke";

export async function useFileDrop(setter: SamplesSetter) {
    const handleDropEvent = async (e: DropEvent) => {
        const transferEntity: AudioFileUploadMessage = {
            id: e.id,
            path: e.payload[0]
        }

        const saveSuccess = await Invoker.uploadSample(transferEntity);

        if (saveSuccess) {
            Invoker.samplesList().then(samples => setter(samples))
        }
    }

    const unlisten = await listen("tauri://file-drop", handleDropEvent)

    useEffect(() => {
        return unlisten
    }, [])
}