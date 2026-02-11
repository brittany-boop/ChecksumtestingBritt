import EventChip from './EventChip.jsx'
import './MonthDayCell.css'

const MAX_VISIBLE_EVENTS = 2

function MonthDayCell({ cell, isToday, holiday, events, onDayClick, onEventClick }) {
  const visibleEvents = events.slice(0, MAX_VISIBLE_EVENTS)
  const overflowCount = events.length - MAX_VISIBLE_EVENTS

  return (
    <div
      className={`month-day-cell ${cell.isCurrentMonth ? '' : 'other-month'}`}
      onClick={() => onDayClick(cell.date)}
    >
      <div className="day-number-row">
        <span className={`day-number ${isToday ? 'today' : ''}`}>
          {cell.day}
        </span>
      </div>
      {holiday && <div className="holiday-label">{holiday}</div>}
      <div className="day-events">
        {visibleEvents.map(event => (
          <EventChip key={event.id} event={event} onClick={onEventClick} />
        ))}
        {overflowCount > 0 && (
          <div className="more-events">+{overflowCount} more</div>
        )}
      </div>
    </div>
  )
}

export default MonthDayCell
