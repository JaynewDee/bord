import { useEffect, useState } from "react";
import { Invoker, BoardConfig, Pad } from "../ffi/invoke";
import "./sound-board.css";

///////
// Make sounds
///////


const SoundBoard = ({ configuration, theme }: { configuration: BoardConfig, theme: string }) => {
    const [boardState, setBoardState] = useState<any>()

    useEffect(() => {
        if (!configuration) return;
        let state = [];
        const { pads } = configuration;
        for (const pad in pads) {

            // @ts-ignore
            state.push(pads[pad])
        }
        setBoardState(state)
    }, [])

    console.log(boardState)
    return (
        <div className={`soundboard-${theme}`}>
            {boardState && boardState.length && boardState.map((pad: any) => SamplePad(pad))}
        </div>
    )
}

const SamplePad = (data: Pad) => {
    return <div className="sample-pad">
        <button onClick={Invoker.playBeep}>{data.name}</button>
    </div>
}
export default SoundBoard