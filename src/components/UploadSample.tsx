import { Invoker, GenericSetter, SamplesList, DropEvent, AudioFileUploadMessage } from "../ffi/invoke";
import { listen } from '@tauri-apps/api/event';

type SamplesSetter = GenericSetter<SamplesList>;

function DropZone({ setUserSamples }: { setUserSamples: SamplesSetter }) {
    useFileDrop(setUserSamples);

    return (
        <div className="file-drop-zone">
            DROP MP3 SAMPLES ONTO THE WINDOW TO ADD THEM
        </div>
    )
}

export function UploadSampleForm({ setUserSamples }: { setUserSamples: SamplesSetter }) {
    return (
        <div>
            <DropZone setUserSamples={setUserSamples} />
        </div>
    )
}

function useFileDrop(setter: SamplesSetter) {
    const _ = listen("tauri://file-drop", async (e: DropEvent) => {
        const transferEntity: AudioFileUploadMessage = {
            id: e.id,
            path: e.payload[0]
        }

        const saveSuccess = await Invoker.uploadSample(transferEntity);

        if (saveSuccess) {
            Invoker.samplesList().then(samples => setter(samples))
        }
    })
}