import React, { useState, useEffect, useCallback } from 'react';
import DashboardNavbar from './DashboardNavbar';
import "./CSS/Details.css";
import config from '../../../config';

const apiUrl = config.apiUrl;

const Detailss = () => {
  const [submissionData, setSubmissionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReviewType, setSelectedReviewType] = useState('');

  const getCookie = (name) => {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift().trim(); // Trim whitespace
    return undefined; // Return undefined if the cookie name is not found
  };

  const fetchSubmissionData = useCallback(async () => {
    try {
      // Get the rollNo cookie value
      const rollNo = getCookie('loggedIn');
      console.log('RollNo : ',rollNo);

      console.log('Fetching submission data...');
      
      const response = await fetch(`${apiUrl}/api/evaluation-forms?rollNo=${rollNo}&reviewType=${selectedReviewType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissionData(data);
        setLoading(false);
      } else {
        setError('Failed to fetch evaluation form submission');
        setLoading(false);
      }
    } catch (error) {
      setError('An error occurred while fetching evaluation form submission');
      setLoading(false);
    }
  }, [selectedReviewType]);

  useEffect(() => {
    console.log('Fetching submission data on selectedReviewType change...');
    if (selectedReviewType) {
      fetchSubmissionData();
    }
  }, [selectedReviewType, fetchSubmissionData]);

  const handleReviewTypeChange = (event) => {
    setSelectedReviewType(event.target.value);
  };

  const renderFormParameters = () => {
    if (!submissionData || !submissionData.formParameters) {
      return null;
    }

    return (
      <div>
        <h3>Form Parameters:</h3>
        <table>
          <thead>
            <tr>
              <th>Parameter Title</th>
              <th>Subparameter Title</th>
              <th>Max Marks</th>
              <th>Given Marks</th>
            </tr>
          </thead>
          <tbody>
            {submissionData.formParameters.map((parameter, index) => (
              parameter.subParameters.map((subParameter, subIndex) => (
                <tr key={`${index}-${subIndex}`}>
                  <td>{parameter.parameterTitle}</td>
                  <td>{subParameter.subParameterName}</td>
                  <td>{subParameter.subParameterMaxMarks}</td>
                  <td>
                    {submissionData.formValues[index]?.subParameterMarks[subIndex]?.subParameterMarks}
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
        {submissionData.calculatedTotalMarks && (
          <div>
            <h3>Total Marks:</h3>
            <p>{submissionData.calculatedTotalMarks}</p>
          </div>
        )}
        {submissionData.remarks && (
          <div>
            <h3>Report:</h3>
            <p>{submissionData.remarks}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="drr">
      <DashboardNavbar>
      <div className="dcr">
        <div className="form-detailsr">
          <h2>Review Details</h2>
          <div className="review-type-selectr">
            <label htmlFor="reviewType">Select Review Type:</label>
            <select id="reviewType" value={selectedReviewType} onChange={handleReviewTypeChange}>
              <option value="">Select...</option>
              <option value="First">First</option>
              <option value="Second">Second</option>
              <option value="Third">Third</option>
            </select>
            <button onClick={() => fetchSubmissionData()}>Fetch Submission</button>
          </div>
          {loading ? (
            <h2>Loading...</h2>
          ) : error ? (
            <h2>Error: {error}</h2>
          ) : submissionData ? (
            <div>
              <table>
                <tbody>
                  <tr>
                    <td>Student Name:</td>
                    <td>{submissionData.studentName}</td>
                  </tr>
                  <tr>
                    <td>Roll Number:</td>
                    <td>{submissionData.rollNo}</td>
                  </tr>
                  <tr>
                    <td>Form Title:</td>
                    <td>{submissionData.formTitle}</td>
                  </tr>
                  <tr>
                    <td>Review Type:</td>
                    <td>{submissionData.reviewType}</td>
                  </tr>
                </tbody>
              </table>
              {renderFormParameters()}
            </div>
          ) : (
            <h2>Not Validated</h2>
          )}
        </div>
        <div className="add">
          <h3>Provider</h3>
          <p>View the Remarks for the First,Second and Third review based on the paramters and the Total marks obtained by the Student Which helps in easy clarification of the Students .</p>
        </div>
      </div>
      </DashboardNavbar>
    </div>
  );
};

export default Detailss;
