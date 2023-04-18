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
        displayedLines = lines;
        startIndex = 0;     // display lyrics not found as bold font
    }

    const [hiragana, setHiragana] = useState(false);
    const [currentHiragana, setCurrentHiragana] = useState("");
    const [convertedLines, setConvertedLines] = useState("");
    const [spanElements, setSpanElements] = useState([]);
    
    const kanjiRefs = useRef([]);

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
        const spans = [];

        const getHiraganaSegments = () => {
            var i = 0, j = 0;
            var currentKanjis = lines[currentLineIndex].words, 
                currentHiraganas = convertedLines[currentLineIndex]
            var kanjiRect, left, width;

            // console.log("Kanji =>", currentKanjis, "\nHiragana =>", currentHiraganas);
            
            
            while (i < currentKanjis.length) {
                var nextSameIndex = -1;
                if (currentKanjis[i] !== currentHiraganas[j]) {
                    var unmatchSection = ""
                    // get the bounding box for the left Kanji character
                    kanjiRect = kanjiRefs.current[i].getBoundingClientRect();
                    left = kanjiRect.left;
                    unmatchSection += currentHiraganas[j];
                    while (j < currentHiraganas.length - 1 && currentHiraganas[j+1] !== currentKanjis[i]) {
                        nextSameIndex = currentKanjis.indexOf(currentHiraganas[j+1], i+1);
                        if (nextSameIndex === -1) {
                            unmatchSection += currentHiraganas[j+1];
                            j++;
                        } else {
                            kanjiRect = kanjiRefs.current[nextSameIndex].getBoundingClientRect();
                            width = kanjiRect.left - left;
                            spans.push(createHiraganaSegment(unmatchSection, left, width))
                            break;
                        }
                    }
                }
                i = nextSameIndex === -1 ? i + 1 : nextSameIndex;
                j++;
            }
        }

        const createHiraganaSegment = (text, left, width) => {
            const center = (left + width/2);
            const span = (
                <span
                  className="hiragana-segment"
                  style={{
                    display: 'inline-block',
                    left: `${left}px`,
                    position: "absolute",
                    transform: `translateX(-50%)`,
                    left: `${center}px`,
                    whiteSpace: 'nowrap'
                  }}>
                  {text}
                </span>
              );
            return span
        }

        if (hiragana && convertedLines.length > 0) {
            setCurrentHiragana(convertedLines[currentLineIndex])
            getHiraganaSegments();
            setSpanElements(spans);
        }
    }, [currentLineIndex, convertedLines, lines]);



    return (
        <div className="lyrics-container-wrapper" style={{ backgroundImage: `url(${bg_img})` }}>
            <ToolBar />
            {hiragana ? 
                <div className="kanji-hiragana-wrapper">
                    <div className="char-wrapper" id="hiragana-char-wrapper">
                        {spanElements.map((span) => span)}
                    </div>
                    
                    <div className="char-wrapper" id="kanji-char-wrapper">
                        {lines[currentLineIndex].words.split('').map((char, index) => (
                            <span key={index} ref={(ref) => (kanjiRefs.current[index] = ref)}>
                            {char}
                            </span>
                        ))}
                    </div>
                </div>
                    : 
                <div className="lyrics-container"> {
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
            }
        </div>
    )
}

export default Lyrics