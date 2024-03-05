import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import DashboardNavbar from './DashboardNavbar';
import './CSS/Manage.css';
import config from '../../../config';

const apiUrl = config.apiUrl;

const Manage = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setUploadedFile(file);
  };

  const onSubmit = async () => {
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      try {

        const response = await fetch(`${apiUrl}/admin/uploadData`, {
          method: 'POST',
          body: formData,
          headers: {

          },
          credentials: 'include',
        });

        if (response.ok) {
          setUploadStatus('File uploaded successfully!');
        } else {
          setUploadStatus('Error uploading file');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadStatus('Error uploading file');
      }
    }
  };

  const onDownload = async () => {
    try {

      const response = await fetch(`${apiUrl}/admin/downloadData`, {
        headers: {

        },
        credentials: 'include',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Accounts.xlsx';
        a.click();
        setUploadStatus('Excel sheet downloaded successfully!');
      } else {
        setUploadStatus('Error downloading Excel sheet');
      }
    } catch (error) {
      console.error('Error downloading Excel sheet:', error);
      setUploadStatus('Error downloading Excel sheet');
    }
  };

  return (
    <div className="manage-container">
      <DashboardNavbar>
      <div className="contenta">
        <h2>Data Upload</h2>
        <p>
          This section allows you to create new accounts by uploading an Excel file containing user information.
          Please make sure to follow the guidelines below to ensure successful account creation:
        </p>
        <ul>
          <li>Prepare an Excel file with the required user details.</li>
          <li>The Excel file should include the following columns: First Name, Last Name, Email, Password, Phone Number, Role, University, Roll No, Department.</li>
          <li>Drag and drop the Excel file into the designated area below, or click to select the file.</li>
          <li>Click the "Upload Data" button to create the new accounts based on the information in the Excel file.</li>
          <li>After successful upload, you can download the updated account details in an Excel sheet by clicking the "Download Excel" button.</li>
        </ul>
        <p>
          Please note that passwords provided in the Excel file will be securely hashed before storage.
          Once the accounts are created, you can manage and access them through the dashboard.
        </p>

        <Dropzone onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => (
            <div className="dropzone-container" {...getRootProps()}>
              <input {...getInputProps()} />
              {uploadedFile ? (
                <p>File uploaded: {uploadedFile.name}</p>
              ) : (
                <p>Drag & drop an Excel file here, or click to select one</p>
              )}
            </div>
          )}
        </Dropzone>
        <button className="upload-button" onClick={onSubmit} disabled={!uploadedFile}>
          Upload Data
        </button>
        <button className="download-button" onClick={onDownload}>Download Excel</button>
        {uploadStatus && <p className="status-message">{uploadStatus}</p>}
      </div>
      </DashboardNavbar>
    </div>
  );
};

export default Manage;
