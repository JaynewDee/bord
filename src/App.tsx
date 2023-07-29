import "./App.css";
import { useState } from "react";
import Invoker from "./ffi/invoke";
import { UploadSampleForm } from './components/UploadSample'
import { Samples } from "./components/Samples";

function App() {
  const [userSamples, setUserSamples] = useState([])

  ///////

  return (
    <div className="container">
      <UploadSampleForm setUserSamples={setUserSamples} />
      <button onClick={Invoker.playBeep}>BEEP</button>
      <Samples userSamples={userSamples} setUserSamples={setUserSamples} />
    </div>
  );
}

export default App;
