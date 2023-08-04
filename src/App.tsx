import "./App.css";
import SoundBoard from "./components/SoundBoard";
import SampleManager from "./components/SampleManager";
import MainNav from "./components/MainNav";
import { BoardConfig, AllSamples, SampleItem } from "./ffi/invoke";
import ConfigBoard, { Modes } from "./components/ConfigBoard";
import { useTitlebar } from "./hooks";
import useDataInitializer from "./hooks/useDataInitializer";
import { ActionUnion, Display, useStateReducer } from "./hooks/useStateReducer";
import { Dispatch } from "react";

export interface AppReducerState {
  userSamples: AllSamples;
  displayState: Display;
  boardConfig: BoardConfig;
  configMode: ConfigModeState;
}

export type ConfigModeState = {
  mode: Modes;
  currentSample?: SampleItem;
};

function App() {
  const [state, dispatch]: [AppReducerState, Dispatch<ActionUnion>] =
    useStateReducer();

  ///////

  console.log(state.configMode.mode)

  useTitlebar("#121212");

  useDataInitializer(dispatch);

  const displaySwitch = (displayState: string) => {
    const displays: { [key: string]: JSX.Element } = {
      board: (
        <SoundBoard appState={state} stateDispatcher={dispatch} theme="main" />
      ),
      samples: <SampleManager appState={state} stateDispatcher={dispatch} />,
      board_config: <ConfigBoard appState={state} stateDispatcher={dispatch} />,
    };

    return displays[displayState] || <></>;
  };

  return (
    <main className="App">
      {MainNav(dispatch)}
      {displaySwitch(state.displayState)}
    </main>
  );
}

export default App;
