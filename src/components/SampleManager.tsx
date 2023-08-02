import { Samples, SamplesSetter } from "./Samples";
import "./sample-manager.css";
import { AllSamples } from '../ffi/invoke';
import { useFileDrop } from '../hooks/useFileDrop';

///////
// Add or Remove samples
///////

interface ManagerProps {
    samples: AllSamples,
    setter: SamplesSetter
}

function SampleManager({ samples, setter }: ManagerProps) {
    useFileDrop(setter);

    return (
        <div className="sample-manager">
            <Samples userSamples={samples} setUserSamples={setter} theme="manager" />
        </div>
    )
}

export default SampleManager