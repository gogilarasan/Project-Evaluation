import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import { Select, List, Button, Menu, Dropdown } from 'antd';
import {
  FileOutlined,
  FileTextOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd';
import config from '../../../config';

const apiUrl = config.apiUrl;
const { Option } = Select;

const Documents = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedLinkType, setSelectedLinkType] = useState('');
  const [verifiedLinks, setVerifiedLinks] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent && selectedLinkType) {
      fetchVerifiedLinks(selectedStudent, selectedLinkType);
    } else {
      setVerifiedLinks([]);
    }
  }, [selectedStudent, selectedLinkType]);

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

  const linkTypeMenu = (
    <Menu onClick={({ key }) => setSelectedLinkType(key)}>
      <Menu.Item key="report" icon={<FileTextOutlined />}>
        Report Link
      </Menu.Item>
      <Menu.Item key="drive" icon={<LinkOutlined />}>
        Drive Link
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="document-container">
      <DashboardNavbar>
        <div className="document-content">
          <h2 className="document-title">Student Submissions</h2>
          <div className="student-selector">
            <label htmlFor="studentSelect">Select a student:</label>
            <Select
              id="studentSelect"
              value={selectedStudent}
              onChange={(value) => setSelectedStudent(value)}
              style={{ width: 200 }}
            >
              <Option value="">Select Student</Option>
              {students.map((student) => (
                <Option key={student.rollNo} value={student.rollNo}>
                  {student.firstName} {student.lastName} ({student.rollNo})
                </Option>
              ))}
            </Select>
          </div>
          {selectedStudent && (
            <div>
              <div className="link-type-selector">
                <label>Select a link type:</label>
                <Dropdown overlay={linkTypeMenu}>
                  <Button>
                    {selectedLinkType ? (
                      <span>
                        {selectedLinkType === 'report' ? (
                          <FileTextOutlined />
                        ) : (
                          <LinkOutlined />
                        )}
                        {selectedLinkType}
                      </span>
                    ) : (
                      'Select Link Type'
                    )}
                  </Button>
                </Dropdown>
              </div>
              <h3 className="verified-links-title">
                Verified Links for {selectedStudent}
              </h3>
              {verifiedLinks.length > 0 ? (
                <List
                  dataSource={verifiedLinks}
                  renderItem={(link, index) => (
                    <List.Item className="link-item">
                      <span>
                        {link.linkType === 'report' ? (
                          <FileOutlined />
                        ) : (
                          <LinkOutlined />
                        )}
                        {link.linkType}: {link.link}
                      </span>
                      <Button className="view-link-button">
                        <a
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Link
                        </a>
                      </Button>
                    </List.Item>
                  )}
                />
              ) : (
                <p className="no-links-message">
                  No verified links found for {selectedStudent}
                </p>
              )}
            </div>
          )}
        </div>
      </DashboardNavbar>
    </div>
  );
};

export default Documents;
