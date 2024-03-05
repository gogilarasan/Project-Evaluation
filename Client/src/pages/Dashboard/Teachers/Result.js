import React, { useState, useEffect, useCallback } from 'react';
import { Select, Input, Button, Row, Col, Typography, message } from 'antd';
import DashboardNavbar from './DashboardNavbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CSS/Result.css';
import config from '../../../config';

const { Option } = Select;
const { Title, Paragraph } = Typography;

const apiUrl = config.apiUrl;

const Result = () => {
  const [averageTotalMarks, setAverageTotalMarks] = useState(null);
  const [selectedStudentRollNo, setSelectedStudentRollNo] = useState('');
  const [students, setStudents] = useState([]);
  const [guideMarks, setGuideMarks] = useState(null);
  const [firstReviewMarks, setFirstReviewMarks] = useState(null);
  const [secondReviewMarks, setSecondReviewMarks] = useState(null);
  const [thirdReviewMarks, setThirdReviewMarks] = useState(null);
  const [weightage, setWeightage] = useState({
    firstReview: 0.25,
    secondReview: 0.25,
    thirdReview: 0.25,
    guideReview: 0.25,
  });

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/accounts?role=Student`, {
        credentials: 'include',
      });

      if (response.ok) {
        const studentsData = await response.json();
        setStudents(studentsData);
      } else {
        console.error('Failed to fetch students:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchMarks = useCallback(async () => {
    try {
      const fetchReviewMarks = async (review, studentRollNo) => {
        try {
          console.log(`Fetching ${review} review marks for student rollNo: ${studentRollNo}`);
          const response = await fetch(`${apiUrl}/api/evaluationstaff?rollNo=${studentRollNo}&reviewType=${review}`, {
            credentials: 'include',
            method: 'GET',
          });

          if (response.ok) {
            const marks = await response.json();
            return marks;
          } else {
            console.error(`Failed to fetch ${review} review marks:`, response.status, response.statusText);
            return [];
          }
        } catch (error) {
          console.error(`Error fetching ${review} review marks:`, error);
          return [];
        }
      };

      const fetchGuideMarks = async (studentRollNo) => {
        try {
          const response = await fetch(`${apiUrl}/api/formsguidemarkstaff?rollNo=${studentRollNo}`, {
            credentials: 'include',
          });

          if (response.ok) {
            const guideMarksData = await response.json();
            setGuideMarks(guideMarksData);
            return guideMarksData;
          } else {
            console.error('Failed to fetch guide marks:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('Error fetching guide marks:', error);
        }
      };

      if (selectedStudentRollNo) {
        console.log(`Fetching marks for student rollNo: ${selectedStudentRollNo}`);
        const [firstMarks, secondMarks, thirdMarks, guideMarksData] = await Promise.all([
          fetchReviewMarks('First', selectedStudentRollNo),
          fetchReviewMarks('Second', selectedStudentRollNo),
          fetchReviewMarks('Third', selectedStudentRollNo),
          fetchGuideMarks(selectedStudentRollNo),
        ]);
        console.log('First Marks:', firstMarks);
        console.log('Second Marks:', secondMarks);
        console.log('Third Marks:', thirdMarks);
        console.log('Guide Marks Data:', guideMarksData);

        const calculatedMarks = calculateWeightedAverage([firstMarks, secondMarks, thirdMarks, guideMarksData], weightage);

        console.log('Guide mark', guideMarksData);

        setFirstReviewMarks(firstMarks);
        setSecondReviewMarks(secondMarks);
        setThirdReviewMarks(thirdMarks);

        setAverageTotalMarks(calculatedMarks);
        console.log('Total marks obtained', calculatedMarks);
      }
    } catch (error) {
      console.error('Error fetching marks:', error);
    }
  }, [selectedStudentRollNo, weightage]);

  const calculateWeightedAverage = (marksArray, weightage) => {
    let weightedSum = 0;
    let totalWeightage = 0;

    marksArray.forEach((marks, index) => {
      console.log('Marks:', marks);
      const reviewType = Object.keys(weightage)[index];
      const reviewWeightage = weightage[reviewType];

      if (marks && marks.calculatedTotalMarks !== undefined) {
        weightedSum += marks.calculatedTotalMarks * reviewWeightage;
        console.log('Weighted Sum:', weightedSum);
        totalWeightage += reviewWeightage;
        console.log('Total Weightage Sum:', totalWeightage);
      }
    });

    console.log('Weighted Sum:', weightedSum);
    console.log('Total Weightage Sum:', totalWeightage);

    if (totalWeightage === 0) {
      return 0; // Avoid division by zero
    }

    return weightedSum / totalWeightage;
  };

  const setWeightageOnServer = async () => {
    try {
      await fetch(`${apiUrl}/api/set-weightage`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(weightage),
      });
      console.log('Weightage set successfully');
    } catch (error) {
      console.error('Error setting weightage:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const calculateMarksAndSave = async () => {
    if (selectedStudentRollNo) {
      await fetchMarks();

      const response = await fetch(`${apiUrl}/api/exists-marks?studentRollNo=${selectedStudentRollNo}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const { exists } = await response.json();

        if (exists) {
          try {
            const response = await fetch(`${apiUrl}/api/update-marks`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                studentRollNo: selectedStudentRollNo,
                firstReview: firstReviewMarks.calculatedTotalMarks,
                secondReview: secondReviewMarks.calculatedTotalMarks,
                thirdReview: thirdReviewMarks.calculatedTotalMarks,
                guideMarks: guideMarks.calculatedTotalMarks,
                totalMarks: averageTotalMarks,
              }),
            });

            if (response.ok) {
              message.success('Marks updated successfully');
            } else {
              message.error('Failed to update marks');
            }
          } catch (error) {
            console.error('Error updating marks:', error);
          }
        } else {
          try {
            const response = await fetch(`${apiUrl}/api/save-marks`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                studentRollNo: selectedStudentRollNo,
                firstReview: firstReviewMarks.calculatedTotalMarks,
                secondReview: secondReviewMarks.calculatedTotalMarks,
                thirdReview: thirdReviewMarks.calculatedTotalMarks,
                guideMarks: guideMarks.calculatedTotalMarks,
                totalMarks: averageTotalMarks,
              }),
            });

            if (response.ok) {
              message.success('Marks saved successfully');
            } else {
              message.error('Failed to save marks');
            }
          } catch (error) {
            console.error('Error saving marks:', error);
          }
        }
      } else {
        console.error('Error checking if marks exist:', response.status, response.statusText);
      }
    }
  };

  const handleStudentChange = (value) => {
    setSelectedStudentRollNo(value);
  };

  useEffect(() => {
    if (selectedStudentRollNo) {
      fetchMarks();
    }
  }, [selectedStudentRollNo, fetchMarks]);

  const handleWeightageChange = (reviewType, value) => {
    setWeightage((prevWeightage) => ({
      ...prevWeightage,
      [reviewType]: parseFloat(value),
    }));
  };

  return (
    <DashboardNavbar>
      <div className="dr">
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
          <Col span={24}>
            <Title level={2} className="result-heading">
              Result
            </Title>
            <div className="student-rollno">
              <Paragraph>Select Student Roll No:</Paragraph>
              <Select
                value={selectedStudentRollNo}
                onChange={handleStudentChange}
                style={{ width: 200 }}
              >
                <Option value="">Select a student</Option>
                {students.map((student) => (
                  <Option key={student.rollNo} value={student.rollNo}>
                    {student.rollNo}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="total-marks-container">
              {averageTotalMarks !== null ? (
                <div className="total-marks">
                  <Paragraph className="total-marks-label">Total Marks:</Paragraph>
                  <Title level={3} className="average-marks">
                    {averageTotalMarks.toFixed(2)}
                  </Title>
                </div>
              ) : (
                <Paragraph className="loading">Loading...</Paragraph>
              )}
            </div>
            <div className="review-marks">
              <Title level={3}>Review Marks</Title>
              <Paragraph>
                First Review: {firstReviewMarks && firstReviewMarks.calculatedTotalMarks !== undefined ? firstReviewMarks.calculatedTotalMarks : 'N/A'}
              </Paragraph>
              <Paragraph>
                Second Review: {secondReviewMarks && secondReviewMarks.calculatedTotalMarks !== undefined ? secondReviewMarks.calculatedTotalMarks : 'N/A'}
              </Paragraph>
              <Paragraph>
                Third Review: {thirdReviewMarks && thirdReviewMarks.calculatedTotalMarks !== undefined ? thirdReviewMarks.calculatedTotalMarks : 'N/A'}
              </Paragraph>
              <Paragraph>
                Guide Marks: {guideMarks && guideMarks.calculatedTotalMarks !== undefined ? guideMarks.calculatedTotalMarks : 'N/A'}
              </Paragraph>
            </div>
            <div className="weightage-inputs">
              <Title level={3}>Weightage</Title>
              <div className="weightage-input">
                <Paragraph>First Review:</Paragraph>
                <Input
                  type="number"
                  value={weightage.firstReview}
                  onChange={(e) => handleWeightageChange('firstReview', e.target.value)}
                />
              </div>
              <div className="weightage-input">
                <Paragraph>Second Review:</Paragraph>
                <Input
                  type="number"
                  value={weightage.secondReview}
                  onChange={(e) => handleWeightageChange('secondReview', e.target.value)}
                />
              </div>
              <div className="weightage-input">
                <Paragraph>Third Review:</Paragraph>
                <Input
                  type="number"
                  value={weightage.thirdReview}
                  onChange={(e) => handleWeightageChange('thirdReview', e.target.value)}
                />
              </div>
              <div className="weightage-input">
                <Paragraph>Guide Marks:</Paragraph>
                <Input
                  type="number"
                  value={weightage.guideReview}
                  onChange={(e) => handleWeightageChange('guideReview', e.target.value)}
                />
              </div>
              <Button onClick={setWeightageOnServer} type="primary">
                Set Weightage
              </Button>
              <Button onClick={calculateMarksAndSave} type="primary">
                Calculate Marks and Save
              </Button>
            </div>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </Col>
        </Row>
      </div>
    </DashboardNavbar>
  );
};

export default Result;
