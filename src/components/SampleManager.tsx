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

  console.log(appState.configMode.mode);
  return (
    <div className="sample-manager">
      <h3>SAMPLE COLLECTION</h3>
      {/* Reuse component with unique "theme flag" */}
      <Samples
        appState={appState}
        stateDispatcher={stateDispatcher}
        theme="manager"
      />
    </div>
  );
}
