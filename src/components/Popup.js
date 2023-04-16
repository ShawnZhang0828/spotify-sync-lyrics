import Draggable from "react-draggable"

function Popup({ children }) {
  return (
    <Draggable>
      <div className="popup">
        {children}
      </div>
    </Draggable>
  )
}

export default Popup