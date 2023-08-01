import { UploadSampleForm } from './UploadSample'
import { Samples, SamplesSetter } from "./Samples";
import "./sample-manager.css";
import { AllSamples, SamplesList } from '../ffi/invoke';

///////
// Add or Remove samples
///////

interface ManagerProps {
    samples: AllSamples,
    setter: SamplesSetter
}

const SampleManager = ({ samples, setter }: ManagerProps) => {
    return (
        <div className="sample-manager">
            <UploadSampleForm setUserSamples={setter} />
            <Samples userSamples={samples} setUserSamples={setter} theme="manager" />
        </div>
    )
}

export default SampleManager