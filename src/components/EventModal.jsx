import { useState, useEffect } from 'react'
import { formatDisplayDate } from '../utils/dateHelpers.js'
import './EventModal.css'

function EventModal({ event, date, startTime, onSave, onClose }) {
  const isEditing = !!event

  const [title, setTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventStartTime, setEventStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [category, setCategory] = useState('work')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEditing) {
      setTitle(event.title)
      setEventDate(event.date)
      setEventStartTime(event.startTime)
      setEndTime(event.endTime)
      setCategory(event.category)
      setDescription(event.description || '')
    } else {
      setEventDate(date || '')
      if (startTime) {
        setEventStartTime(startTime)
        const [h] = startTime.split(':').map(Number)
        setEndTime(`${String(Math.min(h + 1, 23)).padStart(2, '0')}:00`)
      }
    }
  }, [event, date, startTime, isEditing])

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    if (!eventDate) {
      setError('Date is required')
      return
    }
    if (eventStartTime >= endTime) {
      setError('End time must be after start time')
      return
    }

    const eventData = {
      title: title.trim(),
      date: eventDate,
      startTime: eventStartTime,
      endTime,
      category,
      description: description.trim()
    }

    if (isEditing) {
      eventData.id = event.id
    }

    onSave(eventData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="event-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditing ? 'Edit Event' : 'New Event'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="modal-error">{error}</div>}
          <div className="form-group">
            <label htmlFor="event-title">Title</label>
            <input
              id="event-title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Event title"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="event-date">Date</label>
            <input
              id="event-date"
              type="date"
              value={eventDate}
              onChange={e => setEventDate(e.target.value)}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="event-start">Start</label>
              <input
                id="event-start"
                type="time"
                value={eventStartTime}
                onChange={e => setEventStartTime(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="event-end">End</label>
              <input
                id="event-end"
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="event-category">Category</label>
            <select
              id="event-category"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="work">Work</option>
              <option value="social">Social</option>
              <option value="personal">Personal</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="event-description">Description</label>
            <textarea
              id="event-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">
              {isEditing ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventModal
