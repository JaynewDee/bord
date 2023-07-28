import "./App.css";
import { playBeep } from "./ffi/invoke";
import { UploadSampleForm } from './components/UploadSample'
function App() {

  ///////

  return (
    <div className="container">
      <UploadSampleForm />
      <button onClick={playBeep}>BEEP</button>
    </div>
  );
}

export default App;
