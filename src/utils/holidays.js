import { formatDate } from './dateHelpers.js'

function nthWeekdayOfMonth(year, month, weekday, n) {
  const first = new Date(year, month, 1)
  let dayOfWeek = first.getDay()
  let date = 1 + ((weekday - dayOfWeek + 7) % 7) + (n - 1) * 7
  return date
}

function lastMondayOfMonth(year, month) {
  const lastDay = new Date(year, month + 1, 0)
  const dayOfWeek = lastDay.getDay()
  const offset = (dayOfWeek - 1 + 7) % 7
  return lastDay.getDate() - offset
}

export function getHolidaysForYear(year) {
  const holidays = new Map()

  // New Year's Day - January 1
  holidays.set(formatDate(year, 0, 1), "New Year's Day")

  // MLK Day - 3rd Monday of January
  const mlk = nthWeekdayOfMonth(year, 0, 1, 3)
  holidays.set(formatDate(year, 0, mlk), 'MLK Day')

  // Presidents' Day - 3rd Monday of February
  const presidents = nthWeekdayOfMonth(year, 1, 1, 3)
  holidays.set(formatDate(year, 1, presidents), "Presidents' Day")

  // Memorial Day - Last Monday of May
  const memorial = lastMondayOfMonth(year, 4)
  holidays.set(formatDate(year, 4, memorial), 'Memorial Day')

  // Juneteenth - June 19
  holidays.set(formatDate(year, 5, 19), 'Juneteenth')

  // Independence Day - July 4
  holidays.set(formatDate(year, 6, 4), 'Independence Day')

  // Labor Day - 1st Monday of September
  const labor = nthWeekdayOfMonth(year, 8, 1, 1)
  holidays.set(formatDate(year, 8, labor), 'Labor Day')

  // Columbus Day - 2nd Monday of October
  const columbus = nthWeekdayOfMonth(year, 9, 1, 2)
  holidays.set(formatDate(year, 9, columbus), 'Columbus Day')

  // Veterans Day - November 11
  holidays.set(formatDate(year, 10, 11), 'Veterans Day')

  // Thanksgiving - 4th Thursday of November
  const thanksgiving = nthWeekdayOfMonth(year, 10, 4, 4)
  holidays.set(formatDate(year, 10, thanksgiving), 'Thanksgiving')

  // Christmas Day - December 25
  holidays.set(formatDate(year, 11, 25), 'Christmas Day')

  return holidays
}
