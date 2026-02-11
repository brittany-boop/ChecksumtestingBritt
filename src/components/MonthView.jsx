import { buildMonthGrid, getDayNames, getTodayString } from '../utils/dateHelpers.js'
import MonthDayCell from './MonthDayCell.jsx'
import './MonthView.css'

function MonthView({ year, month, eventsByDate, holidays, onDayClick, onEventClick }) {
  const grid = buildMonthGrid(year, month)
  const today = getTodayString()
  const dayNames = getDayNames()

  return (
    <div className="month-view">
      <div className="weekday-headers">
        {dayNames.map(name => (
          <div key={name} className="weekday-header">{name}</div>
        ))}
      </div>
      <div className="month-grid">
        {grid.map(cell => (
          <MonthDayCell
            key={cell.date}
            cell={cell}
            isToday={cell.date === today}
            holiday={holidays.get(cell.date)}
            events={eventsByDate[cell.date] || []}
            onDayClick={onDayClick}
            onEventClick={onEventClick}
          />
        ))}
      </div>
    </div>
  )
}

export default MonthView
