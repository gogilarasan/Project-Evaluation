import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import './CSS/Contact.css';
import config from '../../../config';

const apiUrl = config.apiUrl;

const Contact = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/accounts?role=Panel`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setTeachers(data);
      } else {
        console.error('Failed to fetch teachers:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleTeacherSelection = (teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleMailToTeacher = () => {
    if (selectedTeacher) {
      const mailtoLink = `mailto:${selectedTeacher.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailContent)}`;
      window.location.href = mailtoLink;
    }
  };

  return (
    <div className="dcs">
      <DashboardNavbar>
      <div className="dccs">
        <h2>Contact Information</h2>
        <div className="contact-infos">
          {teachers.map(teacher => (
            <div
              key={teacher.id}
              className={`contact-item ${selectedTeacher === teacher ? 'selected' : ''}`}
              onClick={() => handleTeacherSelection(teacher)}
            >
              <i className="fas fa-user-circle"></i>
              <p>{teacher.firstName} {teacher.lastName}</p>
            </div>
          ))}
        </div>
        {selectedTeacher && (
          <div className="selected-contacts">
            <h3>Selected Teacher: {selectedTeacher.firstName} {selectedTeacher.lastName}</h3>
            <p>Email: {selectedTeacher.email}</p>
            <div className="email-forms">
              <label htmlFor="emailSubject">Subject:</label>
              <input
                type="text"
                id="emailSubject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
              <label htmlFor="emailContent">Content:</label>
              <textarea
                id="emailContent"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
              />
              <button onClick={handleMailToTeacher}>Email Teacher</button>
            </div>
          </div>
        )}
        {selectedTeacher && (
          <div className="email-previews">
            <h3>Email Preview</h3>
            <p><strong>To:</strong> {selectedTeacher.email}</p>
            <p><strong>Subject:</strong> {emailSubject}</p>
            <p><strong>Content:</strong></p>
            <p>{emailContent}</p>
          </div>
        )}
      </div>
      </DashboardNavbar>
    </div>
  );
};

export default Contact;
