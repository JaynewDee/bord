import React from 'react'
import { BoardConfig } from '../ffi/invoke'

///////
// Manage 'Pad' assignments
///////


export default function ConfigBoard({ configuration }: { configuration: BoardConfig | undefined }) {
    return (
        <h3>BOARD CONFIGURATION</h3>
    )
}
