import './EventChip.css'

const CATEGORY_COLORS = {
  work: '#1a73e8',
  social: '#e91e8a',
  personal: '#0d9453'
}

function EventChip({ event, onClick }) {
  const bgColor = CATEGORY_COLORS[event.category] || '#666'

  return (
    <button
      className="event-chip"
      style={{ backgroundColor: bgColor }}
      onClick={(e) => {
        e.stopPropagation()
        onClick(event)
      }}
      title={event.title}
    >
      {event.title}
    </button>
  )
}

export default EventChip
export { CATEGORY_COLORS }
