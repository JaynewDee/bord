import { BoardConfig } from "../App";
import Invoker from "../ffi/invoke";
import "./sound-board.css";

///////
// Make sounds
///////

const SoundBoard = ({ configuration }: { configuration: BoardConfig | undefined }) => {
    console.log(configuration)

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