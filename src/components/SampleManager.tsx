import React, { Dispatch, SetStateAction } from 'react'
import { UploadSampleForm } from './UploadSample'
import { Samples } from "./Samples";

interface ManagerProps {
    samples: any,
    setter: Dispatch<SetStateAction<any>>
}
const SampleManager = ({ samples, setter }: ManagerProps) => {
    return (
        <div>
            <UploadSampleForm setUserSamples={setter} />
            <Samples userSamples={samples} setUserSamples={setter} />
        </div>
    )
}

export default SampleManager