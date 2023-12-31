import { useState, useEffect } from "react";
import { BoardConfig, Pad } from "../ffi/invoke";
import { DefaultBoardState } from "../data";

export type BoardState = Pad[];

export default function useBoardState(configuration: BoardConfig) {
  const [boardState, setBoardState] = useState<BoardState>(DefaultBoardState);

  useEffect(() => {
    if (!configuration) return;

    let state: Pad[] = [];

    const { pads } = configuration;

    for (const pad in pads) {
      // @ts-ignore
      state.push({ ...pads[pad], id: pad });
    }

    setBoardState(state);
  }, [configuration]);

  return boardState;
}
