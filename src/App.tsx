import "./App.css";
import { useState, useEffect } from "react";
import SoundBoard from "./components/SoundBoard";
import SampleManager from "./components/SampleManager";
import MainNav from "./components/MainNav";
import Invoker from "./ffi/invoke";
import ConfigBoard from "./components/ConfigBoard";

type Sample = {
  name: string,
  assignment: string
  filename: string,
  duration: number
}

export type BoardConfig = Sample[]

function App() {
  const [userSamples, setUserSamples] = useState<string[]>([])

  const [displayState, setDisplayState] = useState("board");

  const [boardConfig, setBoardConfig] = useState<BoardConfig | undefined>();

  ///////

  useEffect(() => {
    Invoker.initialize().then(([samples, config]) => {
      setUserSamples(samples.list);
      setBoardConfig(config)
    })
  }, [])

  const displaySwitch = (state: string) => {
    const displays: { [key: string]: JSX.Element } = {
      "board": <SoundBoard configuration={boardConfig} />,
      "samples": <SampleManager samples={userSamples} setter={setUserSamples} />,
      "config_board": <ConfigBoard configuration={boardConfig} />
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
