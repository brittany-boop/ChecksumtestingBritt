import { formatDisplayDate, formatTime12 } from '../utils/dateHelpers.js'
import { CATEGORY_COLORS } from './EventChip.jsx'
import './EventDetail.css'

function EventDetail({ event, onEdit, onDelete, onClose }) {
  const bgColor = CATEGORY_COLORS[event.category] || '#666'

  function handleDelete() {
    if (window.confirm(`Delete "${event.title}"?`)) {
      onDelete(event.id)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="event-detail" onClick={e => e.stopPropagation()}>
        <div className="detail-header">
          <div className="detail-category-dot" style={{ backgroundColor: bgColor }} />
          <h3 className="detail-title">{event.title}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="detail-info">
          <p className="detail-date">{formatDisplayDate(event.date)}</p>
          <p className="detail-time">
            {formatTime12(event.startTime)} - {formatTime12(event.endTime)}
          </p>
          <p className="detail-category">
            <span className="category-badge" style={{ backgroundColor: bgColor }}>
              {event.category}
            </span>
          </p>
          {event.description && (
            <p className="detail-description">{event.description}</p>
          )}
        </div>
        <div className="detail-actions">
          <button className="btn-edit" onClick={() => onEdit(event)}>Edit</button>
          <button className="btn-delete" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default EventDetail
