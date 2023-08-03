import { useState, MouseEvent, Dispatch, SetStateAction } from "react";
import { Invoker, BoardConfig, Pad } from "../ffi/invoke";
import "./sound-board.css";
import { useBoardState, useMouseEnterTooltip } from "../hooks";
import { ConfigModeState } from "../App";
import { emit } from "@tauri-apps/api/event";

///////
// Make sounds
///////

const play = (filename: string) => emit("play_sample", filename);

interface BoardProps {
    configuration: BoardConfig,
    theme: string,
    configMode: ConfigModeState,
    setConfigMode: Dispatch<SetStateAction<ConfigModeState>>
}

export default function SoundBoard({ configuration, theme, configMode, setConfigMode }: BoardProps) {

    const boardState = useBoardState(configuration);

    return (
        <div className={`soundboard-${theme}`}>
            {boardState.map(
                (pad: Pad, idx: number) =>
                    theme === "main" ?
                        <SamplePad data={pad} idx={idx} />
                        : <ConfigPad data={pad} idx={idx} configMode={configMode} setConfigMode={setConfigMode} />
            )}
        </div>
    )
}

const SamplePad = ({ data, idx }: { data: Pad, idx: number }) => {
    const handlePadClick = (_: MouseEvent<HTMLButtonElement>) => {
        data.sample?.filename && play(data.sample.filename)
    }

    return <div className="sample-pad" key={idx}>
        <button style={data.sample ? { border: "2px solid green" } : {}} onClick={handlePadClick}></button>
    </div>
}

const ConfigPad = ({ data, idx, configMode, setConfigMode }: { data: Pad, idx: number, configMode: ConfigModeState, setConfigMode: Dispatch<SetStateAction<ConfigModeState>> }) => {
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [displayDetails, setDisplayDetails] = useState(false)

    const [handleMouseEnter, handleMouseLeave] =
        useMouseEnterTooltip(setTooltipPosition, setDisplayDetails);

    const detailStyles = displayDetails ? { left: tooltipPosition.x, top: tooltipPosition.y } : { display: "none" };
    const buttonStyles = data.name === "Unassigned" ? { border: "1px solid grey" } : {}

    const handlePadClick = (e: any) => {
        if (configMode.mode !== "edit") return;

        configMode &&
            configMode.currentSample &&
            data.id &&
            Invoker.updateConfig({ pad_key: data.id, sample: configMode.currentSample })

        setConfigMode({ mode: "view", currentSample: undefined })

    }

    const assignedStyles = { border: "2px solid green", borderRadius: "5px" };

    return <>
        <div style={data.sample ? assignedStyles : {}} className="config-pad" data-config-mode={configMode.mode} key={idx} onClick={handlePadClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
            <button onClick={() => data.sample?.filename && configMode.mode === "view" && play(data.sample.filename)} style={
                buttonStyles
            }></button>
            <span className="config-pad-details" style={detailStyles}>
                {displayDetails && data.name}
            </span>
        </div>
    </>
}
