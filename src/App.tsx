import "./App.css";
import { useState, useEffect } from "react";
import SoundBoard from "./components/SoundBoard";
import SampleManager from "./components/SampleManager";
import MainNav from "./components/MainNav";
import Invoker from "./ffi/invoke";

function App() {
  const [userSamples, setUserSamples] = useState<string[]>([])

  const [displayState, setDisplayState] = useState("board");

  const [boardConfig, setBoardConfig] = useState([]);

  ///////

  useEffect(() => {
    Invoker.samplesList().then((samples: any) => setUserSamples(samples))
    Invoker.boardConfig().then((config: any) => config && setBoardConfig(config)).then(() => console.log(boardConfig))
  }, [])

  const displaySwitch = (state: string) => {
    const displays: { [key: string]: JSX.Element } = {
      "board": <SoundBoard />,
      "samples": <SampleManager samples={userSamples} setter={setUserSamples} />,
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
