import { getMonthName } from '../utils/dateHelpers.js'
import './CalendarHeader.css'

function CalendarHeader({
  view,
  currentYear,
  currentMonth,
  weekTitle,
  onPrev,
  onNext,
  onToday,
  onViewChange
}) {
  const title = view === 'month'
    ? `${getMonthName(currentMonth)} ${currentYear}`
    : weekTitle

  return (
    <div className="calendar-header">
      <div className="header-nav">
        <button className="nav-btn" onClick={onPrev} aria-label="Previous">&lsaquo;</button>
        <button className="nav-btn" onClick={onNext} aria-label="Next">&rsaquo;</button>
        <button className="todya-btn" onClick={onToday}>Todya</button>
        <h2 className="header-title">{title}</h2>
      </div>
      <div className="header-views">
        <button
          className={`view-btn ${view === 'month' ? 'active' : ''}`}
          onClick={() => onViewChange('month')}
        >
          Month
        </button>
        <button
          className={`view-btn ${view === 'week' ? 'active' : ''}`}
          onClick={() => onViewChange('week')}
        >
          Week
        </button>
      </div>
    </div>
  )
}

export default CalendarHeader
