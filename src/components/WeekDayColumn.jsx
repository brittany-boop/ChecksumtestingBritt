import { CATEGORY_COLORS } from './EventChip.jsx'
import './WeekDayColumn.css'

function WeekDayColumn({ date, isToday, dayLabel, holiday, events, onSlotClick, onEventClick }) {
  function handleSlotClick(e) {
    const rect = e.currentTarget.querySelector('.time-slots').getBoundingClientRect()
    const y = e.clientY - rect.top
    const hour = Math.floor(y / 50)
    const clampedHour = Math.max(0, Math.min(23, hour))
    onSlotClick(date, `${String(clampedHour).padStart(2, '0')}:00`)
  }

  return (
    <div className={`week-day-column ${isToday ? 'today-column' : ''}`}>
      <div className="week-day-header">
        <span className="week-day-name">{dayLabel.name}</span>
        <span className={`week-day-number ${isToday ? 'today' : ''}`}>{dayLabel.day}</span>
        {holiday && <span className="week-holiday">{holiday}</span>}
      </div>
      <div className="time-slots-wrapper" onClick={handleSlotClick}>
        <div className="time-slots">
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="time-slot" />
          ))}
          {events.map(event => {
            const [startH, startM] = event.startTime.split(':').map(Number)
            const [endH, endM] = event.endTime.split(':').map(Number)
            const top = (startH + startM / 60) * 50
            const height = Math.max(((endH + endM / 60) - (startH + startM / 60)) * 50, 20)
            const bgColor = CATEGORY_COLORS[event.category] || '#666'

            return (
              <div
                key={event.id}
                className="week-event-block"
                style={{ top: `${top}px`, height: `${height}px`, backgroundColor: bgColor }}
                onClick={(e) => {
                  e.stopPropagation()
                  onEventClick(event)
                }}
                title={event.title}
              >
                <span className="week-event-title">{event.title}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default WeekDayColumn
