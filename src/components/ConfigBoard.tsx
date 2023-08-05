import { useEffect } from "react";
import { Invoker } from "../ffi/invoke";
import { Samples } from "./Samples";
import SoundBoard from "./SoundBoard";
import "./config-board.css";
import { ACTION, PageProps } from "../hooks/useStateReducer";

///////
// Manage 'Pad' assignments
///////

export type Modes = "view" | "edit" | "edit_name";

export default function ConfigBoard({ appState, stateDispatcher }: PageProps) {
  useEffect(() => {
    const handleClickOff = (e: any) => {
      const isValidTarget = Array.from(e.target.classList).includes(
        "config-page",
      );

      if (isValidTarget) {
        stateDispatcher({
          type: ACTION.UPDATE_CONFIG_MODE,
          payload: { mode: "view", currentSample: undefined },
        });
      }
    };

    document.addEventListener("click", handleClickOff);

    return () => document.removeEventListener("click", handleClickOff);
  }, []);

  const handleBoardReset = () => {
    Invoker.resetBoardConfig().then((newConfig) => {
      stateDispatcher({ type: ACTION.UPDATE_BOARD_CONFIG, payload: newConfig });

      stateDispatcher({
        type: ACTION.UPDATE_CONFIG_MODE,
        payload: { mode: "view", currentSample: undefined },
      });
    });
  };

  const { configMode, userSamples } = appState;

  return (
    <article className="config-page" style={{backdropFilter: "blur(3px)"}}>
      <h3>BOARD CONFIGURATION</h3>
      <h5 className="mode-header">
        Mode:{" "}
        <span
          className="mode-header-value"
          style={
            configMode.mode === "edit"
              ? { color: "green" }
              : { color: "rgba(0, 59, 159, 1)" }
          }
        >
          {configMode.mode.toUpperCase()}
        </span>
      </h5>
      <section className="board-configuration">
        {/* Reuse component with unique "theme flag" */}
        <Samples
          theme="configure"
          appState={appState}
          stateDispatcher={stateDispatcher}
        />
        <SoundBoard
          appState={appState}
          stateDispatcher={stateDispatcher}
          theme="configure"
        />
      </section>
      <section className="config-tools-section">
        <button className="reset-pads-btn" onClick={handleBoardReset}>
          RESET ALL
        </button>

        <button className="reset-pads-btn" onClick={handleBoardReset}>
          RESET ALL
        </button>

        <button className="reset-pads-btn" onClick={handleBoardReset}>
          RESET ALL
        </button>
      </section>
      <section className="board-config-footer-section"></section>
    </article>
  );
}
