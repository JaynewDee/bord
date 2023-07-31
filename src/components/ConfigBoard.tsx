import React from 'react'
import { BoardConfig } from '../App'

///////
// Manage 'Pad' assignments
///////

export default function ConfigBoard({ configuration }: { configuration: BoardConfig | undefined }) {

    console.log(configuration)

    return (
        <div>ConfigBoard</div>
    )
}
