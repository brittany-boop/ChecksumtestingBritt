import { getWeekDates, getTodayString, getDayNames, parseDateString, getHourLabels } from '../utils/dateHelpers.js'
import WeekDayColumn from './WeekDayColumn.jsx'
import './WeekView.css'

function WeekView({ weekStart, eventsByDate, holidays, onSlotClick, onEventClick }) {
  const dates = getWeekDates(weekStart)
  const today = getTodayString()
  const dayNames = getDayNames()
  const hourLabels = getHourLabels()

  return (
    <div className="week-view">
      <div className="week-container">
        <div className="time-gutter">
          <div className="gutter-header" />
          {hourLabels.map((label, i) => (
            <div key={i} className="gutter-label">{label}</div>
          ))}
        </div>
        <div className="week-columns">
          {dates.map((date, i) => {
            const { day } = parseDateString(date)
            return (
              <WeekDayColumn
                key={date}
                date={date}
                isToday={date === today}
                dayLabel={{ name: dayNames[i], day }}
                holiday={holidays.get(date)}
                events={eventsByDate[date] || []}
                onSlotClick={onSlotClick}
                onEventClick={onEventClick}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default WeekView
