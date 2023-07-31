import React from 'react'
import { BoardConfig } from '../ffi/invoke'

///////
// Manage 'Pad' assignments
///////


export default function ConfigBoard({ configuration }: { configuration: BoardConfig | undefined }) {

    console.log(configuration)

    return (
        <div>ConfigBoard</div>
    )
}
