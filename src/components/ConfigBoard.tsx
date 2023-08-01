import { BoardConfig, GenericSetter, SamplesList } from '../ffi/invoke'
import { Samples } from './Samples'
import SoundBoard from './SoundBoard'
import "./config-board.css"

///////
// Manage 'Pad' assignments
///////

type SamplesSetter = GenericSetter<SamplesList>

interface ConfigProps {
    configuration?: BoardConfig;
    userSamples: SamplesList,
    setUserSamples: SamplesSetter;
}

export default function ConfigBoard({ configuration, userSamples, setUserSamples }: ConfigProps) {
    return (
        <article className="config-page">
            <h3>BOARD CONFIGURATION</h3>
            <section className="board-configuration">
                <Samples userSamples={userSamples} setUserSamples={setUserSamples} theme="configure" />
                <SoundBoard configuration={configuration} theme="configure" />
            </section>
        </article>
    )
}
