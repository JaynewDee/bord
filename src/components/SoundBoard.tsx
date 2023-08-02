import { useState, MouseEvent } from "react";
import { Invoker, BoardConfig, Pad } from "../ffi/invoke";
import "./sound-board.css";
import { useBoardState, useMouseEnterTooltip } from "../hooks";

///////
// Make sounds
///////

const play = (filename: string) => Invoker.playSample(filename);

interface BoardProps {
    configuration: BoardConfig,
    theme: string
}

export default function SoundBoard({ configuration, theme }: BoardProps) {

    const boardState = useBoardState(configuration);

    return (
        <div className={`soundboard-${theme}`}>
            {boardState.map(
                (pad: Pad, idx: number) =>
                    theme === "main" ?
                        <SamplePad data={pad} idx={idx} />
                        : <ConfigPad data={pad} idx={idx} />
            )}
        </div>
    )
}

const SamplePad = ({ data, idx }: { data: Pad, idx: number }) => {
    const handlePadClick = (_: MouseEvent<HTMLButtonElement>) => {
        data.sample?.filename && play(data.sample.filename)
    }

    return <div className="sample-pad" key={idx}>
        <button onClick={handlePadClick}>{data.name}</button>
    </div>
}

const ConfigPad = ({ data, idx }: { data: Pad, idx: number }) => {
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [displayDetails, setDisplayDetails] = useState(false)

    const [handleMouseEnter, handleMouseLeave] =
        useMouseEnterTooltip(setTooltipPosition, setDisplayDetails);

    const detailStyles = displayDetails ? { left: tooltipPosition.x, top: tooltipPosition.y } : { display: "none" };

    return <>
        <div className="config-pad" key={idx} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
            <button onClick={() => data.sample?.filename && play(data.sample.filename)} style={
                data.name === "Unassigned" ? { border: "1px solid grey" } : { border: "1px solid green" }
            }></button>
            <span className="config-pad-details" style={detailStyles}>
                {displayDetails && data.name}
            </span>
        </div>
    </>
}
