import ToolButton from "./ToolButton"
import { useState } from "react";
import "../styles/toolbar.css"
import { faPlay, faPause, faForward, faBackward, faGear, faLock, faUnlock, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';



function ToolBar() {

    const handleMouseOver = () => {
        if (!locked) {
            setShowToolbar(true);
        }
      };
    
    const handleMouseOut = () => {
        if (!locked) {
            setShowToolbar(false);
        }
    };

    const handleLockClick = () => {
        setLocked(true)
    }

    const handleUnlockClick = () => {
        setLocked(false)
    }

    const [showToolbar, setShowToolbar] = useState(false);
    const [locked, setLocked] = useState(false);

    return (
        <div className="toolbar-wrapper" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <div className="toolbar" style={{display: showToolbar ? "flex" : "none"}}>
                <ToolButton icon={faForward}/>
                <ToolButton icon={faPlay}/>
                <ToolButton icon={faBackward}/>
                <ToolButton icon={faGear}/>
                {!locked ? <ToolButton icon={faLock} onClick={handleLockClick}/> : <ToolButton icon={faUnlock} onClick={handleUnlockClick}/>}
                <ToolButton icon={faRightFromBracket}/>
            </div>
        </div>
    )
}

export default ToolBar