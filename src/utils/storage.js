const STORAGE_KEY = 'calendar_events'

export function loadEvents() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}
