import { useRef, MouseEvent, useState, MutableRefObject, Dispatch, SetStateAction } from 'react';
import { AllSamples, GenericSetter, Invoker, SampleItem, SamplesList } from '../ffi/invoke';

import "./samples.css"
import { emit } from '@tauri-apps/api/event';
import { ImPencil2 as Pencil } from "react-icons/im"
import { AiOutlinePlusSquare as Plus } from "react-icons/ai"
import { ConfigModeState } from '../App';

export type SamplesSetter = GenericSetter<AllSamples>

interface SampleProps {
    s: SampleItem,
    theme: string,
    setSamples: SamplesSetter,
    setConfigMode: any
}

const SampleOptions = (theme: string, hoverState: boolean, handleEnterEditMode?: any, handleEnterEditNameMode?: any) => {
    return <div className="sample-list-options">
        {theme === "configure" ?
            <button style={hoverState ? { display: "inline-block" } : { display: "none" }} className="sample-hover-add-btn" onClick={handleEnterEditMode}>{Plus({ size: "1.5rem" })}</button>
            : theme === "manager" ?
                <button style={hoverState ? { display: "inline-block" } : { display: "none" }} className="sample-hover-edit-name-btn" onClick={handleEnterEditNameMode}>{Pencil({})}</button>
                : <></>
        }
    </div>
}

function Sample({ s, setSamples, theme, setConfigMode }: SampleProps) {
    const [playState, setPlayState] = useState(false);

    const [hoverState, setHoverState] = useState(false);

    const handleMouseHover = (_: MouseEvent<any>) => setHoverState(true)
    const handleMouseLeave = (_: MouseEvent<any>) => setHoverState(false)

    const sampleRef = useRef(null);

    const handleDelete = (_: MouseEvent<HTMLSpanElement>) => {
        const curr = sampleRef.current as HTMLElement | null;

        curr && curr.textContent && Invoker.deleteSample(curr.textContent).then(remaining => setSamples(remaining));
    }

    const handlePlaySample = () => {
        const current = sampleRef.current as HTMLElement | null;

        console.log(current?.textContent)

        current && current.textContent &&
            emit("play_sample", current.textContent)

        playAnimation(sampleRef, setPlayState);
    }

    const handleEnterEditMode = () => setConfigMode({ mode: "edit", currentSample: s })
    const handleEnterEditNameMode = () => setConfigMode({ mode: "edit_name", currentSample: s })

    return (
        <>
            <p className="animate-bar"></p>
            <div className="sample-list-item" data-play-state={playState} draggable="true" onMouseEnter={handleMouseHover} onMouseLeave={handleMouseLeave}>
                <span className="delete-sample-btn" onClick={handleDelete}>X</span>
                <button className="sample-name" onClick={handlePlaySample} ref={sampleRef} data-duration={s.duration}>{s.name}</button>
                <span className="sample-duration"> {formatDuration(s.duration)}</span>
                {SampleOptions(theme, hoverState, theme === "configure" ? handleEnterEditMode : handleEnterEditNameMode)}
            </div>
        </>
    )
}

type AnimationSetter = GenericSetter<boolean>

function playAnimation(ref: MutableRefObject<null>, setIsPlaying: AnimationSetter) {
    setIsPlaying(true)
    const el = ref.current as any;
    const duration = parseFloat(el.getAttribute("data-duration"));

    el.parentElement.previousSibling.style.animation = `play-sample ${duration}s ease-in`

    setTimeout(() => {
        setIsPlaying(false);
        el.parentElement.previousSibling.style.animation = `none`
    }, duration * 1000);
}

interface SamplesProps {
    userSamples: AllSamples;
    setUserSamples: SamplesSetter;
    setConfigMode: Dispatch<SetStateAction<ConfigModeState>>;
    theme: string
}

export function Samples({ userSamples, setUserSamples, theme, setConfigMode }: SamplesProps) {
    const list = userSamples?.list || [];

    return (
        <div className={`sample-list-${theme}`}>
            {
                list && list.length ? list.map((s: SampleItem) =>
                    <Sample s={s} key={s.name} theme={theme} setSamples={setUserSamples} setConfigMode={setConfigMode} />)
                    :
                    <></>
            }
        </div>
    )
}

const formatDuration = (duration: number) => duration.toFixed(2) + " s";