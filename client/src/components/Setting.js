import Draggable from 'react-draggable';
import '../styles/setting.css'

import { useState } from "react";

function Setting() {

    const handleHiraganaChange = (event) => {
        setHiragana(event.target.checked);
        // Call your function here or perform any other logic
        console.log(event.target.checked);
        window.localStorage.setItem("hiragana", event.target.checked)
    };

    const [hiragana, setHiragana] = useState(false);

    return (
        <Draggable handle='.handle'>
            <div className="popup-wrapper handle">
                <label className='setting-wrapper' id='hiragana-wrapper'>
                    <span className='setting-name'>Hiragana</span>
                    <input className="toggle-checkbox" type="checkbox" onChange={handleHiraganaChange} checked={window.localStorage.getItem("hiragana") === 'true' ? true : false}/>
                    <div className="toggle-switch"></div>
                </label>
            </div>
        </Draggable>
    )
}

export default Setting