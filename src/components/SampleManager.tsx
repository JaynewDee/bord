import { Samples, SamplesSetter } from "./Samples";
import "./sample-manager.css";
import { AllSamples } from '../ffi/invoke';
import { useFileDrop } from '../hooks';

///////
// Add or Remove samples
///////

interface ManagerProps {
    samples: AllSamples,
    setUserSamples: SamplesSetter,
    setConfigMode: any
}

export default function SampleManager({ samples, setUserSamples, setConfigMode }: ManagerProps) {
    useFileDrop(setUserSamples);

    return (
        <div className="sample-manager">
            <h3>SAMPLE COLLECTION</h3>
            {/* Reuse component with unique "theme flag" */}
            <Samples userSamples={samples} setUserSamples={setUserSamples} theme="manager" setConfigMode={setConfigMode} />
        </div>
    )
}

