import { useEffect, useState } from "react";
import { Invoker, BoardConfig, Pad } from "../ffi/invoke";
import "./sound-board.css";

///////
// Make sounds
///////

const play = (filename: string) => Invoker.playSample(filename);

function SoundBoard({ configuration, theme }: { configuration: BoardConfig | undefined, theme: string }) {
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

    return (
        <div className={`soundboard-${theme}`}>
            {boardState && boardState.length && boardState.map((pad: Pad, idx: number) => theme === "main" ? <SamplePad data={pad} idx={idx} /> : <ConfigPad data={pad} idx={idx} />)}
        </div>
    )
}

const SamplePad = ({ data, idx }: { data: Pad, idx: number }) => {
    return <div className="sample-pad" key={idx}>
        <button onClick={() => data.sample?.filename && play(data.sample.filename)}>{data.name}</button>
    </div>
}

const ConfigPad = ({ data, idx }: { data: Pad, idx: number }) => {
    const [displayDetails, setDisplayDetails] = useState(false)
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const handleMouseEnter = (e: any) => {
        const { clientX, clientY } = e;

        setTooltipPosition({ x: clientX, y: clientY })
        setDisplayDetails(true)
    }

    return <>
        <div className="sample-pad config-pad" key={idx} onMouseEnter={handleMouseEnter} onMouseLeave={() => setDisplayDetails(false)}>
            <button onClick={() => play(data.sample!.filename)}></button>
            <span className="config-pad-details" style={{ left: tooltipPosition.x, top: tooltipPosition.y }}>{displayDetails && data.name}</span>
        </div>
    </>
}

export default SoundBoard