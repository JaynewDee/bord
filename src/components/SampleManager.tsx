import React, { Dispatch, SetStateAction } from 'react'
import { UploadSampleForm } from './UploadSample'
import { Samples } from "./Samples";
import "./sample-manager.css";

///////
// Add or Remove samples
///////

interface ManagerProps {
    samples: any,
    setter: Dispatch<SetStateAction<any>>
}

const SampleManager = ({ samples, setter }: ManagerProps) => {
    console.log(samples)
    return (
        <div className="sample-manager">
            <UploadSampleForm setUserSamples={setter} />
            <Samples userSamples={samples} setUserSamples={setter} />
        </div>
    )
}

export default SampleManager