import { Samples } from "./Samples";
import "./sample-manager.css";
import { useFileDrop } from "../hooks";
import { PageProps } from "../hooks/useStateReducer";

///////
// Add or Remove samples
///////

export default function SampleManager({
  appState,
  stateDispatcher,
}: PageProps) {
  useFileDrop(stateDispatcher);

   return (
    <div className="sample-manager" style={{backdropFilter: "blur(3px)"}}>
      <h3>SAMPLE COLLECTION</h3>
      {!appState.userSamples.list.length ? (
        <p className="get-started">
          Start dropping mp3 files into the window here to get started!
        </p>
      ) : (
        <></>
      )}
      <Samples
        appState={appState}
        stateDispatcher={stateDispatcher}
        theme="manager"
      />
    </div>
  );
}
