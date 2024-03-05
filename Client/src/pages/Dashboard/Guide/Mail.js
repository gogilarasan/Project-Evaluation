import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import './CSS/Mail.css';
import { getCookie } from './cookie';
import config from '../../../config';

const apiURL = config.apiUrl;

const Mail = () => {
   // eslint-disable-next-line
  const [currentUser, setCurrentUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');

  const fetchCurrentUser = async () => {
    try {
      
      
      const rollNo = getCookie('loggedIn');
      

      const response = await fetch(`${apiURL}/api/currentuser?rollNo=${rollNo}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
        fetchStudents(data.rollNo); // Fetch students based on the current user's roll number
      } else if (response.status === 401) {
        console.log('Unauthorized. Please log in again.');
      } else {
        console.error('Failed to fetch current user:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchStudents = async (guideRollNo) => {
    try {
      const apiUrl = `${apiURL}/api/formproject/guide?guideRollNumber=${guideRollNo}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      if (response.ok) {
        const data = await response.json();
        const studentsWithEmails = await Promise.all(
          data.map(async (student) => {
            const emailResponse = await fetch(`${apiURL}/api/accounts/email?rollNumber=${student.rollNumber}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            });
  
            if (emailResponse.ok) {
              const emailData = await emailResponse.json();
              return { ...student, email: emailData.email };
            } else {
              return student;
            }
          })
        );
        setStudents(studentsWithEmails);
      } else if (response.status === 401) {
        console.log('Unauthorized. Please log in again.');
      } else {
        console.error('Failed to fetch students:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };
  

  useEffect(() => {
    fetchCurrentUser();
  },);


  const handleStudentSelection = (student) => {
    setSelectedStudent(student);
  };

  const handleMailToStudent = () => {
    if (selectedStudent) {
      const mailtoLink = `mailto:${selectedStudent.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailContent)}`;
      window.location.href = mailtoLink;
    }
  };

  return (
    <div className="dcs">
      <DashboardNavbar>
      <div className="dccs">
        <h2>Contact Students</h2>
        <div className="contact-infos">
          {students.map(student => (
            <div
              key={student.id}
              className={`contact-item ${selectedStudent === student ? 'selected' : ''}`}
              onClick={() => handleStudentSelection(student)}
            >
              <i className="fas fa-user-circle"></i>
              <p>{student.studentName}</p>
            </div>
          ))}
        </div>
        {selectedStudent && (
          <div className="selected-contacts">
            <h3>Selected Student: {selectedStudent.studentName}</h3>
            <p>Email: {selectedStudent.email}</p>
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
              <button onClick={handleMailToStudent}>Email Student</button>
            </div>
          </div>
        )}
        {selectedStudent && (
          <div className="email-previews">
            <h3>Email Preview</h3>
            <p><strong>To:</strong> {selectedStudent.email}</p>
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

export default Mail;
