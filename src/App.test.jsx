import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import App from './App.jsx'

beforeEach(() => {
  localStorage.clear()
})

describe('Calendar App', () => {
  it('renders the calendar header with month/week toggle', () => {
    render(<App />)
    expect(screen.getByText('Month')).toBeInTheDocument()
    expect(screen.getByText('Week')).toBeInTheDocument()
    expect(screen.getByText('Today')).toBeInTheDocument()
  })

  it('renders weekday headers in month view', () => {
    render(<App />)
    expect(screen.getByText('Sun')).toBeInTheDocument()
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Tue')).toBeInTheDocument()
    expect(screen.getByText('Wed')).toBeInTheDocument()
    expect(screen.getByText('Thu')).toBeInTheDocument()
    expect(screen.getByText('Fri')).toBeInTheDocument()
    expect(screen.getByText('Sat')).toBeInTheDocument()
  })

  it('navigates to the next month', () => {
    render(<App />)
    const now = new Date()
    const nextBtn = screen.getByLabelText('Next')
    fireEvent.click(nextBtn)

    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    const expectedTitle = `${monthNames[nextMonth.getMonth()]} ${nextMonth.getFullYear()}`
    expect(screen.getByText(expectedTitle)).toBeInTheDocument()
  })

  it('navigates to the previous month', () => {
    render(<App />)
    const now = new Date()
    const prevBtn = screen.getByLabelText('Previous')
    fireEvent.click(prevBtn)

    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    const expectedTitle = `${monthNames[prevMonth.getMonth()]} ${prevMonth.getFullYear()}`
    expect(screen.getByText(expectedTitle)).toBeInTheDocument()
  })

  it('switches to week view', () => {
    render(<App />)
    fireEvent.click(screen.getByText('Week'))
    // Week view should show hour labels
    expect(screen.getByText('12 AM')).toBeInTheDocument()
    expect(screen.getByText('12 PM')).toBeInTheDocument()
  })

  it('switches back to month view', () => {
    render(<App />)
    fireEvent.click(screen.getByText('Week'))
    fireEvent.click(screen.getByText('Month'))
    // Should see weekday headers again at top
    expect(screen.getByText('Sun')).toBeInTheDocument()
  })

  it('opens the create event modal when clicking a day cell', () => {
    render(<App />)
    // Click on a day cell (find a day number in the grid)
    const dayCells = document.querySelectorAll('.month-day-cell')
    fireEvent.click(dayCells[10])
    expect(screen.getByText('New Event')).toBeInTheDocument()
    expect(screen.getByLabelText('Title')).toBeInTheDocument()
  })

  it('creates a new event', () => {
    render(<App />)
    // Open modal
    const dayCells = document.querySelectorAll('.month-day-cell')
    fireEvent.click(dayCells[10])

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Meeting' } })
    fireEvent.click(screen.getByText('Create Event'))

    // Event should appear as a chip
    expect(screen.getByText('Test Meeting')).toBeInTheDocument()
  })

  it('shows validation error for empty title', () => {
    render(<App />)
    const dayCells = document.querySelectorAll('.month-day-cell')
    fireEvent.click(dayCells[10])

    fireEvent.click(screen.getByText('Create Event'))
    expect(screen.getByText('Title is required')).toBeInTheDocument()
  })

  it('closes modal on cancel', () => {
    render(<App />)
    const dayCells = document.querySelectorAll('.month-day-cell')
    fireEvent.click(dayCells[10])

    expect(screen.getByText('New Event')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.queryByText('New Event')).not.toBeInTheDocument()
  })

  it('shows event detail when clicking an event chip', () => {
    render(<App />)
    // Create an event first
    const dayCells = document.querySelectorAll('.month-day-cell')
    fireEvent.click(dayCells[10])
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Detail Test' } })
    fireEvent.click(screen.getByText('Create Event'))

    // Click the event chip
    fireEvent.click(screen.getByText('Detail Test'))

    // Should see detail view with edit/delete buttons
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('persists events in localStorage', () => {
    const { unmount } = render(<App />)
    // Create an event
    const dayCells = document.querySelectorAll('.month-day-cell')
    fireEvent.click(dayCells[10])
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Persist Me' } })
    fireEvent.click(screen.getByText('Create Event'))

    expect(screen.getByText('Persist Me')).toBeInTheDocument()

    // Check localStorage
    const stored = JSON.parse(localStorage.getItem('calendar_events'))
    expect(stored).toHaveLength(1)
    expect(stored[0].title).toBe('Persist Me')

    unmount()

    // Re-render, event should still be there
    render(<App />)
    expect(screen.getByText('Persist Me')).toBeInTheDocument()
  })
})
