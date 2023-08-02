import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";
import { SamplesSetter } from "../components/Samples";
import { Invoker, DropEvent, AudioFileUploadMessage } from "../ffi/invoke";

export default async function useFileDrop(setter: SamplesSetter) {
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

    listen("tauri://file-drop", handleDropEvent)
}