import Draggable from 'react-draggable';
import '../styles/setting.css'

function Setting() {

    const handleHiraganaChange = (event) => {
        console.log(event.target.checked);
        window.localStorage.setItem("hiragana", event.target.checked)
    };

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
                    <input className="toggle-checkbox" type="checkbox" onChange={() => {}}/>
                    <div className="toggle-switch"></div>
                </label>
            </div>
        </Draggable>
    )
}

export default Setting