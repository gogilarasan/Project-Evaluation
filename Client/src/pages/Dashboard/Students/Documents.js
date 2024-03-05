import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import './CSS/Document.css';
import config from '../../../config';

const apiUrl = config.apiUrl;

const Documents = () => {
  const [driveLink, setDriveLink] = useState('');
  const [reportLink, setReportLink] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [rollNo, setRollNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [submissionExistsR, setSubmissionExistsR] = useState(false);
  const [submissionExistsD, setSubmissionExistsD] = useState(false);
  const [selectedLinkType, setSelectedLinkType] = useState('');
  const [eventExists, setEventExists] = useState(false);

  const getCookie = (name) => {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift().trim();
    return undefined;
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const rollNo = getCookie('loggedIn');
        console.log('RollNo : ', rollNo);
        const response = await fetch(`${apiUrl}/api/currentuser?rollNo=${rollNo}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const user = await response.json();
          setRollNo(user.rollNo);
        } else {
          console.error('Error fetching current user:', response.status);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const checkSubmissionExistence = async () => {
      try {
        setLoading(true);

        const responseReport = await fetch(`${apiUrl}/api/submitlink?rollNo=${rollNo}&linkType=report`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (responseReport.ok) {
          const data = await responseReport.json();
          setSubmissionExistsR(data !== null);
        }

        const responseDrive = await fetch(`${apiUrl}/api/submitlink?rollNo=${rollNo}&linkType=drive`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (responseDrive.ok) {
          const data = await responseDrive.json();
          setSubmissionExistsD(data !== null);
        }
      } catch (error) {
        console.error('Error checking submission existence:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSubmissionExistence();
  }, [rollNo]);

  useEffect(() => {
    const fetchEventExistence = async () => {
      try {
        setLoading(true);
    
        let eventTitle = '';
    
        // Determine the event title based on the selectedLinkType
        if (selectedLinkType === 'drive') {
          eventTitle = 'Submission Project'; // This should match the title in your database
        } else if (selectedLinkType === 'report') {
          eventTitle = 'Submission Report'; // This should match the title in your database
        }
    
        console.log('Fetching event for selected event type:', eventTitle);
    
        const response = await fetch(`${apiUrl}/api/eventfilter?title=${eventTitle}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (response.ok) {
          const eventData = await response.json();
          // Check if any events matching the title were found
          const eventExists = Array.isArray(eventData) && eventData.length > 0;
          setEventExists(eventExists);
    
          // Log the event data
          console.log('Event data:', eventData);
    
          console.log('Event exists for selected event type:', eventExists);
        } else {
          console.error('Error fetching event details:', response.status);
        }
      } catch (error) {
        console.error('Error fetching event existence:', error);
      } finally {
        setLoading(false);
      }
    };
    

    if (selectedLinkType) {
      fetchEventExistence();
    }
  }, [selectedLinkType]);

  const handleDriveLinkChange = (e) => {
    setDriveLink(e.target.value);
  };

  const handleReportLinkChange = (e) => {
    setReportLink(e.target.value);
  };

  const handleLinkTypeChange = (e) => {
    setSelectedLinkType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLinkType || !eventExists) {
      return;
    }

    try {
      setLoading(true);

      let link = '';

      if (selectedLinkType === 'drive') {
        link = driveLink;
      } else if (selectedLinkType === 'report') {
        link = reportLink;
      }

      const response = await fetch(`${apiUrl}/api/submitlink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ linkType: selectedLinkType, link, rollNo }),
      });

      if (response.ok) {
        setSubmissionStatus(selectedLinkType);
        setDriveLink('');
        setReportLink('');

        if (selectedLinkType === 'drive') {
          setSubmissionExistsD(true);
        } else if (selectedLinkType === 'report') {
          setSubmissionExistsR(true);
        }
      } else {
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error('Error submitting link:', error);
      setSubmissionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const hideToast = () => {
    setSubmissionStatus(null);
  };

  return (
    <div className="dd">
      <DashboardNavbar>
        <div className="ddc">
          <h2>Project Submission</h2>
          <form onSubmit={handleSubmit} className="drive-link-forms">
            <div className="form-groupss">
              <label htmlFor="linkType">Link Type:</label>
              <select id="linkType" value={selectedLinkType} onChange={handleLinkTypeChange} required>
                <option value="">Select Link Type</option>
                <option value="drive">Project Link</option>
                <option value="report">Report Link</option>
              </select>
            </div>

            <div className="form-groupss">
              <label htmlFor="link">Link:</label>
              <div className="link-input">
                <input
                  type="text"
                  id="link"
                  value={selectedLinkType === 'drive' ? driveLink : reportLink}
                  onChange={selectedLinkType === 'drive' ? handleDriveLinkChange : handleReportLinkChange}
                  required
                  disabled={
                    (submissionStatus && submissionStatus === selectedLinkType) ||
                    (selectedLinkType === 'drive' ? submissionExistsD : submissionExistsR) ||
                    !eventExists
                  }
                />
                {selectedLinkType === 'drive' && <i className="fas fa-folder link-icon" />}
                {selectedLinkType === 'report' && <i className="fas fa-file-alt link-icon" />}
              </div>
            </div>
            <button
              type="submit"
              className={`submit-btnss ${submissionStatus || (selectedLinkType === 'drive' ? submissionExistsD : submissionExistsR) ? 'disabled' : ''}`}
              disabled={
                loading ||
                submissionStatus ||
                (selectedLinkType === 'drive' ? submissionExistsD : submissionExistsR) ||
                !eventExists
              }
            >
              {submissionStatus ? 'Submitted' : loading ? 'Submitting...' : selectedLinkType === 'drive' && submissionExistsD ? 'Submitted' : selectedLinkType === 'report' && submissionExistsR ? 'Submitted' : 'Submit'}
            </button>
          </form>
          {submissionStatus && submissionStatus !== 'error' && (
            <div className={`toast success-toast ${submissionStatus}-toast`}>
              <i className="toast-icon" style={{ color: '#4CAF50' }}>✔️</i>
              <p>{submissionStatus === 'drive' ? 'Drive Link' : 'Report Link'} submitted successfully!</p>
              {setTimeout(hideToast, 3000)}
            </div>
          )}
          {submissionStatus === 'error' && (
            <div className="toast error-toast">
              <i className="toast-icon" style={{ color: '#f44336' }}>❌</i>
              <p>Link submission failed. Please try again later.</p>
              {setTimeout(hideToast, 3000)}
            </div>
          )}
        </div>
      </DashboardNavbar>
    </div>
  );
};

export default Documents;
