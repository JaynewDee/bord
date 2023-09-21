import {
  useRef,
  MouseEvent,
  useState,
  MutableRefObject,
  Dispatch,
} from "react";
import { GenericSetter, Invoker, SampleItem } from "../ffi/invoke";

import "./samples.css";
import { emit } from "@tauri-apps/api/event";
import { ImPencil2 as Pencil } from "react-icons/im";
import { AiOutlinePlusSquare as Plus } from "react-icons/ai";
import { ConfigModeState } from "../App";
import { ACTION, ActionUnion, StateDispatch } from "../hooks/useStateReducer";

const SampleOptions = (
  theme: string,
  hoverState: boolean,
  handleEnterEditMode?: any,
  handleEnterEditNameMode?: any,
) => {
  const hoverStyles = hoverState
    ? { display: "inline-block" }
    : { display: "none" };

  return (
    <div className="sample-list-options">
      {theme === "configure" ? (
        <button
          style={hoverStyles}
          className="sample-hover-add-btn"
          onClick={handleEnterEditMode}
        >
          {Plus({ size: "1.5rem" })}
        </button>
      ) : theme === "manager" ? (
        <button
          style={hoverStyles}
          className="sample-hover-edit-name-btn"
          onClick={handleEnterEditNameMode}
        >
          {Pencil({})}
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

type SampleProps = {
  s: SampleItem;
  theme: string;
  configMode: ConfigModeState;
  stateDispatcher: StateDispatch;
};

function Sample({ s, theme, configMode, stateDispatcher }: SampleProps) {
  const [playState, setPlayState] = useState(false);

  const [hoverState, setHoverState] = useState(false);

  const handleMouseHover = (_: MouseEvent<any>) => setHoverState(true);
  const handleMouseLeave = (_: MouseEvent<any>) => setHoverState(false);

  const sampleRef = useRef(null);

  const handleDelete = (_: MouseEvent<HTMLSpanElement>) => {
    const curr = sampleRef.current as HTMLElement | null;

    curr &&
      curr.textContent &&
      Invoker.deleteSample(curr.textContent).then((remaining) =>
        stateDispatcher({ type: ACTION.UPDATE_SAMPLES, payload: remaining }),
      );
  };

  const handlePlaySample = () => {
    const current = sampleRef.current as HTMLElement | null;
    const sampleAvailable = current && s.filename;

    sampleAvailable && emit("play_sample", s.filename);

    playAnimation(sampleRef, setPlayState);
  };

  const handleEnterEditMode = () =>
    stateDispatcher({
      type: ACTION.UPDATE_CONFIG_MODE,
      payload: { mode: "edit", currentSample: s },
    });

  const handleEnterEditNameMode = () =>
    stateDispatcher({
      type: ACTION.UPDATE_CONFIG_MODE,
      payload: { mode: "edit_name", currentSample: s },
    });

  return (
    <>
      <p className="animate-bar"></p>
      <div
        className="sample-list-item"
        data-play-state={playState}
        draggable="true"
        onMouseEnter={handleMouseHover}
        onMouseLeave={handleMouseLeave}
      >
        <span className="delete-sample-btn" onClick={handleDelete}>
          X
        </span>
        <button
          className="sample-name"
          style={
            configMode.currentSample?.name === s.name
              ? { fontStyle: "italic", outline: "1px solid green" }
              : {}
          }
          onClick={handlePlaySample}
          ref={sampleRef}
          data-duration={s.duration}
        >
          {s.name}
        </button>
        <span className="sample-duration"> {formatDuration(s.duration)}</span>
        {SampleOptions(
          theme,
          hoverState,
          theme === "configure" ? handleEnterEditMode : handleEnterEditNameMode,
        )}
      </div>
    </>
  );
}

type AnimationSetter = GenericSetter<boolean>;

function playAnimation(
  ref: MutableRefObject<null>,
  setIsPlaying: AnimationSetter,
) {
  setIsPlaying(true);

  const el = ref.current as any;
  const duration = parseFloat(el.getAttribute("data-duration"));

  el.parentElement.previousSibling.style.animation = `play-sample ${duration}s ease-in`;

  setTimeout(() => {
    setIsPlaying(false);
    el.parentElement.previousSibling.style.animation = `none`;
  }, duration * 1000);
}

interface SamplesProps {
  appState: any;
  theme: string;
  stateDispatcher: Dispatch<ActionUnion>;
}

export function Samples({ appState, theme, stateDispatcher }: SamplesProps) {
  const list = appState.userSamples?.list || [];

  return (
    <div className={`sample-list-${theme}`}>
      {list && list.length ? (
        list.map((s: SampleItem) => (
          <Sample
            s={s}
            theme={theme}
            configMode={appState.configMode}
            stateDispatcher={stateDispatcher}
          />
        ))
      ) : (
        <></>
      )}
    </div>
  );
}

const formatDuration = (duration: number) => duration.toFixed(2) + " s";
