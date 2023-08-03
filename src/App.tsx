import "./App.css";
import { useState } from "react";
import SoundBoard from "./components/SoundBoard";
import SampleManager from "./components/SampleManager";
import MainNav from "./components/MainNav";
import { BoardConfig, AllSamples, SampleItem } from './ffi/invoke';
import ConfigBoard, { Modes } from "./components/ConfigBoard";
import { useTitlebar } from "./hooks";
import { AllSamplesDefault, DefaultBoardConfig } from "./data";
import useDataInitializer from "./hooks/useDataInitializer";
import { useNumpadListeners } from "./events/keyEvents";

export type ConfigModeState = {
  mode: Modes,
  currentSample?: SampleItem
}

function App() {
  const [userSamples, setUserSamples] = useState<AllSamples>(AllSamplesDefault)
  const [displayState, setDisplayState] = useState("board");
  const [boardConfig, setBoardConfig] = useState<BoardConfig>(DefaultBoardConfig);
  const [configMode, setConfigMode] = useState<ConfigModeState>({ mode: "view", currentSample: undefined })

  ///////

  const configurationPackage = {
    configMode,
    setConfigMode,
    configuration: boardConfig,
    setBoardConfig,
    userSamples,
    setUserSamples
  }

  console.log(boardConfig)
  const sampleManagerPackage = {
    samples: userSamples,
    setUserSamples,
    setConfigMode
  }

  useTitlebar("#329ea3")

  useNumpadListeners()
  useDataInitializer(setUserSamples, setBoardConfig)

  const displaySwitch = (state: string) => {
    const displays: { [key: string]: JSX.Element } = {
      "board": <SoundBoard configuration={boardConfig} theme="main" configMode={configMode} setConfigMode={setConfigMode} />,
      "samples": <SampleManager {...sampleManagerPackage} />,
      "board_config": <ConfigBoard {...configurationPackage} />
    }

    return displays[state] || <></>
  }

  return (
    <main className="App">
      {MainNav(setDisplayState)}
      {displaySwitch(displayState)}
    </main>
  );
}

export default App;
