import React, { useState, useEffect, useCallback } from 'react';
import DashboardNavbar from './DashboardNavbar';
import './CSS/Dashboard.css';
import { useLocation, useNavigate } from 'react-router-dom';
import './CSS/Evaluation.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCookie } from './cookie';
import config from '../../../config';

const apiURL = config.apiUrl;

const Evaluation = () => {
  const location = useLocation();
  const formData = location.state?.formData;
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedStudentName, setSelectedStudentName] = useState('');
  const [selectedReviewSystem, setSelectedReviewSystem] = useState('');
  const [allForms, setAllForms] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [overallTotalMarks, setOverallTotalMarks] = useState(0);
  const [calculatedTotalMarks, setCalculatedTotalMarks] = useState(0);

  const fetchAllForms = useCallback(() => {
    fetch(`${apiURL}/api/forms`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setAllForms(data);
      })
      .catch((error) => {
        console.error('Error fetching all forms:', error);
      });
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const rollNo = getCookie('loggedIn');
      
      const response = await fetch(`${apiURL}/api/currentuser?rollNo=${rollNo}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        return userData.rollNo;
      } else {
        console.error('Failed to fetch current user:', response.status, response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  };

  const fetchStudents = useCallback(async (guideRollNo) => {
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
      } else {
        console.error('Failed to fetch students:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      const userRollNo = await fetchCurrentUser();
      if (userRollNo) {
        fetchStudents(userRollNo);
      }
    }
    fetchData();
    fetchAllForms();
  }, [fetchStudents, fetchAllForms]);

  useEffect(() => {
    if (formData) {
      let initialTotalMarks = 0;
      formData.formParameters.forEach((parameter) => {
        parameter.subParameters.forEach((subParameter) => {
          const maxMarks = parseInt(subParameter.subParameterMaxMarks, 10);
          if (!isNaN(maxMarks)) {
            initialTotalMarks += maxMarks;
          }
        });
      });
      setOverallTotalMarks(initialTotalMarks);
    }
  }, [formData]);

  const handleMarksChange = (parameterIndex, subParameterIndex, key, value) => {
    let updatedValues = [...formValues];
    if (!updatedValues[parameterIndex]) {
      updatedValues[parameterIndex] = { subParameterMarks: [] };
    }
    if (!updatedValues[parameterIndex].subParameterMarks[subParameterIndex]) {
      updatedValues[parameterIndex].subParameterMarks[subParameterIndex] = {};
    }

    const maxMarks = parseInt(formData.formParameters[parameterIndex].subParameters[subParameterIndex].subParameterMaxMarks, 10);
    const enteredMarks = parseInt(value, 10);

    // Check if the entered marks exceed the maximum marks
    if (!isNaN(maxMarks) && !isNaN(enteredMarks)) {
      if (enteredMarks > maxMarks) {
        // If the entered marks exceed the maximum, set the marks to the maximum allowed value
        updatedValues[parameterIndex].subParameterMarks[subParameterIndex][key] = maxMarks.toString();
      } else {
        updatedValues[parameterIndex].subParameterMarks[subParameterIndex][key] = value;
      }
    } else {
      // If either the maximum marks or entered marks are not valid numbers, set the marks to the entered value
      updatedValues[parameterIndex].subParameterMarks[subParameterIndex][key] = value;
    }

    // Calculate the overall total marks
    let newCalculatedTotalMarks = 0;
    formData.formParameters.forEach((parameter, parameterIndex) => {
      parameter.subParameters.forEach((subParameter, subParameterIndex) => {
        const marks = updatedValues[parameterIndex]?.subParameterMarks[subParameterIndex]?.subParameterMarks;
        const maxMarks = parseInt(subParameter.subParameterMaxMarks, 10);
        if (!isNaN(marks) && !isNaN(maxMarks)) {
          newCalculatedTotalMarks += Math.min(marks, maxMarks);
        }
      });
    });
    setCalculatedTotalMarks(newCalculatedTotalMarks);
    setFormValues(updatedValues);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Calculated Total Marks:', calculatedTotalMarks); 
  
    if (!selectedStudent) {
      toast.error('Please select a student.');
      return;
    }
  
    const selectedStudentObject = students.find((student) => student.rollNumber === selectedStudent);
  
    if (!selectedStudentObject) {
      toast.error('Invalid student selection.');
      return;
    }
  
    if (!selectedReviewSystem) {
      toast.error('Please select a review system.');
      return;
    }
  
    if (formValues.length !== formData.formParameters.length) {
      toast.error('Please fill all the marks for each parameter.');
      return;
    }
  
    // Check if all the marks for each sub-parameter are filled
    for (let i = 0; i < formValues.length; i++) {
      const parameter = formValues[i];
      if (
        !parameter.subParameterMarks ||
        parameter.subParameterMarks.length !== formData.formParameters[i].subParameters.length
      ) {
        toast.error(`Please fill all the marks for parameter ${formData.formParameters[i].parameterTitle}.`);
        return;
      }
    }
  
    const evaluationEntry = {
      studentName: `${selectedStudentObject.studentName}`,
      rollNo: selectedStudentObject.rollNumber,
      formTitle: formData.formTitle,
      formParameters: formData.formParameters,
      formValues,
      reviewType: selectedReviewSystem,
      remarks,
      calculatedTotalMarks,
    };

    console.log('Evaluation Entry:', evaluationEntry);
  
    try {
      // Check if the evaluation entry already exists in the database for the same roll number and review type
      const existingEntryResponse = await fetch(
        `${apiURL}/api/formsguide/check?rollNo=${selectedStudentObject.rollNo}&reviewType=${selectedReviewSystem}`,
        {
          method: 'GET',
          credentials: 'include',
          headers:{
            'Content-Type': 'application/json',
          },
        }
      );
    
      if (existingEntryResponse.ok) {
        const existingEntry = await existingEntryResponse.json();
        console.log('Existing Entry:', existingEntry); // Add this console log
        if (existingEntry) {
          // If an existing entry is found, perform an update
          console.log('Updating existing entry...'); // Add this console log
          await fetch(`${apiURL}/api/formsguide/${existingEntry.id}`, {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify(evaluationEntry),
            headers:{
              'Content-Type': 'application/json',
            },
          });
          toast.success('Evaluation form updated successfully!');
        } else {
          // Otherwise, create a new entry
          console.log('Creating new entry...'); // Add this console log
          const newEntryResponse = await fetch(`${apiURL}/api/formsguide`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(evaluationEntry),
            headers:{
              'Content-Type': 'application/json',
            },
          });
    
          if (newEntryResponse.ok) {
            toast.success('Evaluation form submitted successfully!');
          } else {
            toast.error('Failed to create new evaluation entry. Please try again.');
          }
        }
      } else if (existingEntryResponse.status === 404) {
        // If the response status is 404, it means no existing entry was found, so create a new entry
        console.log('Creating new entry...'); // Add this console log
        const newEntryResponse = await fetch(`${apiURL}/api/formsguide`, {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(evaluationEntry),
          headers:{
            'Content-Type': 'application/json',
          },
        });
    
        if (newEntryResponse.ok) {
          toast.success('Evaluation form submitted successfully!');
        } else {
          toast.error('Failed to create new evaluation entry. Please try again.');
        }
      } else {
        toast.error('Failed to check existing evaluation entry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting evaluation form:', error);
      toast.error('Failed to submit evaluation form. Please try again.');
    }
};

  
  
  const handleFormSelection = (event) => {
    const selectedFormTitle = event.target.value;
    setSelectedStudent('');
    setSelectedStudentName('');
    setFormValues([]);

    const selectedForm = allForms.find((form) => form.formTitle === selectedFormTitle);
    if (selectedForm) {
      navigate('/evalg', { state: { formData: selectedForm } });
    }
  };

  const handleReviewSystemChange = (event) => {
    const selectedOption = event.target.value;
    setSelectedReviewSystem(selectedOption);
    console.log('Selected Review System:', selectedOption);
  };

  const handleStudentSelection = async (event) => {
    const selectedStudentRollNo = event.target.value;
    setSelectedStudent(selectedStudentRollNo);
    setFormValues([]);
    console.log('Selected Student RollNo:', selectedStudentRollNo);
  
    const selectedStudentObject = students.find((student) => student.rollNumber === selectedStudentRollNo);
    if (selectedStudentObject) {
      const studentName = `${selectedStudentObject.studentName}`;
      setSelectedStudentName(studentName); 
    } else {
      setSelectedStudentName('');
    }
  };
  

  const handleRemarksChange = (event) => {
    setRemarks(event.target.value);
  };


  return (
    <div className="de">
      <DashboardNavbar>
      <div className="dec">
        <h2>Evaluation Page</h2>
  
        <div className="evaluation-formt">
          <div className="form-selectt">
            <label htmlFor="formSelection">Select Form:</label>
            <select id="formSelection" onChange={handleFormSelection}>
              <option value="">Select...</option>
              {allForms.map((form) => (
                <option key={form.id} value={form.formTitle}>
                  {form.formTitle}
                </option>
              ))}
            </select>
          </div>
  
          <div className="form-selectt">
            <label htmlFor="reviewSystem">Select Review System:</label>
            <select id="reviewSystem" onChange={handleReviewSystemChange}>
              <option value="">Select...</option>
              <option value="First">First</option>
              <option value="Second">Second</option>
              <option value="Third">Third</option>
            </select>
          </div>
  
          <div className="form-selectt">
            <label htmlFor="studentSelection">Select Student:</label>
            <select
              id="studentSelection"
              value={selectedStudent}
              onChange={handleStudentSelection}
            >
              <option value="">Select...</option>
              {students.map((student) => (
                <option key={student.rollNumber} value={student.rollNumber}>
                  {selectedStudent === student.rollNumber
                    ? selectedStudentName
                    : `${student.rollNumber}`}
                </option>
              ))}
            </select>
          </div>
  
          {/* Display Form Data */}
          {formData ? (
            <>
              <p>Selected Student RollNo: {selectedStudent}</p>
              <p>Selected Student: {selectedStudentName}</p>
              <p>Form Title: {formData.formTitle}</p>
              
              <form onSubmit={handleSubmit}>
                <table>
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>SubParameter</th>
                      <th>Max Marks</th>
                      <th>Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.formParameters.map((parameter, parameterIndex) => (
                      <React.Fragment key={parameterIndex}>
                        {parameter.subParameters.map((subParameter, subParameterIndex) => (
                          <tr key={`${parameterIndex}-${subParameterIndex}`}>
                            {subParameterIndex === 0 && (
                              <td rowSpan={parameter.subParameters.length}>{parameter.parameterTitle}</td>
                            )}
                            <td>{subParameter.subParameterName}</td>
                            <td>{subParameter.subParameterMaxMarks}</td>
                            <td>
                              <input
                                type="number"
                                className="parameter-input"
                                value={
                                  formValues[parameterIndex]?.subParameterMarks[subParameterIndex]?.subParameterMarks || ''
                                }
                                onChange={(e) =>
                                  handleMarksChange(
                                    parameterIndex,
                                    subParameterIndex,
                                    'subParameterMarks',
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                <div className="total-marks-containert">
                       <p className="total-marks-label">Overall Total Marks:</p>
                       <p className="total-marks-value">{overallTotalMarks}</p>
                       <input
                            type="number"
                            value={calculatedTotalMarks}
                            onChange={(e) => setCalculatedTotalMarks(parseInt(e.target.value, 10))}
                            className="total-marks-input"
                            />
                </div>
                <div className="remarks">
                  <p>Remarks:</p>
                  <textarea
                    value={remarks}
                    onChange={handleRemarksChange}
                    rows={5}
                    cols={50}
                    placeholder="Type your remarks here..."
                  />
                </div>
                <button type="submit" className="submit-button">
                  Submit
                </button>
              </form>
              <ToastContainer />
            </>
          ) : (
            <div>No form data available</div>
          )}
        </div>
      </div>
      </DashboardNavbar>
    </div>
  );
  
};
    
export default Evaluation;
