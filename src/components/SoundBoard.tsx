import { Invoker, BoardConfig } from "../ffi/invoke";
import "./sound-board.css";

///////
// Make sounds
///////

const SoundBoard = ({ configuration, theme }: { configuration: BoardConfig | undefined, theme: string }) => {
    return (
        <div className={`soundboard-${theme}`}>
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