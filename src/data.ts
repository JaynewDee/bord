import { BoardConfig, Pad, SampleItem } from "./ffi/invoke"
import { BoardState } from "./hooks/useBoardState"

const AllSamplesDefault = {
    list: [
        {
            name: "",
            filename: "",
            duration: 0
        },
        {
            name: "",
            filename: "",
            duration: 0
        },
        {
            name: "",
            filename: "",
            duration: 0
        },
        {
            name: "",
            filename: "",
            duration: 0
        },
        {
            name: "",
            filename: "",
            duration: 0
        },
        {
            name: "",
            filename: "",
            duration: 0
        },
        {
            name: "",
            filename: "",
            duration: 0
        },
        {
            name: "",
            filename: "",
            duration: 0
        },
        {
            name: "",
            filename: "",
            duration: 0
        }

    ]
}


const DefaultSample: SampleItem = {
    name: "",
    filename: "",
    duration: 0
}

const DefaultPad: Pad = {
    name: "",
    sample: DefaultSample
}

const DefaultBoardState: BoardState = Array(9).fill(DefaultPad)


const DefaultBoardConfig: BoardConfig = {
    pads: {
        a1: DefaultPad,
        a2: DefaultPad,
        a3: DefaultPad,
        b1: DefaultPad,
        b2: DefaultPad,
        b3: DefaultPad,
        c1: DefaultPad,
        c2: DefaultPad,
        c3: DefaultPad
    }
}

export {
    AllSamplesDefault,
    DefaultBoardState,
    DefaultBoardConfig
}