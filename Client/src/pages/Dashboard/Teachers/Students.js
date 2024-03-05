import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Input, Select, Typography } from 'antd';
import {
  MailOutlined,
  EyeOutlined,
  SearchOutlined,
  UserOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';
import DashboardNavbar from './DashboardNavbar';
import './CSS/Student.css';
import Progress from './Progress';
import config from '../../../config';

const { Option } = Select;
const { Title } = Typography;
const apiUrl = config.apiUrl;

const Students = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // Default to ascending
  const [selectedView, setSelectedView] = useState('students');
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedView === 'teams') {
      fetchTeams();
    } else {
      fetchStudents();
    }
  }, [selectedView]);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/accounts?role=Student`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const studentsWithFullName = data.map((student) => ({
          ...student,
          firstNameLastName: `${student.firstName} ${student.lastName}`,
          guideName: 'Not Enrolled', // Initialize an empty guide name field
        }));
        setStudents(studentsWithFullName);

        // Fetch guide names for each student
        fetchGuideNames(studentsWithFullName);
      } else {
        console.error('Failed to fetch students:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchGuideNames = async (studentsData) => {
    // Make API calls to fetch guide names for each student and update the state
    const updatedStudents = await Promise.all(
      studentsData.map(async (student) => {
        try {
          const response = await fetch(`${apiUrl}/api/formproject/student-guide?rollNumber=${student.rollNo}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (response.ok) {
            const guideData = await response.json();
            const guideName = guideData.guideName; // Assuming the API response structure
            return {
              ...student,
              guideName,
            };
          } else {
            return student;
          }
        } catch (error) {
           console.error('Error fetching guide name for student:', student.rollNo, error);
          return student;
        }
      })
    );

    setStudents(updatedStudents);
  };

  const handleMailTo = (email) => {
    const mailtoLink = `mailto:${email}`;
    window.location.href = mailtoLink;
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setIsViewModalVisible(true);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/student/team`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      if (response.ok) {
        const data = await response.json();
        setTeamData(data); 

        console.log('Team Data:', data);
      } else {
        console.error('Failed to fetch teams:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };
  

  const filteredStudents = students.filter((student) => {
    return (
      student.rollNo.includes(searchText) ||
      student.firstNameLastName.toLowerCase().includes(searchText.toLowerCase()) ||
      student.email.toLowerCase().includes(searchText.toLowerCase()) ||
      student.guideName.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const sortedStudents = sortOrder === 'asc' ? [...filteredStudents].sort((a, b) => a.rollNo.localeCompare(b.rollNo)) : [...filteredStudents].sort((a, b) => b.rollNo.localeCompare(a.rollNo));

  const columns = [
    {
      title: 'Roll No',
      dataIndex: 'rollNo',
      key: 'rollNo',
      sorter: true,
      sortOrder,
    },
    {
      title: 'Name',
      dataIndex: 'firstNameLastName',
      key: 'firstNameLastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Guide Name',
      dataIndex: 'guideName', // Use the guideName field from the state
      key: 'guideName',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<MailOutlined />} // Use Ant Design Mail icon
            onClick={() => handleMailTo(record.email)}
          >
            Mail
          </Button>
          <Button
            type="default"
            icon={<EyeOutlined />} // Use Ant Design Eye icon
            onClick={() => handleViewStudent(record)}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  const teamColumns = [
    {
      title: 'Guide Name',
      dataIndex: 'guideName',
      key: 'guideName',
    },
    {
      title: 'Project Title',
      dataIndex: 'projectTitle',
      key: 'projectTitle',
    },
    {
      title: 'Members',
      key: 'teamMembers',
      render: (text, record) => (
        <ul>
          {record.teamMembersNames.map((member, index) => (
            <li key={index}>
              {`${member} (Roll Number: ${record.teamMembersRollNumbers[index]})`}
            </li>
          ))}
        </ul>
      ),
    },
  ];
  
  return (
    <div className="dts">
      <DashboardNavbar>
        <div className="dtcs">
          <div className="page-header">
            <Title level={2}>
              <UserOutlined style={{ fontSize: '1.0 em', marginRight: '0.5em' }} /> Students Record
            </Title>
          </div>
          <div className="student-controls">
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Select
              defaultValue="students"
              style={{ width: 120 }}
              onChange={handleViewChange}
            >
              <Option value="students">Students</Option>
              <Option value="teams">Teams</Option>
            </Select>
            <Button
              type="link"
              icon={<SortAscendingOutlined />}
              onClick={() => handleSort('asc')}
            >
              Sort Ascending
            </Button>
            <Button
              type="link"
              icon={<SortDescendingOutlined />}
              onClick={() => handleSort('desc')}
            >
              Sort Descending
            </Button>
          </div>
          {selectedView === 'teams' ? (
            <Table dataSource={teamData} columns={teamColumns} />
          ) : (
            <Table dataSource={sortedStudents} columns={columns} />
          )}
          <Modal
            title={<h2 className="custom-modal-title">Student Details - {selectedStudent?.firstNameLastName}</h2>}
            visible={isViewModalVisible}
            onCancel={() => setIsViewModalVisible(false)}
            footer={[
              <Button key="close" onClick={() => setIsViewModalVisible(false)}>
                Close
              </Button>,
            ]}
            width={1200} 
            className="custom-modal"
          >
            {selectedStudent && (
              <div className="custom-modal-content">
                <p><strong className="custom-modal-strong">Roll No:</strong> {selectedStudent?.rollNo}</p>
                <p><strong className="custom-modal-strong">Email:</strong> {selectedStudent?.email}</p>
                <p><strong className="custom-modal-strong">Guide Name:</strong> {selectedStudent?.guideName}</p>
                <Progress studentRollNo={selectedStudent.rollNo} />
              </div>
            )}
          </Modal>
        </div>
      </DashboardNavbar>
    </div>
  );
};

export default Students;
