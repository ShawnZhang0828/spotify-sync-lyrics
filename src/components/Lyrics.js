function Lyrics({ lines }) {
  return (
    <div>
        {lines.map((line, index) => {
            return <div key={index}>{line.words}</div>
        })}
    </div>
  )
}

export default Lyrics