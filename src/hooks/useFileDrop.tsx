import { listen } from "@tauri-apps/api/event";
import { Dispatch } from "react";
import { Invoker, DropEvent, AudioFileUploadMessage } from "../ffi/invoke";
import { ACTION, ActionUnion } from "./useStateReducer";

export default async function useFileDrop(
  stateDispatcher: Dispatch<ActionUnion>,
) {
  const handleDropEvent = async (e: DropEvent) => {
    const { payload, id } = e;

    if (payload.length < 1) return;

    for (let i = 0; i < payload.length; i++) {
      const transferEntity: AudioFileUploadMessage = {
        id: id,
        path: payload[i],
      };

      await Invoker.uploadSample(transferEntity);
    }

    Invoker.samplesList().then((samples) =>
      stateDispatcher({ type: ACTION.UPDATE_SAMPLES, payload: samples }),
    );
  };

  listen("tauri://file-drop", handleDropEvent);
}
