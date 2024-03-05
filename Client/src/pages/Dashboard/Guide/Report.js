import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import './CSS/Document.css';
import { getCookie } from './cookie';
import config from '../../../config';
import {
  Select,
  Spin,
  Typography,
  Button,
  notification,
} from 'antd';
import {
  LinkOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Option } = Select;
const { Text, Title } = Typography;

const apiURL = config.apiUrl;

const Documents = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedLinkType, setSelectedLinkType] = useState('');
  const [submissionInfo, setSubmissionInfo] = useState(null);
  const [verifiedLink, setVerifiedLink] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleStudentSelect = (value) => {
    setSelectedStudent(value);
    setSelectedLinkType('');
    setSubmissionInfo(null);
    setVerifiedLink('');
  };

  const handleLinkTypeSelect = (value) => {
    setSelectedLinkType(value);
    setSubmissionInfo(null);
    setVerifiedLink('');
    fetchSubmissionInfo(selectedStudent, value);
  };

  const fetchSubmissionInfo = async (studentRollNo, linkType) => {
    try {
      const apiUrl = `${apiURL}/api/submitlink?rollNo=${studentRollNo}&linkType=${linkType}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissionInfo(data);
      } else if (response.status === 401) {
        console.log('Unauthorized. Please log in again.');
      } else {
        console.error('Failed to fetch submission info:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching submission info:', error);
    }
  };

  const handleVerifyLink = async (link) => {
    try {
      const response = await fetch(`${apiURL}/api/verifylink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          link: link,
        }),
      });

      if (response.ok) {
        setVerifiedLink(link);
        notification.success({
          message: 'Link Verified',
          description: 'Link verified successfully!',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        });
      } else {
        console.error('Link verification failed:', response.status, response.statusText);
        notification.error({
          message: 'Link Verification Failed',
          description: 'Failed to verify the link. Please try again.',
          icon: <LinkOutlined style={{ color: '#f5222d' }} />,
        });
      }
    } catch (error) {
      console.error('Error verifying link:', error);
      notification.error({
        message: 'Error Verifying Link',
        description: 'An error occurred while verifying the link. Please try again later.',
        icon: <LinkOutlined style={{ color: '#f5222d' }} />,
      });
    }
  };

  return (
    <div className="dr">
      <DashboardNavbar>
        <div className="drc">
          <Title level={2}>Student Submissions</Title>
          {loading ? (
            <Spin size="large" />
          ) : (
            <div>
              <div className="student-selectg">
                <Text strong>Select a student:</Text>
                <Select
                  placeholder="Select Student"
                  style={{ width: 200 }}
                  value={selectedStudent}
                  onChange={handleStudentSelect}
                >
                  <Option value="">All Students</Option>
                  {students.map((student, index) => (
                    <Option key={index} value={student.rollNumber}>
                      {student.studentName} ({student.rollNumber})
                    </Option>
                  ))}
                </Select>
              </div>
              {selectedStudent && (
                <div className="link-type-selectg">
                  <Text strong>Select a link type:</Text>
                  <Select
                    placeholder="Select Link Type"
                    style={{ width: 200 }}
                    value={selectedLinkType}
                    onChange={handleLinkTypeSelect}
                  >
                    <Option value="report">Report Link</Option>
                    <Option value="drive">Drive Link</Option>
                  </Select>
                </div>
              )}
              {submissionInfo ? (
                <div className="submission-infog">
                  <Text strong>Student Name:</Text>
                  <p>{submissionInfo.studentName}</p>
                  <Text strong>Link Type:</Text>
                  <p>{submissionInfo.linkType}</p>
                  <Text strong>Link:</Text>
                  <p>{submissionInfo.link}</p>
                  <Button
                    type="primary"
                    icon={<LinkOutlined />}
                    onClick={() => window.open(submissionInfo.link, '_blank')}
                  >
                    View Link
                  </Button>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleVerifyLink(submissionInfo.link)}
                    disabled={verifiedLink === submissionInfo.link}
                  >
                    Verify Link
                  </Button>
                  {verifiedLink === submissionInfo.link && (
                    <Text className="verified-link-msgg" type="success">
                      Link verified successfully!
                    </Text>
                  )}
                </div>
              ) : (
                <Text>Student has not submitted.</Text>
              )}
            </div>
          )}
        </div>
      </DashboardNavbar>
    </div>
  );
};

export default Documents;
