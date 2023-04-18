import ToolButton from "./ToolButton"
import { useState, useEffect } from "react";
import axios from 'axios';
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

    const handlePlayClick = async () => {
        try {
            await axios.put("https://api.spotify.com/v1/me/player/play", null, {
                headers: {
                  Authorization: `Bearer ${window.localStorage.getItem("access-token")}`
                },
              })
            console.log("handing playing click");
            window.localStorage.setItem("is-playing", "true")
            setPlaying(true)
        } catch (error) {
            console.log(error);
        }
    }

    const handlePauseClick = async () => {
        try {
            await axios.put("https://api.spotify.com/v1/me/player/pause", null, {
                headers: {
                  Authorization: `Bearer ${window.localStorage.getItem("access-token")}`
                },
              })
            
            console.log("handing pause click");
            window.localStorage.setItem("is-playing", "false")
            setPlaying(false)
        } catch (error) {
            console.log(error);
        }
    }

    const handleLockClick = () => {
        setLocked(true)
    }

    const handleUnlockClick = () => {
        setLocked(false)
    }

    const [showToolbar, setShowToolbar] = useState(false);
    const [locked, setLocked] = useState(false);
    const [playing, setPlaying] = useState(true);

    useEffect(() => {
        setPlaying(window.localStorage.getItem("is-playing") === 'true')
    }, [window.localStorage.getItem("is-playing")]);

    return (
        <div className="toolbar-wrapper" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <div className="toolbar" style={{display: showToolbar ? "flex" : "none"}}>
                <ToolButton icon={faForward}/>
                {!playing ? <ToolButton icon={faPlay} onClick={handlePlayClick}/> : <ToolButton icon={faPause} onClick={handlePauseClick}/>}
                <ToolButton icon={faBackward}/>
                <ToolButton icon={faGear}/>
                {!locked ? <ToolButton icon={faLock} onClick={handleLockClick}/> : <ToolButton icon={faUnlock} onClick={handleUnlockClick}/>}
                <ToolButton icon={faRightFromBracket}/>
            </div>
        </div>
    )
}

export default ToolBar