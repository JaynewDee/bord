import "./App.css";
import { useState, useEffect } from "react";
import SoundBoard from "./components/SoundBoard";
import SampleManager from "./components/SampleManager";
import MainNav from "./components/MainNav";
import { Invoker, BoardConfig } from "./ffi/invoke";
import ConfigBoard from "./components/ConfigBoard";
import useTitlebar from "./hooks/useTitlebar";

function App() {
  const [userSamples, setUserSamples] = useState<any>()

  const [displayState, setDisplayState] = useState("board");

  const [boardConfig, setBoardConfig] = useState<BoardConfig>();

  ///////

  useTitlebar()

  useEffect(() => {
    Invoker.initialize().then(([samples, config]) => {
      setUserSamples(samples);
      setBoardConfig(config);
    })
  }, [])


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
