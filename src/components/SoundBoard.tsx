import { useState, MouseEvent, Dispatch } from "react";
import { Invoker, Pad } from "../ffi/invoke";
import "./sound-board.css";
import { useBoardState, useMouseEnterTooltip } from "../hooks";
import { ConfigModeState } from "../App";
import { emit } from "@tauri-apps/api/event";
import { useNumpadListeners } from "../events/keyEvents";
import { ActionUnion, PageProps, ACTION } from "../hooks/useStateReducer";

///////
// Make sounds
///////

const play = (filename: string) => emit("play_sample", filename);

export default function SoundBoard({
  appState,
  stateDispatcher,
  theme,
}: PageProps) {
  const boardState = useBoardState(appState.boardConfig);

  useNumpadListeners();

  return (
    <div className={`soundboard-${theme}`}>
      {boardState.map((pad: Pad, idx: number) =>
        theme === "main" ? (
          <SamplePad data={pad} idx={idx} />
        ) : (
          <ConfigPad
            data={pad}
            configMode={appState.configMode}
            stateDispatcher={stateDispatcher}
          />
        ),
      )}
    </div>
  );
}

const SamplePad = ({ data, idx }: { data: Pad; idx: number }) => {
  const handlePadClick = (_: MouseEvent<HTMLButtonElement>) => {
    data.sample?.filename && play(data.sample.filename);
  };

  return (
    <div className="sample-pad" key={idx}>
      <button
        style={data.sample ? { border: "2px solid green" } : {}}
        onClick={handlePadClick}
      ></button>
    </div>
  );
};

const ConfigPad = ({
  data,
  configMode,
  stateDispatcher,
}: {
  data: Pad;
  configMode: ConfigModeState;
  stateDispatcher: Dispatch<ActionUnion>;
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [displayDetails, setDisplayDetails] = useState(false);

  const [handleMouseEnter, handleMouseLeave] = useMouseEnterTooltip(
    setTooltipPosition,
    setDisplayDetails,
  );

  const detailStyles = displayDetails
    ? { left: tooltipPosition.x, top: tooltipPosition.y }
    : { display: "none" };

  const buttonStyles =
    data.name === "Unassigned" ? { border: "1px solid grey" } : {};

  const handlePadClick = (_: any) => {
    if (configMode.mode !== "edit") return;

    const shouldUpdate = configMode && configMode.currentSample && data.id;

    shouldUpdate &&
      Invoker.updateConfig({
        pad_key: data.id,
        sample: configMode.currentSample!,
      }).then((newConfig) => {
        stateDispatcher({
          type: ACTION.UPDATE_BOARD_CONFIG,
          payload: newConfig,
        });
      });

    stateDispatcher({
      type: ACTION.UPDATE_CONFIG_MODE,
      payload: { mode: "view", currentSample: undefined },
    });
  };

  const assignedStyles = { border: "2px solid green", borderRadius: "5px" };

  const handleClickPlayable = () =>
    data.sample?.filename &&
    configMode.mode === "view" &&
    play(data.sample.filename);

  return (
    <>
      <div
        style={data.sample ? assignedStyles : {}}
        className="config-pad"
        data-config-mode={configMode.mode}
        key={data.id}
        onClick={handlePadClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button onClick={handleClickPlayable} style={buttonStyles}></button>
        <span className="config-pad-details" style={detailStyles}>
          {displayDetails && data.name}
        </span>
      </div>
    </>
  );
};
