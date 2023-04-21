import Draggable from 'react-draggable';
import '../styles/setting.css'

import { useState } from "react";

function Setting() {

    // prevent both hiragana and translate are set to on
    const handleHiraganaChange = (event) => {
        console.log('hiragana', event.target.checked);
        if (!translate && event.target.checked) {
            setHiragana(true)
            console.log(event.target.checked);
            window.localStorage.setItem("hiragana", event.target.checked)
        } else {
            setHiragana(false)
            window.localStorage.setItem("hiragana", false)
        }
    };

    const handleTranslateChange = (event) => {
        if (!hiragana && event.target.checked) {
            setTranslate(true)
            window.localStorage.setItem("translate", event.target.checked)
        } else {
            setTranslate(false)
            window.localStorage.setItem("translate", false)
        }
    }

    const [hiragana, setHiragana] = useState(window.localStorage.getItem("hiragana") === 'true' ? true : false);
    const [translate, setTranslate] = useState(window.localStorage.getItem("translate") === 'true' ? true : false);

    return (
        <Draggable handle='.handle'>
            <div className="popup-wrapper handle">
                <div className='drag-area'>Setting</div>
                <label className='setting-wrapper' id='hiragana-wrapper'>
                    <span className='setting-name'>Hiragana Convert</span>
                    <input className="toggle-checkbox" type="checkbox" onChange={handleHiraganaChange} checked={window.localStorage.getItem("hiragana") === 'true' ? true : false}/>
                    <div className="toggle-switch"></div>
                </label>
                <label className='setting-wrapper' id='translate-wrapper'>
                    <span className='setting-name'>Translate Lyrics</span>
                    <input className="toggle-checkbox" type="checkbox" onChange={handleTranslateChange} checked={window.localStorage.getItem("translate") === 'true' ? true : false}/>
                    <div className="toggle-switch"></div>
                </label>
            </div>
        </Draggable>
    )
}

export default Setting