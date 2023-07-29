import { useEffect, useState, useRef, Dispatch, SetStateAction } from 'react';
import Invoker from '../ffi/invoke';

import "./samples.css"
import { emit } from '@tauri-apps/api/event';

interface SamplesProps {
    userSamples: any;
    setUserSamples: Dispatch<SetStateAction<any>>
}

export function Samples({ userSamples, setUserSamples }: SamplesProps) {

    return (
        <div>
            <h3>Your Samples</h3>
            <div className="sample-list">
                {
                    userSamples ? userSamples.map((s: any) => <Sample s={s} key={s} setSamples={setUserSamples} />) : <></>
                }
            </div>
        </div>
    )
}

function Sample({ s, setSamples }: { s: any, setSamples: any }) {
    const sampleRef = useRef(null);

    const handleDelete = async (e: any) => {
        const curr = sampleRef.current as any;

        const remaining = await Invoker.deleteSample(curr.textContent);

        setSamples(remaining);
    }

    const handlePlaySample = async () => {
        const curr = sampleRef.current as any;

        emit("play_sample", curr.textContent)

        // await Invoker.playSample(curr.textContent)
    }

    return (
        <div className="sample-list-item">
            <span className="delete-sample-btn" onClick={handleDelete}>X</span>
            <p onClick={handlePlaySample} ref={sampleRef}>{s}</p>
        </div>
    )
}