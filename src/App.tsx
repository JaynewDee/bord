import "./App.css";
import { useState, useEffect } from "react";
import SoundBoard from "./components/SoundBoard";
import SampleManager from "./components/SampleManager";
import MainNav from "./components/MainNav";
import { Invoker, BoardConfig, SamplesList } from "./ffi/invoke";
import ConfigBoard from "./components/ConfigBoard";
import { appWindow } from '@tauri-apps/api/window'

const defaultList: SamplesList = {
  list: [
    {
      name: "beep",
      filename: "",
      duration: 0,
    }
  ]
}

function App() {
  const [userSamples, setUserSamples] = useState<SamplesList>(defaultList)

  const [displayState, setDisplayState] = useState("board");

  const [boardConfig, setBoardConfig] = useState<BoardConfig | undefined>();

  ///////
  useEffect(() => {
    document
      .getElementById('titlebar-minimize')?.addEventListener('click', () => appWindow.minimize())
    document
      .getElementById('titlebar-maximize')?.addEventListener('click', () => appWindow.toggleMaximize())
    document
      .getElementById('titlebar-close')?.addEventListener('click', () => appWindow.close())
  }, [])

  useEffect(() => {
    Invoker.initialize().then(([samples, config]) => {
      setUserSamples(samples);
      setBoardConfig(config)
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
