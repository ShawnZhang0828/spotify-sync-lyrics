import "../styles/lyrics.css"
import ToolBar from "./ToolBar";


function Lyrics({ lines, currentLineIndex, bg_img }) {
    var startIndex = Math.max(currentLineIndex - 2, 0);
    startIndex = Math.min(startIndex, lines.length - 6)
    var endIndex = startIndex + 4;

    var displayedLines = lines.slice(startIndex, endIndex + 1);
    if (displayedLines.length === 0) {
        currentLineIndex = 2;
        const myArray = Array.from({ length: 5 }, () => ({ startTimeMs: 0, words: "  " }));
        displayedLines = myArray;
        displayedLines[2].words = "Lyrics Not Found.";
        startIndex = 0;     // display lyrics not found as bold font
    }

    return (
        <div className="lyrics-container-wrapper" style={{ backgroundImage: `url(${bg_img})` }}>
            <ToolBar />
            <div className="lyrics-container">
                {displayedLines.map((line, index) => {
                    const lineIndex = startIndex + index;
                    const isCurrentLine = currentLineIndex === lineIndex ? "current-line" : "";
                    const isFarLine = lineIndex < currentLineIndex - 1 ||  lineIndex > currentLineIndex + 1 ? "far-line" : "";
                    return <div key={index} 
                                className={`lyrics-line ${isCurrentLine} ${isFarLine}`}>
                                    {line.words}
                            </div>
                })}
            </div>
        </div>
    )
}

export default Lyrics