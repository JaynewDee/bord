import { Invoker, BoardConfig } from "../ffi/invoke";
import "./sound-board.css";

///////
// Make sounds
///////

const SoundBoard = ({ configuration }: { configuration: BoardConfig | undefined }) => {
    return (
        <div className="soundboard-main">
            <div className="sample-pad">
                <button onClick={Invoker.playBeep}></button>
            </div>
            <div className="sample-pad">
                <button onClick={Invoker.playBeep}></button>
            </div>
            <div className="sample-pad">
                <button onClick={Invoker.playBeep}></button>
            </div>
            <div className="sample-pad">
                <button onClick={Invoker.playBeep}></button>
            </div>
            <div className="sample-pad">
                <button onClick={Invoker.playBeep}>BEEP</button>
            </div>
            <div className="sample-pad">
                <button onClick={Invoker.playBeep}></button>
            </div>
            <div className="sample-pad">
                <button onClick={Invoker.playBeep}></button>
            </div>
            <div className="sample-pad">
                <button onClick={Invoker.playBeep}></button>
            </div>
            <div className="sample-pad">
                <button onClick={Invoker.playBeep}></button>
            </div>
        </div>
    )
}

export default SoundBoard