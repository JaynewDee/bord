import { Dispatch, SetStateAction } from 'react';
import { BoardConfig } from '../ffi/invoke'
import { Samples } from './Samples'
import SoundBoard from './SoundBoard'
import "./config-board.css"

///////
// Manage 'Pad' assignments
///////

interface ConfigProps {
    configuration: BoardConfig | undefined;
    userSamples: any,
    setUserSamples: Dispatch<SetStateAction<any>>;
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
