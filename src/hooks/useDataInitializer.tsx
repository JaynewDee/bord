import { Dispatch, SetStateAction, useEffect } from "react";
import { Invoker } from "../ffi/invoke";
import { ACTION, StateDispatch } from "./useStateReducer";

export default function useDataInitializer(stateDispatcher: StateDispatch) {
  useEffect(() => {
    Invoker.initialize().then(([samples, config]) => {
      stateDispatcher({ type: ACTION.UPDATE_SAMPLES, payload: samples });

      stateDispatcher({ type: ACTION.UPDATE_BOARD_CONFIG, payload: config });
    });
  }, []);
}
