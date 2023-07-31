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
            {boardState && boardState.length && boardState.map((pad: Pad, idx: number) => theme === "main" ? <SamplePad data={pad} idx={idx} /> : <ConfigPad data={pad} idx={idx} />)}
        </div>
    )
}

const SamplePad = ({ data, idx }: { data: Pad, idx: number }) => {
    return <div className="sample-pad" key={idx}>
        <button onClick={Invoker.playBeep}>{data.name}</button>
    </div>
}

const ConfigPad = ({ data, idx }: { data: Pad, idx: number }) => {
    const [displayDetails, setDisplayDetails] = useState(false)
    return <div className="sample-pad" key={idx} onMouseEnter={() => setDisplayDetails(true)} onMouseLeave={() => setDisplayDetails(false)}>
        <button onClick={Invoker.playBeep}>{displayDetails && data.name}</button>
    </div>
}

export default SoundBoard