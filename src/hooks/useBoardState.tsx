import { useState, useEffect } from "react";
import { BoardConfig, Pad } from "../ffi/invoke";

type BoardState = Pad[]

export default function useBoardState(configuration: BoardConfig | undefined) {
    const [boardState, setBoardState] = useState<BoardState>()

    useEffect(() => {
        if (!configuration) return;

        let state = [];

        const { pads } = configuration;

        for (const pad in pads) {
            // @ts-ignore
            state.push(pads[pad])
        }

        setBoardState(state)
    }, [])

    return boardState;
}