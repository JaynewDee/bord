import { useRef, MouseEvent, useState, MutableRefObject } from 'react';
import { AllSamples, GenericSetter, Invoker, SampleItem, SamplesList } from '../ffi/invoke';

import "./samples.css"
import { emit } from '@tauri-apps/api/event';

export type SamplesSetter = GenericSetter<AllSamples>


interface SampleProps {
    s: SampleItem,
    setSamples: SamplesSetter
}

function Sample({ s, setSamples }: SampleProps) {
    const [playState, setPlayState] = useState(false);

    const sampleRef = useRef(null);

    const handleDelete = (_: MouseEvent<HTMLSpanElement>) => {
        const curr = sampleRef.current as HTMLElement | null;

        curr && curr.textContent && Invoker.deleteSample(curr.textContent).then(remaining => setSamples(remaining));
    }

    const handlePlaySample = () => {
        const current = sampleRef.current as HTMLElement | null;

        const sampleName = current?.textContent;

        current && sampleName &&
            emit("play_sample",)

        playAnimation(sampleRef, setPlayState);
    }

    return (
        <>
            <p className="animate-bar"></p>
            <div className="sample-list-item" data-play-state={playState} draggable="true">
                <span className="delete-sample-btn" onClick={handleDelete}>X</span>
                <p className="sample-name" onClick={handlePlaySample} ref={sampleRef} data-duration={s.duration}>{s.name}</p>
                <span className="sample-duration"> {formatDuration(s.duration)} </span>
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
    theme: string
}

export function Samples({ userSamples, setUserSamples, theme }: SamplesProps) {
    const list = userSamples?.list || [];

    return (
        <div className={`sample-list-${theme}`}>
            {
                list && list.length ? list.map((s: SampleItem) => <Sample s={s} key={s.name} setSamples={setUserSamples} />) : <></>
            }
        </div>
    )
}

const formatDuration = (duration: number) => duration.toFixed(2) + " s";