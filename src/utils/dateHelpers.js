const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function getMonthName(month) {
  return MONTH_NAMES[month]
}

export function getDayNames() {
  return DAY_NAMES
}

export function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export function firstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

export function buildMonthGrid(year, month) {
  const totalDays = daysInMonth(year, month)
  const startDay = firstDayOfMonth(year, month)

  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  const prevMonthDays = daysInMonth(prevYear, prevMonth)

  const cells = []

  for (let i = startDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i
    cells.push({
      date: formatDate(prevYear, prevMonth, day),
      day,
      isCurrentMonth: false
    })
  }

  for (let day = 1; day <= totalDays; day++) {
    cells.push({
      date: formatDate(year, month, day),
      day,
      isCurrentMonth: true
    })
  }

  const remaining = 7 - (cells.length % 7)
  if (remaining < 7) {
    const nextMonth = month === 11 ? 0 : month + 1
    const nextYear = month === 11 ? year + 1 : year
    for (let day = 1; day <= remaining; day++) {
      cells.push({
        date: formatDate(nextYear, nextMonth, day),
        day,
        isCurrentMonth: false
      })
    }
  }

  return cells
}

export function formatDate(year, month, day) {
  const m = String(month + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

export function getTodayString() {
  const now = new Date()
  return formatDate(now.getFullYear(), now.getMonth(), now.getDate())
}

export function parseDateString(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return { year, month: month - 1, day }
}

export function getSundayOfWeek(dateStr) {
  const { year, month, day } = parseDateString(dateStr)
  const d = new Date(year, month, day)
  const dayOfWeek = d.getDay()
  d.setDate(d.getDate() - dayOfWeek)
  return formatDate(d.getFullYear(), d.getMonth(), d.getDate())
}

export function getWeekDates(sundayStr) {
  const { year, month, day } = parseDateString(sundayStr)
  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(year, month, day + i)
    dates.push(formatDate(d.getFullYear(), d.getMonth(), d.getDate()))
  }
  return dates
}

export function navigateMonth(year, month, direction) {
  let newMonth = month + direction
  let newYear = year
  if (newMonth < 0) {
    newMonth = 11
    newYear--
  } else if (newMonth > 11) {
    newMonth = 0
    newYear++
  }
  return { year: newYear, month: newMonth }
}

export function navigateWeek(sundayStr, direction) {
  const { year, month, day } = parseDateString(sundayStr)
  const d = new Date(year, month, day + direction * 7)
  return formatDate(d.getFullYear(), d.getMonth(), d.getDate())
}

export function formatDisplayDate(dateStr) {
  const { year, month, day } = parseDateString(dateStr)
  return `${MONTH_NAMES[month]} ${day}, ${year}`
}

export function formatTime12(time24) {
  const [h, m] = time24.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

export function getHourLabels() {
  const labels = []
  for (let h = 0; h < 24; h++) {
    const period = h >= 12 ? 'PM' : 'AM'
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
    labels.push(`${hour12} ${period}`)
  }
  return labels
}
