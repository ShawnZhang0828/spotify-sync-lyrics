import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ToolButton({ icon, onClick }) {
  return (
    <div className='tool-btn-wrapper'>
        <FontAwesomeIcon icon={icon} onClick={onClick} className='tool-btn'/>
    </div>
  )
}

export default ToolButton