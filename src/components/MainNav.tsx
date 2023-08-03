import "./main-nav.css";
import { Invoker, GenericSetter } from "../ffi/invoke";
import { ACTION, Display, StateDispatch } from "../hooks/useStateReducer";

export default function MainNav(dispatch: StateDispatch) {
  const navigate = (display: Display) =>
    dispatch({ type: ACTION.UPDATE_DISPLAY, payload: display });

  return (
    <nav className="main-nav">
      <p onClick={() => navigate("board")}>My Board</p>
      <span>|</span>
      <p onClick={() => navigate("samples")}>Manage Samples</p>
      <span>|</span>
      <p onClick={() => navigate("board_config")}>Configure Board</p>
      <span style={{ marginLeft: "auto" }}>|</span>
      <p onClick={() => Invoker.ping("beep")}>Ping</p>
    </nav>
  );
}
