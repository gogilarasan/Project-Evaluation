import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import './CSS/Event.css';
import config from '../../../config';

const apiUrl = config.apiUrl;

const Event = () => {
  const [eventData, setEventData] = useState({
    title: '',
    start: '',
    end: '',
    createdBy: '',
    selectedRoles: [],
  });

  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState({
    date: '',
    startTime: '',
    endTime: '',
  });
  const [guideName, setGuideName] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'eventType') {
      if (value === 'Type') {
        // Clear the title when "Type" is selected
        setEventData({
          ...eventData,
          eventType: value,
          title: '',
        });
      } else {
        // Store the selected event type as the title
        setEventData({
          ...eventData,
          eventType: value,
          title: value,
        });
      }
    } else {
      setEventData({
        ...eventData,
        [name]: value,
      });
    }
  };

  const handleRoleChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setEventData({
        ...eventData,
        selectedRoles: [...eventData.selectedRoles, name],
      });
    } else {
      setEventData({
        ...eventData,
        selectedRoles: eventData.selectedRoles.filter((role) => role !== name),
      });
    }
  };

  const sendEmailToStudents = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          subject: `New Event: ${eventData.title}`,
          message: `
            Event Title: ${eventData.title}
            Start Date and Time: ${eventData.start}
            End Date and Time: ${eventData.end}
            Created By: ${eventData.createdBy}
          `,
          role: 'Student',
        }),
      });

      if (response.ok) {
        console.log('Emails sent successfully');
      } else {
        console.error('Error sending email:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleCreateEvent = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const eventDataResponse = await response.json();
        console.log('Event created:', eventDataResponse);


        await sendEmailToStudents();


      } else {
        console.error('Error creating event:', response.statusText);

      }
    } catch (error) {
      console.error('Error creating event:', error);

    }
  };

  const handleSlotBooking = async () => {
    if (
      selectedSlot.date &&
      selectedSlot.startTime &&
      selectedSlot.endTime &&
      guideName &&
      teamMembers.length > 0
    ) {
      const newBooking = {
        date: selectedSlot.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        guide: guideName,
        members: teamMembers,
      };

      try {
        const response = await fetch(`${apiUrl}/api/book-slot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newBooking),
        });

        if (response.ok) {
          console.log('Slot booked successfully');
          // You can add further actions here, such as updating the UI
        } else {
          console.error('Error booking slot:', response.statusText);
        }
      } catch (error) {
        console.error('Error booking slot:', error);
      }
      setBookedSlots([...bookedSlots, newBooking]);
      setSelectedSlot({
        date: '',
        startTime: '',
        endTime: '',
      });
      setGuideName('');
      setTeamMembers([]);
    } else {
      console.error('Invalid booking data.');
      // Handle validation error
    }
  };

  // Function to fetch booked slots
  const fetchBookedSlots = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/booked-slots`);
      if (response.ok) {
        const slots = await response.json();
        setBookedSlots(slots);
      } else {
        console.error('Error fetching booked slots:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching booked slots:', error);
    }
  };

  // Fetch booked slots when the component mounts
  useEffect(() => {
    fetchBookedSlots();
  }, []);

  // Add this function to your client-side code
  const handleDeleteSlot = async (slotId) => {
    try {
      const response = await fetch(`${apiUrl}/api/booked-slots/${slotId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Booked slot deleted successfully');
        // You can update the UI or take further actions here
        // For example, you can fetch the updated list of booked slots
        fetchBookedSlots();
      } else {
        console.error('Error deleting booked slot:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting booked slot:', error);
    }
  };

  return (
    <div className="event-container">
      <DashboardNavbar>
        <h2 className="event-title">Create Event</h2>
        <div className="event-form">
        <label className="event-label">
            Event Type:
            <select
              className="event-input"
              name="eventType"
              value={eventData.eventType}
              onChange={handleInputChange}
            >
              <option value="">Select Event Type</option>
              <option value="Submission Report">Submission Report</option>
              <option value="Submission Project">Submission Project</option>
              <option value="Submission Form">Submission Form</option>
              <option value="Type">Type</option>
            </select>
          </label>

          {/* Display the event type as the "Title" field */}
          <label className="event-label">
            Title:
            <input
              className="event-input"
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label className="event-label">
            Start Date and Time:
            <input
              className="event-input"
              type="datetime-local"
              name="start"
              value={eventData.start}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label className="event-label">
            End Date and Time:
            <input
              className="event-input"
              type="datetime-local"
              name="end"
              value={eventData.end}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label className="event-label">
            Created By:
            <input
              className="event-input"
              type="text"
              name="createdBy"
              value={eventData.createdBy}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <div className="event-roles">
            <label className="event-role-label">
              Guide:
              <input
                className="event-role-input"
                type="checkbox"
                name="guide"
                checked={eventData.selectedRoles.includes('guide')}
                onChange={handleRoleChange}
              />
            </label>
            <label className="event-role-label">
              Teacher:
              <input
                className="event-role-input"
                type="checkbox"
                name="teacher"
                checked={eventData.selectedRoles.includes('teacher')}
                onChange={handleRoleChange}
              />
            </label>
            <label className="event-role-label">
              Student:
              <input
                className="event-role-input"
                type="checkbox"
                name="student"
                checked={eventData.selectedRoles.includes('student')}
                onChange={handleRoleChange}
              />
            </label>
          </div>
          <br />
          <button className="event-button" onClick={handleCreateEvent}>
            Create Event
          </button>
        </div>

        <div className="slot-booking">
          <h2>Slot Booking</h2>
          <input
            type="date"
            value={selectedSlot.date}
            onChange={(e) =>
              setSelectedSlot({ ...selectedSlot, date: e.target.value })
            }
          />
          <input
            type="time"
            value={selectedSlot.startTime}
            onChange={(e) =>
              setSelectedSlot({ ...selectedSlot, startTime: e.target.value })
            }
          />
          <input
            type="time"
            value={selectedSlot.endTime}
            onChange={(e) =>
              setSelectedSlot({ ...selectedSlot, endTime: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Guide Name"
            value={guideName}
            onChange={(e) => setGuideName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Team Members (comma-separated)"
            value={teamMembers.join(', ')}
            onChange={(e) => setTeamMembers(e.target.value.split(', '))}
          />
          <button onClick={handleSlotBooking}>Book Slot</button>
        </div>

        <div className="booked-slots">
          <h2 className="booked-slots-title">Booked Slots</h2>
          <ul className="booked-slots-list">
            {bookedSlots.map((booking, index) => (
              <li key={index} className="booked-slot-item">
                <div className="slot-details">
                  <div className="slot-info">
                    <span>Date:</span> {booking.date}
                  </div>
                  <div className="slot-info">
                    <span>Time:</span> {booking.startTime} - {booking.endTime}
                  </div>
                  <div className="slot-info">
                    <span>Guide:</span> {booking.guide}
                  </div>
                  <div className="slot-info">
                    <span>Members:</span> {booking.members.join(', ')}
                  </div>
                </div>
                <button className="delete-button" onClick={() => handleDeleteSlot(booking.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>

      </DashboardNavbar>
    </div>
  );
};

export default Event;
