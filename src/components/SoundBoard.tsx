import Invoker from "../ffi/invoke";
import "./sound-board.css";

const SoundBoard = () => {
    return (
        <div className="soundboard-main">
            <button onClick={Invoker.playBeep}>BEEP</button>
            <button onClick={Invoker.playBeep}>BEEP</button>
            <button onClick={Invoker.playBeep}>BEEP</button>
        </div>
    )
}

export default SoundBoard