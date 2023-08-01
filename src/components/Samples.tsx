import { useRef, MouseEvent, useState, MutableRefObject } from 'react';
import { GenericSetter, Invoker, SampleItem, SamplesList } from '../ffi/invoke';

import "./samples.css"
import { emit } from '@tauri-apps/api/event';

type SamplesSetter = GenericSetter<SamplesList>

interface SamplesProps {
    userSamples: SamplesList;
    setUserSamples: SamplesSetter;
    theme: string
}

interface SampleProps {
    s: SampleItem,
    setSamples: SamplesSetter
}

function Sample({ s, setSamples }: SampleProps) {
    const [playState, setPlayState] = useState(false);

    const sampleRef = useRef(null);

    const handleDelete = async (_: MouseEvent<HTMLSpanElement>) => {
        const curr = sampleRef.current as any;

        const remaining = await Invoker.deleteSample(curr.textContent);

        setSamples(remaining);
    }

    const handlePlaySample = async () => {
        const current = sampleRef.current as any;

        emit("play_sample", current.textContent)

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

function playAnimation(ref: MutableRefObject<null>, stateSetter: AnimationSetter) {
    stateSetter(true)
    const el = ref.current as any;
    const duration = parseFloat(el.getAttribute("data-duration"));

    el.parentElement.previousSibling.style.animation = `play-sample ${duration}s ease-in`

    setTimeout(() => {
        stateSetter(false);
        el.parentElement.previousSibling.style.animation = `none`
    }, duration * 1000);
}

export function Samples({ userSamples, setUserSamples, theme }: SamplesProps) {
    const { list } = userSamples;

    return (
        <div className={`sample-list-${theme}`}>
            {
                list && list.length ? list.map((s: SampleItem) => <Sample s={s} key={s.name} setSamples={setUserSamples} />) : <></>
            }
        </div>
    )
}

const formatDuration = (duration: number) => duration.toFixed(2) + " s";