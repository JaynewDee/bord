import { Dispatch, SetStateAction } from 'react'
import "./main-nav.css";

const MainNav = (setDisplay: Dispatch<SetStateAction<string>>) => {

    const navigate = (display: string) => setDisplay(display)

    return (
        <nav className="main-nav">
            <p onClick={() => navigate("board")}>My Board</p>
            <span>|</span>
            <p onClick={() => navigate("samples")}>Manage Samples</p>
        </nav>
    )
}

export default MainNav