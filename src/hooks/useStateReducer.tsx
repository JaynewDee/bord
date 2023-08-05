import { useReducer } from "react";
import { ConfigModeState, AppState } from "../App";
import { AllSamples, BoardConfig } from "../ffi/invoke";
import { AllSamplesDefault, DefaultBoardConfig } from "../data";

export type Display = "board" | "samples" | "board_config";

export enum ACTION {
  UPDATE_SAMPLES = "UPDATE_SAMPLES",
  UPDATE_DISPLAY = "UPDATE_DISPLAY",
  UPDATE_BOARD_CONFIG = "UPDATE_BOARD_CONFIG",
  UPDATE_CONFIG_MODE = "UPDATE_CONFIG_MODE",
}

interface UpdateSamples {
  type: ACTION.UPDATE_SAMPLES;
  payload: AllSamples;
}

interface UpdateDisplay {
  type: ACTION.UPDATE_DISPLAY;
  payload: Display;
}

interface UpdateBoardConfig {
  type: ACTION.UPDATE_BOARD_CONFIG;
  payload: BoardConfig;
}

interface UpdateConfigMode {
  type: ACTION.UPDATE_CONFIG_MODE;
  payload: ConfigModeState;
}

export type ActionUnion =
  | UpdateSamples
  | UpdateDisplay
  | UpdateBoardConfig
  | UpdateConfigMode;

function stateReducer(state: AppState, { type, payload }: ActionUnion) {
  switch (type) {
    case ACTION.UPDATE_SAMPLES:
      return {
        ...state,
        userSamples: payload,
      };
    case ACTION.UPDATE_DISPLAY:
      return {
        ...state,
        displayState: payload,
      };
    case ACTION.UPDATE_CONFIG_MODE:
      return {
        ...state,
        configMode: payload,
      };
    case ACTION.UPDATE_BOARD_CONFIG:
      return {
        ...state,
        boardConfig: payload,
      };
  }
}

const defaultState: AppState = {
  userSamples: AllSamplesDefault,
  displayState: "board",
  boardConfig: DefaultBoardConfig,
  configMode: { mode: "view", currentSample: undefined },
};

export type StateDispatch = React.Dispatch<ActionUnion>;

export type PageProps = {
  appState: {
    userSamples: AllSamples;
    displayState: Display;
    boardConfig: BoardConfig;
    configMode: ConfigModeState;
  };
  stateDispatcher: StateDispatch;
  theme?: string;
};

export const useAppStateReducer = () => useReducer(stateReducer, defaultState);
