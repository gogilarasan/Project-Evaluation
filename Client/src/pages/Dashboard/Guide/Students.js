import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import './CSS/Student.css';
import { getCookie } from './cookie';
import config from '../../../config';

const apiURL = config.apiUrl;

const Students = () => {
  // eslint-disable-next-line
  const [currentUser, setCurrentUser] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchCurrentUser();
  }, );

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
        fetchStudents(data.rollNo);
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
        setStudents(data);
      } else if (response.status === 401) {
        console.log('Unauthorized. Please log in again.');
      } else {
        console.error('Failed to fetch students:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };


  const handleVerify = async (studentId) => {
    try {

      const apiUrl = `${apiURL}/api/verify/student/${studentId}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Student verified:', studentId);
        // Update the students list to mark the student as verified
        const updatedStudents = students.map((student) =>
          student.id === studentId ? { ...student, verified: true } : student
        );
        setStudents(updatedStudents);
      } else {
        console.error('Failed to verify student:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error verifying student:', error);
    }
  };

  return (
    <div className="dsg">
      <DashboardNavbar>
      <div className="dcsg">
        <h2>Students</h2>
        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.rollNumber}</td>
                <td>{student.studentName}</td>
                <td>
                {student.verified ? (
                    <span className="verifiedg">Verified &#10003;</span>
                  ) : (
                    <button onClick={() => handleVerify(student.id)}>Verify</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </DashboardNavbar>
    </div>
  );
};

export default Students;
