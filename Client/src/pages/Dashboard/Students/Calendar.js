import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'antd/dist/antd'; // Import Ant Design styles
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
  const [displayType, setDisplayType] = useState('both'); // Default to display both events and slots

  useEffect(() => {
    fetchCurrentUser();
    fetchEvents();
    fetchBookedSlots();
    fetchGuideEvents(); // New function to fetch guide events
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
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        const slotsWithDateObjects = data.map(slot => ({
          ...slot,
          title: 'Project Review', // Set the default title to 'Project Review'
          start: moment(slot.date + ' ' + slot.startTime, 'YYYY-MM-DD HH:mm:ss').toDate(),
          end: moment(slot.date + ' ' + slot.endTime, 'YYYY-MM-DD HH:mm:ss').toDate(),
          type: 'slot',
          guide: slot.guide, // Add guide name
          members: slot.members.join(', '), // Join team members as a string
        }));
        setEvents(prevEvents => [...prevEvents, ...slotsWithDateObjects]);
      })
      .catch(error => console.error('Error fetching booked slots:', error));
  };

  // New function to fetch guide events
  const fetchGuideEvents = async () => {
    const studentRollNo = getCookie('loggedIn');

    try {
      console.log('Fetching student roll number:', studentRollNo);

      try {
        const guideResponse = await fetch(`${apiUrl}/api/formproject/studguide?rollNumber=${studentRollNo}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (guideResponse.ok) {
          const guideData = await guideResponse.json();
          const guideRollNumber = guideData.guideRollNumber;

          if (guideRollNumber) {
            console.log('Fetched guide roll number:', guideRollNumber);

            try {
              const guideEventsResponse = await fetch(`${apiUrl}/api/guide-events?guideRollNo=${guideRollNumber}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
              });

              if (guideEventsResponse.ok) {
                console.log('Fetched guide events successfully');
                const guideEventsData = await guideEventsResponse.json();

                // Convert guide events to calendar events
                const guideEventsWithDateObjects = guideEventsData.map(event => ({
                  ...event,
                  start: new Date(event.start),
                  end: new Date(event.end),
                  type: 'guideEvent', // Custom type for guide events
                }));

                setEvents(prevEvents => [...prevEvents, ...guideEventsWithDateObjects]);
              } else {
                console.error('Error fetching guide events:', guideEventsResponse.statusText);
              }
            } catch (error) {
              console.error('Error fetching guide events:', error);
            }
          } else {
            console.error('Guide roll number is missing in the response:', guideData);
          }
        } else {
          console.error('Error fetching guide roll number:', guideResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching guide roll number:', error);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
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
    if (currentUser && (currentUser.role === 'Student' || currentUser.role === 'Student')) {
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };
  
  const eventSlotStyle = (event) => {
    if (event.type === 'event') {
      return {
        backgroundColor: '#3174ad',
        color: 'white', // Text color for events
      };
    } else if (event.type === 'slot') {
      return {
        backgroundColor: '#f0ad4e',
        color: 'black', // Text color for slots
      };
    }
    return {};
  };

  const handleDisplayTypeChange = (value) => {
    setDisplayType(value);
  };

  // Filter events based on displayType
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
            views={['month', 'week', 'day', 'agenda']} // Include 'agenda' view
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
              (currentUser.role === 'Admin' || currentUser.role === 'Student')
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
