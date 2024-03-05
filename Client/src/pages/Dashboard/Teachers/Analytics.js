import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import './CSS/Analytics.css';
import { Bar } from 'react-chartjs-2';
import config from '../../../config';
import { Select, Button, Table, Typography, Card } from 'antd';

const { Option } = Select;
const { Title, Text } = Typography;

const apiUrl = config.apiUrl;

const Analytics = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [marks, setMarks] = useState({});
  const [showAnalytics, setShowAnalytics] = useState(false);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/accounts?role=Student`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchMarks = async (studentRollNo) => {
    console.log('Selected student roll number:', studentRollNo);
    try {
      const response = await fetch(`${apiUrl}/api/get-marks-by-rollno?studentRollNo=${studentRollNo}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      console.log('Fetched marks data:', data);
      setMarks(data);
    } catch (error) {
      console.error('Error fetching marks:', error);
      setMarks({}); 
    }
  };

  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  const calculateOverallPerformance = () => {
    const totalMarks = Object.values(marks).reduce((sum, mark) => sum + mark, 0);
    const totalSubjects = Object.keys(marks).length;
    return totalMarks / totalSubjects;
  };

  const chartData = {
    labels: Object.keys(marks).slice(0, 50), 
    datasets: [
      {
        label: 'Marks',
        data: Object.values(marks).slice(0, 50), 
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  

  const handleStudentSelection = (value) => {
    setSelectedStudent(value);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="analytics-container">
      <DashboardNavbar>
        <div className="analytics-content">
          <Title level={2} className="analytics-heading">
            Student Marks Analytics
          </Title>

          <div className="select-student">
            <Select
              id="studentSelection"
              value={selectedStudent}
              onChange={handleStudentSelection}
              style={{ width: 200 }}
            >
              <Option value="">Select...</Option>
              {students.map((student) => (
                <Option key={student.rollNo} value={student.rollNo}>
                  {student.rollNo}
                </Option>
              ))}
            </Select>

            <Button type="primary" onClick={() => fetchMarks(selectedStudent)}>
              Fetch Marks
            </Button>
          </div>

          <div className="marks-list">
            <Title level={3} className="marks-heading">
              Marks of Student:
            </Title>
            <Table
              dataSource={Object.keys(marks).map((subject) => ({
                subject,
                mark: marks[subject] !== null ? marks[subject] : 'N/A',
              }))}
              columns={[
                {
                  title: 'Subject',
                  dataIndex: 'subject',
                  key: 'subject',
                },
                {
                  title: 'Marks',
                  dataIndex: 'mark',
                  key: 'mark',
                },
              ]}
            />
          </div>

          <div className="toggle-analytics">
            <Button onClick={toggleAnalytics}>Toggle Analytics</Button>
          </div>

          {showAnalytics && (
            <Card className="analytics" title="Analytics based on student marks">
              <div className="chart-container">
                <Bar data={chartData} options={{ responsive: true }} />
              </div>
            </Card>
          )}

          {selectedStudent && (
            <Card className="overall-performance">
              <Title level={3}>Overall Performance</Title>
              <Text>
                {`Overall Performance of ${selectedStudent}: ${calculateOverallPerformance()}`}
              </Text>
            </Card>
          )}
        </div>
      </DashboardNavbar>
    </div>
  );
};

export default Analytics;
