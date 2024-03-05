import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'antd/dist/antd'; 
import moment from 'moment';
import { getCookie } from './cookie';
import config from '../../../config';
import { Button, Modal, Select } from 'antd';

const { Option } = Select;

const apiUrl = config.apiUrl;

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayType, setDisplayType] = useState('both');

  useEffect(() => {
    fetchCurrentUser();
    fetchEvents();
    fetchBookedSlots();
    fetchGuideEvents();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const rollNo = getCookie('loggedIn');

      const response = await fetch(`${apiUrl}/api/currentuser?rollNo=${rollNo}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
      } else {
        console.log('Failed to fetch user data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchEvents = () => {
    fetch(`${apiUrl}/api/events`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        const eventsWithDateObjects = data.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          type: 'event',
        }));
        setEvents(eventsWithDateObjects);
      })
      .catch(error => console.error('Error fetching events:', error));
  };

  const fetchBookedSlots = () => {
    fetch(`${apiUrl}/api/booked-slots`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application.json',
      },
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        const slotsWithDateObjects = data.map(slot => ({
          ...slot,
          title: 'Project Review',
          start: moment(slot.date + ' ' + slot.startTime, 'YYYY-MM-DD HH:mm:ss').toDate(),
          end: moment(slot.date + ' ' + slot.endTime, 'YYYY-MM-DD HH:mm:ss').toDate(),
          type: 'slot',
          guide: slot.guide,
          members: slot.members.join(', '),
        }));
        setEvents(prevEvents => [...prevEvents, ...slotsWithDateObjects]);
      })
      .catch(error => console.error('Error fetching booked slots:', error));
  };

  const fetchGuideEvents = async () => {
    const guideRollNo = getCookie('loggedIn');

    try {
      const guideEventsResponse = await fetch(`${apiUrl}/api/guide-events?guideRollNo=${guideRollNo}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (guideEventsResponse.ok) {
        const guideEventsData = await guideEventsResponse.json();

        // Convert guide events to calendar events
        const guideEventsWithDateObjects = guideEventsData.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          type: 'guideEvent',
        }));

        setEvents(prevEvents => [...prevEvents, ...guideEventsWithDateObjects]);
      } else {
        console.error('Error fetching guide events:', guideEventsResponse.statusText);
      }
    } catch (error) {
      console.error('Error fetching guide events:', error);
    }
  };

  const customEventComponent = ({ event }) => (
    <div className="custom-event">
      <strong>{event.title}</strong>
      <br />
      {moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')}
    </div>
  );

  const customSlotComponent = ({ event }) => (
    <div className="custom-slot">
      <strong>{event.title}</strong>
      <br />
      <div className="slot-details">
        <p>Guide: {event.guide}</p>
        <p>Team Members: {event.members}</p>
      </div>
      {moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')}
    </div>
  );

  const handleEventClick = (event) => {
    if (currentUser && (currentUser.role === 'Guide' || currentUser.role === 'Panel')) {
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };

  const handleDeleteEvent = (eventId) => {
    fetch(`${apiUrl}/api/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => {
        if (response.ok) {
          setEvents(events.filter(e => e.id !== eventId));
          setSelectedEvent(null);
          setIsModalOpen(false);
        } else {
          console.error('Error deleting event:', response.status, response.statusText);
        }
      })
      .catch(error => {
        console.error('Error deleting event:', error);
      });
  };

  const handleDeleteSlot = (slotId) => {
    fetch(`${apiUrl}/api/booked-slots/${slotId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => {
        if (response.ok) {
          setEvents(events.filter(e => e.id !== slotId));
          setSelectedEvent(null);
          setIsModalOpen(false);
        } else {
          console.error('Error deleting slot:', response.status, response.statusText);
        }
      })
      .catch(error => {
        console.error('Error deleting slot:', error);
      });
  };

  const handleDeleteGuideEvent = (eventId) => {
    fetch(`${apiUrl}/api/guide-events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => {
        if (response.ok) {
          setEvents(events.filter(e => e.id !== eventId));
          setSelectedEvent(null);
          setIsModalOpen(false);
        } else {
          console.error('Error deleting guide event:', response.status, response.statusText);
        }
      })
      .catch(error => {
        console.error('Error deleting guide event:', error);
      });
  };

  const eventSlotStyle = (event) => {
    if (event.type === 'event') {
      return {
        backgroundColor: '#3174ad',
        color: 'white',
      };
    } else if (event.type === 'slot') {
      return {
        backgroundColor: '#f0ad4e',
        color: 'black',
      };
    }
    return {};
  };

  const handleDisplayTypeChange = (value) => {
    setDisplayType(value);
  };

  const filteredEvents = displayType === 'both' ? events : events.filter(event => event.type === displayType);

  return (
    <div className="calendar-page">
      <DashboardNavbar>
        <div className="calendar-header">
          <h2 className="calendar-title">Calendar</h2>
          <Select
            value={displayType}
            style={{ width: 120 }}
            onChange={handleDisplayTypeChange}
          >
            <Option value="both">Both</Option>
            <Option value="event">Events</Option>
            <Option value="slot">Slots</Option>
          </Select>
        </div>
        <div className="full-calendar-container">
          <BigCalendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            views={['month', 'week', 'day', 'agenda']}
            style={{ height: 500, width: '95%' }}
            selectable
            resizable
            components={{
              event: customEventComponent,
              slot: customSlotComponent,
            }}
            formats={{
              eventTimeRangeFormat: ({ start, end }, culture, local) =>
                `${local.format(start, 'YYYY-MM-DD h:mm A', culture)} - ${local.format(end, 'YYYY-MM-DD h:mm A', culture)}`,
            }}
            onSelectEvent={handleEventClick}
            eventPropGetter={eventSlotStyle}
          />
        </div>
        {selectedEvent && (
          <Modal
            visible={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={[
              <Button key="close" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>,
              currentUser &&
              (currentUser.role === 'Guide' || currentUser.role === 'Panel') && (
                <Button
                  key="delete"
                  type="danger"
                  onClick={() => {
                    if (selectedEvent.type === 'event') {
                      handleDeleteEvent(selectedEvent.id);
                    } else if (selectedEvent.type === 'slot') {
                      handleDeleteSlot(selectedEvent.id);
                    } else if (selectedEvent.type === 'guideEvent') {
                      handleDeleteGuideEvent(selectedEvent.id);
                    }
                  }}
                >
                  Delete
                </Button>
              ),
            ]}
          >
            <p>{selectedEvent.title}</p>
            <p>Start: {moment(selectedEvent.start).format('YYYY-MM-DD h:mm A')}</p>
            <p>End: {moment(selectedEvent.end).format('YYYY-MM-DD h:mm A')}</p>
            {selectedEvent.type === 'slot' && (
              <div>
                <p>Guide: {selectedEvent.guide}</p>
                <p>Team Members: {selectedEvent.members}</p>
              </div>
            )}
          </Modal>
        )}
      </DashboardNavbar>
    </div>
  );
};

export default Calendar;
