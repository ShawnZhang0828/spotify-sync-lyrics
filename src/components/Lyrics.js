import "../styles/lyrics.css"

function Lyrics({ lines, currentLineIndex, bg_img }) {
  return (
    <div className="lyrics-container" style={{ backgroundImage: `url(${bg_img})` }}>
        {lines.map((line, index) => {
            return <div key={index} className={`lyrics-line ${currentLineIndex === index ? "current-line" : ""}`}>{line.words}</div>
        })}
    </div>
  )
}

export default Lyrics