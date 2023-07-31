import { BoardConfig } from '../ffi/invoke'
import SoundBoard from './SoundBoard'
import "./config-board.css"

///////
// Manage 'Pad' assignments
///////


export default function ConfigBoard({ configuration }: { configuration: BoardConfig | undefined }) {
    return (
        <article>
            <h3>BOARD CONFIGURATION</h3>
            <SoundBoard configuration={configuration} theme="configure" />
        </article>
    )
}
