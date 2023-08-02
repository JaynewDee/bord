import "./App.css";
import { useState, useEffect } from "react";
import SoundBoard from "./components/SoundBoard";
import SampleManager from "./components/SampleManager";
import MainNav from "./components/MainNav";
import { Invoker, BoardConfig, AllSamples } from "./ffi/invoke";
import ConfigBoard from "./components/ConfigBoard";
import { useTitlebar } from "./hooks";
import { AllSamplesDefault, DefaultBoardConfig } from "./data";
import useDataInitializer from "./hooks/useDataInitializer";
import { useNumpadListeners } from "./events/keyEvents";

function App() {
  const [userSamples, setUserSamples] = useState<AllSamples>(AllSamplesDefault)

  const [displayState, setDisplayState] = useState("board");

  const [boardConfig, setBoardConfig] = useState<BoardConfig>(DefaultBoardConfig);

  ///////

  useTitlebar("#329ea3")

  useNumpadListeners();
  useDataInitializer(setUserSamples, setBoardConfig)

  const displaySwitch = (state: string) => {
    const displays: { [key: string]: JSX.Element } = {
      "board": <SoundBoard configuration={boardConfig} theme="main" />,
      "samples": <SampleManager samples={userSamples} setter={setUserSamples} />,
      "board_config": <ConfigBoard configuration={boardConfig} userSamples={userSamples} setUserSamples={setUserSamples} />
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
