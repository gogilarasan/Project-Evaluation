import React, { useState, useEffect } from 'react';
import { Card, Spin, Table, Typography } from 'antd';
import DashboardNavbar from './DashboardNavbar';
import config from '../../../config';
import './CSS/Result.css';

const { Title, Text } = Typography;

const apiUrl = config.apiUrl;

const Result = () => {
  const [averageTotalMarks, setAverageTotalMarks] = useState(null);
  const [firstReview, setFirstReview] = useState(null);
  const [secondReview, setSecondReview] = useState(null);
  const [thirdReview, setThirdReview] = useState(null);
  const [guideMarks, setGuideMarks] = useState(null);
  const [studentRollNo, setStudentRollNo] = useState('');
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const data = [
    {
      key: '1',
      category: 'First Review',
      value: firstReview,
    },
    {
      key: '2',
      category: 'Second Review',
      value: secondReview,
    },
    {
      key: '3',
      category: 'Third Review',
      value: thirdReview,
    },
    {
      key: '4',
      category: 'Guide Marks',
      value: guideMarks,
    },
    {
      key: '5',
      category: 'Total Marks',
      value:
        averageTotalMarks !== null ? averageTotalMarks.toFixed(2) : 'Marks are not available',
    },
  ];

  const getCookie = (name) => {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift().trim();
    return undefined;
  };

  const fetchCurrentUser = async () => {
    try {
      const rollNo = getCookie('loggedIn');

      const response = await fetch(`${apiUrl}/api/currentuser?rollNo=${rollNo}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const currentUser = await response.json();
        setStudentRollNo(currentUser.rollNo);
        setLoading(false);
      } else {
        console.error('Failed to fetch current user:', response.status, response.statusText);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchMarks = async () => {
    try {
      if (studentRollNo) {
        const response = await fetch(`${apiUrl}/api/get-marks-by-rollno?studentRollNo=${studentRollNo}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const marksData = await response.json();
          if (marksData.totalMarks !== null) {
            setAverageTotalMarks(marksData.totalMarks);
            setFirstReview(marksData.firstReview);
            setSecondReview(marksData.secondReview);
            setThirdReview(marksData.thirdReview);
            setGuideMarks(marksData.guideMarks);
          } else {
            setAverageTotalMarks(null);
            setFirstReview(null);
            setSecondReview(null);
            setThirdReview(null);
            setGuideMarks(null);
          }
        } else {
          console.error('Failed to fetch marks:', response.status, response.statusText);
        }
      }
    } catch (error) {
      console.error('Error fetching marks:', error);
    }
  };

  useEffect(() => {
    fetchMarks();
  }, [studentRollNo, averageTotalMarks]);

  return (
    <div className="result-container">
      <DashboardNavbar>
        <div className="result-content">
          <Title level={2}>Result</Title>
          <Text className="student-roll-no">Student Roll No: {studentRollNo}</Text>
          {loading ? (
            <Spin size="large" className="loading-spinner" />
          ) : (
            <Card className="result-card">
              <Table columns={columns} dataSource={data} pagination={false} />

              {/* Additional Info Section */}
              <div className="additional-info">
                <Title level={3}>Provider</Title>
                <Text>
                  Here, we provide a breakdown of your results. Your total marks are calculated based
                  on three reviews and guide marks. Each review is assigned a weight, and your guide
                  provides guidance marks.
                </Text>
                <Text>
                  <strong>First Review:</strong> This is your initial review.
                </Text>
                <Text>
                  <strong>Second Review:</strong> A second evaluation is performed.
                </Text>
                <Text>
                  <strong>Third Review:</strong> The final review takes place.
                </Text>
                <Text>
                  <strong>Guide Marks:</strong> Your guide's assessment of your work.
                </Text>
                <Text>
                  The <strong>Total Marks</strong> are calculated based on these factors. If any
                  information is missing or not yet available, it will be indicated here.
                </Text>
              </div>
            </Card>
          )}
        </div>
      </DashboardNavbar>
    </div>
  );
};

export default Result;
