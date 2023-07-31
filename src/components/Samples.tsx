import { useRef, Dispatch, SetStateAction, MouseEvent } from 'react';
import Invoker from '../ffi/invoke';

import "./samples.css"
import { emit } from '@tauri-apps/api/event';

interface SamplesProps {
    userSamples: any;
    setUserSamples: Dispatch<SetStateAction<any>>
}

function Sample({ s, setSamples }: { s: any, setSamples: any }) {
    const sampleRef = useRef(null);

    const handleDelete = async (_: MouseEvent<HTMLSpanElement>) => {
        const curr = sampleRef.current as any;

        const remaining = await Invoker.deleteSample(curr.textContent);

        setSamples(remaining);
    }

    const handlePlaySample = async () => {
        const curr = sampleRef.current as any;
        emit("play_sample", curr.textContent)
    }

    return (
        <div className="sample-list-item">
            <span className="delete-sample-btn" onClick={handleDelete}>X</span>
            <p className="sample-name" onClick={handlePlaySample} ref={sampleRef}>{s.name}</p>
            <span className="sample-duration"> {formatDuration(s.duration)} </span>
        </div>
    )
}

export function Samples({ userSamples, setUserSamples }: SamplesProps) {
    return (
        <div className="sample-list">
            {
                userSamples && userSamples.length ? userSamples.map((s: { duration: number, name: string }) => <Sample s={s} key={s.name} setSamples={setUserSamples} />) : <></>
            }
        </div>
    )
}

const formatDuration = (duration: number) => duration.toFixed(2) + " s"