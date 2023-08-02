import "./main-nav.css";
import { GenericSetter } from '../ffi/invoke';

type DisplaySetter = GenericSetter<string>;

function MainNav(setDisplay: DisplaySetter) {

    const navigate = (display: string) => setDisplay(display)

    return (
        <nav className="main-nav">
            <p onClick={() => navigate("board")}>My Board</p>
            <span>|</span>
            <p onClick={() => navigate("samples")}>Manage Samples</p>
            <span>|</span>
            <p onClick={() => navigate("board_config")}>Configure Board</p>
        </nav>
    )
}

export default MainNav