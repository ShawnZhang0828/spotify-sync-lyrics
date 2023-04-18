import "../styles/lyrics.css"
import ToolBar from "./ToolBar";

import { useState, useEffect, useRef } from "react";
import axios from "axios";


function Lyrics({ lines, currentLineIndex, bg_img }) {
    var startIndex = Math.max(currentLineIndex - 2, 0);
    startIndex = Math.min(startIndex, lines.length - 6)
    var endIndex = startIndex + 4;

    var displayedLines = lines.slice(startIndex, endIndex + 1);
    if (displayedLines.length === 0) {
        currentLineIndex = 2;
        const myArray = Array.from({ length: 5 }, () => ({ startTimeMs: 0, words: "" }));
        displayedLines = myArray;
        displayedLines[2].words = "Lyrics Not Found.";
        startIndex = 0;     // display lyrics not found as bold font
    }

    const [hiragana, setHiragana] = useState(false);
    const [currentHiragana, setCurrentHiragana] = useState("");
    const [convertedLines, setConvertedLines] = useState("");
    
    const kanjiRefs = useRef([]);
    const hiraganaRefs = useRef([]);

    useEffect(() => {
        const getConvertedHiragana = async (line) => {
            const convertedLines = await Promise.all(
                lines.map(async (line) => {
                    try {
                        const response = await axios.get('http://localhost:8080/convert/line', {
                            params: {
                              data: line.words,
                            },
                        })
                        return response.data
                    } catch (error) {
                        console.log(error);
                    }
                })
            )

            return convertedLines;
            
        }

        if (window.localStorage.getItem('hiragana') === 'true') {
            const hiraganaPromise = getConvertedHiragana();
            hiraganaPromise.then((convertedLines) => {
                setConvertedLines(convertedLines);
            })
        }

        setHiragana(window.localStorage.getItem('hiragana') === 'true');
    }, [window.localStorage.getItem('hiragana'), lines]);

    useEffect(() => {
        if (hiragana) {
            setCurrentHiragana(convertedLines[currentLineIndex])
        }

        // TODO: 
        kanjiRefs.current.forEach((kanjiRef, index) => {
            const kanjiRect = kanjiRef.getBoundingClientRect();
            const hiraganaRef = hiraganaRefs.current[index];
            if (hiraganaRefs.current.length !== 0) {
                console.log(currentHiragana);
                hiraganaRef.style.top = `${kanjiRect.top}px`;
                hiraganaRef.style.left = `${kanjiRect.left}px`;
            }
          });
    }, [currentLineIndex, convertedLines]);



    return (
        <div className="lyrics-container-wrapper" style={{ backgroundImage: `url(${bg_img})` }}>
            <ToolBar />
            <div className="lyrics-container">
                {hiragana ? 
                    <div>
                        {/* <div className={`lyrics-line current-line`}>{lines[currentLineIndex].words}</div> */}
                        {currentHiragana.split('').map((char, index) => (
                            <span
                            key={index}
                            ref={(ref) => (hiraganaRefs.current[index] = ref)}
                            className="hiragana"
                            >
                            {char}
                            </span>
                        ))}
                        {lines[currentLineIndex].words.split('').map((char, index) => (
                            <span key={index} ref={(ref) => (kanjiRefs.current[index] = ref)}>
                            {char}
                            </span>
                        ))}
                        <div className={`lyrics-line converted-hiragana`}>{currentHiragana}</div>
                    </div>
                     : 
                    displayedLines.map((line, index) => {
                        const lineIndex = startIndex + index;
                        const isCurrentLine = currentLineIndex === lineIndex ? "current-line" : "";
                        const isFarLine = lineIndex < currentLineIndex - 1 ||  lineIndex > currentLineIndex + 1 ? "far-line" : "";
                        return <div key={index} 
                                    className={`lyrics-line ${isCurrentLine} ${isFarLine}`}>
                                        {line.words}
                                </div>
                    })
                }
                
            </div>
        </div>
    )
}

export default Lyrics