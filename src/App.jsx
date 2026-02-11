import { useState, useMemo } from 'react'
import { getTodayString, parseDateString, getSundayOfWeek, getMonthName, navigateMonth, navigateWeek, getWeekDates, formatDisplayDate } from './utils/dateHelpers.js'
import { getHolidaysForYear } from './utils/holidays.js'
import { loadEvents, saveEvents } from './utils/storage.js'
import CalendarHeader from './components/CalendarHeader.jsx'
import MonthView from './components/MonthView.jsx'
import WeekView from './components/WeekView.jsx'
import EventModal from './components/EventModal.jsx'
import EventDetail from './components/EventDetail.jsx'
import './App.css'

function App() {
  const today = getTodayString()
  const todayParsed = parseDateString(today)

  const [events, setEvents] = useState(() => loadEvents())
  const [view, setView] = useState('month')
  const [currentYear, setCurrentYear] = useState(todayParsed.year)
  const [currentMonth, setCurrentMonth] = useState(todayParsed.month)
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getSundayOfWeek(today))

  // Modal state: { mode: 'create' | 'edit', date?, startTime?, event? }
  const [modalState, setModalState] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)

  // Index events by date for fast lookup
  const eventsByDate = useMemo(() => {
    const map = {}
    for (const event of events) {
      if (!map[event.date]) map[event.date] = []
      map[event.date].push(event)
    }
    // Sort events within each day by start time
    for (const date in map) {
      map[date].sort((a, b) => a.startTime.localeCompare(b.startTime))
    }
    return map
  }, [events])

  // Compute holidays for visible years
  const holidays = useMemo(() => {
    const yearsToCompute = new Set([currentYear])
    if (view === 'month') {
      if (currentMonth === 0) yearsToCompute.add(currentYear - 1)
      if (currentMonth === 11) yearsToCompute.add(currentYear + 1)
    } else {
      const weekDates = getWeekDates(currentWeekStart)
      weekDates.forEach(d => {
        const { year } = parseDateString(d)
        yearsToCompute.add(year)
      })
    }
    const combined = new Map()
    for (const y of yearsToCompute) {
      const h = getHolidaysForYear(y)
      for (const [k, v] of h) combined.set(k, v)
    }
    return combined
  }, [currentYear, currentMonth, currentWeekStart, view])

  // Navigation
  function handlePrev() {
    if (view === 'month') {
      const { year, month } = navigateMonth(currentYear, currentMonth, -1)
      setCurrentYear(year)
      setCurrentMonth(month)
    } else {
      setCurrentWeekStart(navigateWeek(currentWeekStart, -1))
    }
  }

  function handleNext() {
    if (view === 'month') {
      const { year, month } = navigateMonth(currentYear, currentMonth, 1)
      setCurrentYear(year)
      setCurrentMonth(month)
    } else {
      setCurrentWeekStart(navigateWeek(currentWeekStart, 1))
    }
  }

  function handleToday() {
    const t = getTodayString()
    const p = parseDateString(t)
    setCurrentYear(p.year)
    setCurrentMonth(p.month)
    setCurrentWeekStart(getSundayOfWeek(t))
  }

  function handleViewChange(newView) {
    if (newView === 'week' && view === 'month') {
      // Switch to week containing first of current month (or today if in current month)
      const tp = parseDateString(today)
      if (tp.year === currentYear && tp.month === currentMonth) {
        setCurrentWeekStart(getSundayOfWeek(today))
      } else {
        const firstDay = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`
        setCurrentWeekStart(getSundayOfWeek(firstDay))
      }
    } else if (newView === 'month' && view === 'week') {
      const { year, month } = parseDateString(currentWeekStart)
      setCurrentYear(year)
      setCurrentMonth(month)
    }
    setView(newView)
  }

  // Event CRUD
  function handleDayClick(date) {
    setModalState({ mode: 'create', date, startTime: null })
  }

  function handleSlotClick(date, startTime) {
    setModalState({ mode: 'create', date, startTime })
  }

  function handleEventClick(event) {
    setSelectedEvent(event)
  }

  function handleSaveEvent(eventData) {
    let updated
    if (eventData.id) {
      updated = events.map(e => e.id === eventData.id ? eventData : e)
    } else {
      const newEvent = { ...eventData, id: `evt_${Date.now()}` }
      updated = [...events, newEvent]
    }
    setEvents(updated)
    saveEvents(updated)
    setModalState(null)
  }

  function handleEditEvent(event) {
    setSelectedEvent(null)
    setModalState({ mode: 'edit', event })
  }

  function handleDeleteEvent(id) {
    const updated = events.filter(e => e.id !== id)
    setEvents(updated)
    saveEvents(updated)
    setSelectedEvent(null)
  }

  // Week view title
  const weekTitle = useMemo(() => {
    if (view !== 'week') return ''
    const dates = getWeekDates(currentWeekStart)
    const start = parseDateString(dates[0])
    const end = parseDateString(dates[6])
    if (start.month === end.month) {
      return `${getMonthName(start.month)} ${start.day} - ${end.day}, ${start.year}`
    }
    if (start.year === end.year) {
      return `${getMonthName(start.month)} ${start.day} - ${getMonthName(end.month)} ${end.day}, ${start.year}`
    }
    return `${getMonthName(start.month)} ${start.day}, ${start.year} - ${getMonthName(end.month)} ${end.day}, ${end.year}`
  }, [view, currentWeekStart])

  return (
    <div className="app">
      <CalendarHeader
        view={view}
        currentYear={currentYear}
        currentMonth={currentMonth}
        weekTitle={weekTitle}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={handleViewChange}
      />

      {view === 'month' ? (
        <MonthView
          year={currentYear}
          month={currentMonth}
          eventsByDate={eventsByDate}
          holidays={holidays}
          onDayClick={handleDayClick}
          onEventClick={handleEventClick}
        />
      ) : (
        <WeekView
          weekStart={currentWeekStart}
          eventsByDate={eventsByDate}
          holidays={holidays}
          onSlotClick={handleSlotClick}
          onEventClick={handleEventClick}
        />
      )}

      {modalState && (
        <EventModal
          event={modalState.mode === 'edit' ? modalState.event : null}
          date={modalState.date}
          startTime={modalState.startTime}
          onSave={handleSaveEvent}
          onClose={() => setModalState(null)}
        />
      )}

      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  )
}

export default App
