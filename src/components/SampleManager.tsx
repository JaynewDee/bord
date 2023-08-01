import { UploadSampleForm } from './UploadSample'
import { Samples } from "./Samples";
import "./sample-manager.css";
import { GenericSetter, SamplesList } from '../ffi/invoke';

///////
// Add or Remove samples
///////

type SamplesSetter = GenericSetter<SamplesList>;

interface ManagerProps {
    samples: SamplesList,
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