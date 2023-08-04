import { listen } from "@tauri-apps/api/event";
import { Dispatch } from "react";
import { Invoker, DropEvent, AudioFileUploadMessage } from "../ffi/invoke";
import { ACTION, ActionUnion } from "./useStateReducer";

export default async function useFileDrop(
  stateDispatcher: Dispatch<ActionUnion>,
) {
  const handleDropEvent = async (e: DropEvent) => {
    console.log(e.payload)

    const transferEntity: AudioFileUploadMessage = {
      id: e.id,
      path: e.payload[0],
    };

    const saveSuccess = await Invoker.uploadSample(transferEntity);

    if (saveSuccess) {
      Invoker.samplesList().then((samples) =>
        stateDispatcher({ type: ACTION.UPDATE_SAMPLES, payload: samples }),
      );
    }
  };

  listen("tauri://file-drop", handleDropEvent);
}
