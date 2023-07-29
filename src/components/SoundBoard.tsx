import Invoker from "../ffi/invoke";

const SoundBoard = () => {
    return (
        <div>
            <button onClick={Invoker.playBeep}>BEEP</button>
        </div>
    )
}

export default SoundBoard