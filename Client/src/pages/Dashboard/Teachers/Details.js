import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import {
  FileOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd'; 
import './CSS/Details.css';
import DashboardNavbar from './DashboardNavbar';
import config from '../../../config';

const apiUrl = config.apiUrl;
const { TabPane } = Tabs;

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedType, setSelectedType] = useState('formSubmission');
  const [verifiedLinks, setVerifiedLinks] = useState([]);
  const [formSubmissions, setFormSubmissions] = useState([]);
  const [selectedLinkType, setSelectedLinkType] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      if (selectedType === 'formSubmission') {
        fetchFormSubmissions(selectedStudent.rollNo);
      } else if (selectedType === 'linkType') {
        fetchVerifiedLinks(selectedStudent.rollNo, selectedLinkType);
      }
    } else {
      setFormSubmissions([]);
      setVerifiedLinks([]);
    }
  }, [selectedStudent, selectedType, selectedLinkType]);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/accounts?role=Student`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        console.error('Failed to fetch students:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchFormSubmissions = async (rollNumber) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/formproject/student?rollNumber=${rollNumber}&verified=true`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setFormSubmissions(data);
      } else {
        console.error('Failed to fetch form submissions:', data.error || response.statusText);
        setFormSubmissions([]);
      }
    } catch (error) {
      console.error('Error fetching form submissions:', error);
      setFormSubmissions([]);
    }
  };

  const fetchVerifiedLinks = async (rollNumber, linkType) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/verifiedlinksubmissions?rollNo=${rollNumber}&linkType=${linkType}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setVerifiedLinks(data);
      } else {
        console.error('Failed to fetch verified links:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching verified links:', error);
    }
  };

  const handleStudentSelection = (selectedRollNo) => {
    const selectedStudent = students.find((student) => student.rollNo === selectedRollNo);
    setSelectedStudent(selectedStudent || null);
    setSelectedLinkType(''); // Reset selectedLinkType when a new student is selected
  };

  return (
    <div className="custom-dashboard-container">
      <DashboardNavbar>
        <div className="custom-dashboard-content">
          <h2 className="custom-dashboard-title">Details</h2>
          <div className="custom-student-selector">
            <label htmlFor="studentSelect" className="custom-label-text">
              Select a student:
            </label>
            <select
              id="studentSelect"
              value={selectedStudent ? selectedStudent.rollNo : ''}
              onChange={(e) => handleStudentSelection(e.target.value)} // Updated this line
              className="custom-select-box"
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student.rollNo} value={student.rollNo}>
                  {student.firstName} {student.lastName} ({student.rollNo})
                </option>
              ))}
            </select>
          </div>

          <div className="divd">
            <Tabs defaultActiveKey="formSubmission" onChange={(key) => setSelectedType(key)}>
              <TabPane tab="Form Submissions" key="formSubmission">
                <h3>Form Submissions for {selectedStudent ? selectedStudent.firstName : ''}</h3>
                {formSubmissions.map((submission) => (
                  <div className="custom-card" key={submission.projectTitle}>
                    <h4>
                      <ExclamationCircleOutlined /> Title: {submission.projectTitle}
                    </h4>
                    <p>
                      <strong>Team Members:</strong>{' '}
                      {`${submission.teamMember1} (${submission.teamMember1RollNumber}), ${submission.teamMember2} (${submission.teamMember2RollNumber}), ${submission.teamMember3} (${submission.teamMember3RollNumber})`}
                    </p>
                    <p>
                      <strong>Project Description:</strong> {submission.description}
                    </p>
                    <p>
                      <strong>Guide Name:</strong> {submission.guideName}
                    </p>
                    <p>
                      <strong>Guide Roll Number:</strong> {submission.guideRollNumber}
                    </p>
                    <p>
                      <strong>Guide Department:</strong> {submission.guideDepartment}
                    </p>
                    <p>
                      <strong>Guide Contact:</strong> {submission.guideMobile}
                    </p>
                    <p>
                      <strong>Guide Mail:</strong> {submission.guideEmail}
                    </p>
                  </div>
                ))}
                {formSubmissions.length === 0 && (
                  <p>No form submissions found for {selectedStudent ? selectedStudent.firstName : ''}</p>
                )}
              </TabPane>
              <TabPane tab="Link Types" key="linkType">
                <div className="link-type-selector">
                  <label>Select a link type:</label>
                  <select
                    value={selectedLinkType}
                    onChange={(e) => setSelectedLinkType(e.target.value)}
                    className="custom-select-box"
                  >
                    <option value="">Select Link Type</option>
                    <option value="report">Report Link</option>
                    <option value="drive">Drive Link</option>
                  </select>
                </div>
                <h3>Verified Links for {selectedStudent ? selectedStudent.firstName : ''}</h3>
                {verifiedLinks.map((link, index) => (
                  <div className="custom-card" key={index}>
                    <h4>
                      {link.linkType === 'report' ? <FileOutlined /> : <LinkOutlined />}
                      {link.linkType}: {link.link}
                    </h4>
                    <a href={link.link} target="_blank" rel="noopener noreferrer">
                      View Link
                    </a>
                  </div>
                ))}
                {verifiedLinks.length === 0 && (
                  <p>No verified links found for {selectedStudent ? selectedStudent.firstName : ''}</p>
                )}
              </TabPane>
            </Tabs>
          </div>
        </div>
      </DashboardNavbar>
    </div>
  );
};

export default Dashboard;
