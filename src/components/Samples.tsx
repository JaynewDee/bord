import { useEffect, useState, useRef, Dispatch, SetStateAction } from 'react';
import { deleteSample, samplesList } from '../ffi/invoke';
import "./samples.css"

interface SamplesProps {
    userSamples: any;
    setUserSamples: Dispatch<SetStateAction<any>>
}

export function Samples({ userSamples, setUserSamples }: SamplesProps) {

    useEffect(() => {
        samplesList().then(samples => setUserSamples(samples))
    }, [])

    return (
        <div>
            <h3>Your Samples</h3>
            <div className="sample-list">
                {
                    userSamples ? userSamples.map((s: any) => <Sample s={s} setSamples={setUserSamples} />) : <></>
                }
            </div>
        </div>
    )
}


function Sample({ s, setSamples }: { s: any, setSamples: any }) {
    const sampleRef = useRef(null);

    const handleDelete = async (e: any) => {
        const curr = sampleRef.current as any;

        const remaining = await deleteSample(curr.textContent);

        setSamples(remaining);
    }

    return (
        <div className="sample-list-item">
            <span className="delete-sample-btn" onClick={handleDelete}>X</span>
            <p ref={sampleRef}>{s}</p>
        </div>
    )
}