import Setting from "./Setting";
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
            
            window.localStorage.setItem("is-playing", "false")
            setPlaying(false)
        } catch (error) {
            console.log(error);
        }
    }

    const handlePreviousClick = async () => {
        try {
            await axios.post("https://api.spotify.com/v1/me/player/previous", null, {
                headers: {
                  Authorization: `Bearer ${window.localStorage.getItem("access-token")}`
                },
              })
        } catch (error) {
            console.log(error);
        }
    }

    const handleNextClick = async () => {
        try {
            await axios.post("https://api.spotify.com/v1/me/player/next", null, {
                headers: {
                  Authorization: `Bearer ${window.localStorage.getItem("access-token")}`
                },
              })
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

    const handleSettingClick = () => {
        setShowSetting(showSetting ? !showSetting : true)
    }

    const [showToolbar, setShowToolbar] = useState(false);
    const [locked, setLocked] = useState(false);
    const [playing, setPlaying] = useState(true);
    const [showSetting, setShowSetting] = useState(false);

    useEffect(() => {
        setPlaying(window.localStorage.getItem("is-playing") === 'true')
    }, [window.localStorage.getItem("is-playing")]);

    return (
        <div className="toolbar-wrapper" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <div className="toolbar" style={{display: showToolbar ? "flex" : "none"}}>
                <ToolButton icon={faForward} onClick={handleNextClick}/>
                {!playing ? <ToolButton icon={faPlay} onClick={handlePlayClick}/> : <ToolButton icon={faPause} onClick={handlePauseClick}/>}
                <ToolButton icon={faBackward} onClick={handlePreviousClick}/>
                <ToolButton icon={faGear} onClick={handleSettingClick}/>
                {!locked ? <ToolButton icon={faLock} onClick={handleLockClick}/> : <ToolButton icon={faUnlock} onClick={handleUnlockClick}/>}
                <ToolButton icon={faRightFromBracket}/>
            </div>
            {showSetting && <Setting />}
        </div>
    )
}

export default ToolBar