import React, { useState, useEffect, useCallback } from 'react';
import DashboardNavbar from './DashboardNavbar';
import { useLocation, useNavigate } from 'react-router-dom';
import './CSS/Evaluation.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const [guideName, setGuideName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
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


  const fetchStudents = useCallback(() => {
    fetch(`${apiURL}/api/accounts?role=Student`, {
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
        setStudents(data);
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
      });
  }, []);

  useEffect(() => {
    fetchAllForms();
    fetchStudents();
  }, [fetchAllForms, fetchStudents]);

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
  
    const selectedStudentObject = students.find((student) => student.rollNo === selectedStudent);
  
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
      studentName: `${selectedStudentObject.firstName} ${selectedStudentObject.lastName}`,
      rollNo: selectedStudentObject.rollNo,
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
        `${apiURL}/api/evaluation-forms/check?rollNo=${selectedStudentObject.rollNo}&reviewType=${selectedReviewSystem}`,
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
          await fetch(`${apiURL}/api/evaluation-forms/${existingEntry.id}`, {
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
          const newEntryResponse = await fetch(`${apiURL}/api/evaluation-forms`, {
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
        const newEntryResponse = await fetch(`${apiURL}/api/evaluation-forms`, {
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
      navigate('/evaluationt', { state: { formData: selectedForm } });
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
  
    const selectedStudentObject = students.find((student) => student.rollNo === selectedStudentRollNo);
    if (selectedStudentObject) {
      const studentName = `${selectedStudentObject.firstName} ${selectedStudentObject.lastName}`;
      setSelectedStudentName(studentName);
  
      try {
        // Call fetchGuideAndProject with the correct selected student roll number
        const response = await fetchGuideAndProject(selectedStudentRollNo);
      
        // Assuming the response is an array of form submissions for the selected student
        console.log('Selected Student Project Data:', response);
      
        // Find the correct form submission for the selected student
        const selectedSubmission = response.find(submission => submission.rollNumber === selectedStudentRollNo);
      
        if (selectedSubmission) {
          console.log('Selected Student Guide Name:', selectedSubmission.guideName);
          console.log('Selected Student Project Title:', selectedSubmission.projectTitle);
          setGuideName(selectedSubmission.guideName || 'Guide not filled');
          setProjectTitle(selectedSubmission.projectTitle || 'Project Title not filled');
        } else {
          console.log('Form submission not found for the selected student');
          setGuideName('Guide not available');
          setProjectTitle('Project Title not available');
        }
      } catch (error) {
        console.error('Error fetching Guide and Project Title:', error);
        setGuideName('Guide not available');
        setProjectTitle('Project Title not available');
      }
    } else {
      setSelectedStudentName('');
      setGuideName('');
      setProjectTitle('');
    }
  };
  

  const handleRemarksChange = (event) => {
    setRemarks(event.target.value);
  };

  const fetchGuideAndProject = async (selectedStudentRollNo) => {
    const apiUrl = `${apiURL}/api/formproject?rollNumber=${selectedStudentRollNo}`;
    console.log('API URL:', apiUrl); // Add this console log
  
    const response = await fetch(apiUrl, {
      method: 'GET',
      credentials: 'include',
      headers:{
        'Content-Type': 'application/json',
      },
    });
  
    console.log('API Response:', response); // Add this console log
  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    return response.json();
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
                <option key={student.rollNo} value={student.rollNo}>
                  {selectedStudent === student.rollNo
                    ? selectedStudentName
                    : `${student.rollNo}`}
                </option>
              ))}
            </select>
          </div>

          {selectedStudent && (
            <div className="student-detailst">
              <div>
                <strong>Guide Name:</strong> {guideName}
              </div>
              <div>
                <strong>Project Title:</strong> {projectTitle}
              </div>
            </div>
          )}

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
                              <td rowSpan={parameter.subParameters.length}>
                                {parameter.parameterTitle}
                              </td>
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
                <div className="remarkst">
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
}
    
export default Evaluation;
