import React, { useState, useEffect } from 'react';
import { Progress as AntProgress, Steps } from 'antd';
import 'antd/dist/antd';
import './CSS/Progress.css'; 
import config from '../../../config';

const { Step } = Steps;
const apiUrl = config.apiUrl;

const Progress = ({ studentRollNo }) => {
  const [progressData, setProgressData] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        if (studentRollNo) {
          const response = await fetch(`${apiUrl}/api/accounts?role=Student`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            const student = data.find((student) => student.rollNo === studentRollNo);

            fetchProgressData(student);
          } else {
            console.error('Failed to fetch students:', response.status, response.statusText);
          }
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, [studentRollNo]);

  useEffect(() => {
    // Calculate the current step based on progressData and update currentStep state
    const completedSteps = progressData.filter((step) => step.completed).length;
    setCurrentStep(completedSteps);
  }, [progressData]);

  const fetchProgressData = async (student) => {
    try {
      if (student) {
        const responseFormSubmission = await fetch(
          `${apiUrl}/api/formproject/student?rollNumber=${student.rollNo}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );

        console.log('Response from form submission API:', responseFormSubmission);

        const responseVerification = await fetch(`${apiUrl}/api/formproject/student?rollNumber=${studentRollNo}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        console.log('Response from form submission API:', responseVerification);

        const responseReportSubmission = await fetch(
          `${apiUrl}/api/checklinksubmissioncompletedd?rollNo=${studentRollNo}&linkType=report`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Response from form submission API:', responseReportSubmission);

        const responseReportVerification = await fetch(
          `${apiUrl}/api/checklinkverified?rollNo=${studentRollNo}&linkType=report`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Response from form submission API:', responseReportVerification);

        const responseProjectLinkSubmission = await fetch(
          `${apiUrl}/api/checklinksubmissioncompletedd?rollNo=${studentRollNo}&linkType=drive`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Response from form submission API:', responseProjectLinkSubmission);

        const responseProjectLinkVerification = await fetch(
          `${apiUrl}/api/checklinkverified?rollNo=${studentRollNo}&linkType=drive`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Response from form submission API:', responseProjectLinkVerification);

        const responseGuideEvaluation = await fetch(`${apiUrl}/api/formsguideevaluationcompleted?rollNo=${studentRollNo}`, {
              credentials: 'include',
        }
        );

        console.log('Response from form submission API:',  responseGuideEvaluation);
        
        
        if (
          responseFormSubmission.ok &&
          responseVerification.ok &&
          responseReportSubmission.ok &&
          responseReportVerification.ok &&
          responseProjectLinkSubmission.ok &&
          responseProjectLinkVerification.ok &&
          responseGuideEvaluation.ok
        ) {
          const formSubmissionData = await responseFormSubmission.json();
          const verificationData = await responseVerification.json();
          const reportSubmissionData = await responseReportSubmission.json();
          const reportVerificationData = await responseReportVerification.json();
          const projectLinkSubmissionData = await responseProjectLinkSubmission.json();
          const projectLinkVerificationData = await responseProjectLinkVerification.json();
          const guideEvaluationData = await responseGuideEvaluation.json();

          const progressSteps = [
            { title: 'Form Submission', completed: formSubmissionData.length > 0 },
            { title: 'Guide Verification', completed: verificationData.length > 0 },
            { title: 'Report Link Submission', completed: reportSubmissionData.completed },
            { title: 'Report Link Verification', completed: reportVerificationData.verified },
            { title: 'Project Link Submission', completed: projectLinkSubmissionData.completed },
            { title: 'Project Link Verification', completed: projectLinkVerificationData.verified },
            { title: 'Guide Evaluation', completed: guideEvaluationData.completed },
          ];

          setProgressData(progressSteps);
        } else {
          console.error('Failed to fetch progress data for one or more steps.');
        }
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    }
  };

  return (
    <div className="progress-container">
      
      <div className="overall-progress">
        <h3>Overall Progress</h3>
        <Steps current={currentStep} progressDot>
          {progressData.map((item, index) => (
            <Step
              key={index}
              title={item.title}
              description={item.completed ? 'Completed' : 'Incomplete'}
              status={item.completed ? 'finish' : 'wait'}
            />
          ))}
        </Steps>
      </div>
    </div>
  );
};

export default Progress;
