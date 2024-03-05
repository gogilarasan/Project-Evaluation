import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import './CSS/Dashboard.css';
import config from '../../../config';
const apiUrl = config.apiUrl;

const DashboardA = () => {
  const [showCreateCircular, setShowCreateCircular] = useState(false);
  const [showCreateMessage, setShowCreateMessage] = useState(false);
  const [circularTitle, setCircularTitle] = useState('');
  const [circularContent, setCircularContent] = useState('');
  const [messageTitle, setMessageTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [selectedRecipients, setSelectedRecipients] = useState({
    students: false,
    staffs: false,
    guides: false,
  });
  const [circulars, setCirculars] = useState([]);
  const [messages, setMessages] = useState([]);
  const [pdfViewUrl, setPdfViewUrl] = useState('');
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    fetchCirculars();
    fetchMessages();
  }, []);

  const fetchCirculars = async () => {
    try {

      const response = await fetch(`${apiUrl}/admin/circulars`, {
        headers: {

        },
        credentials: 'include',
      });
      const data = await response.json();
      setCirculars(data);
    } catch (error) {
      console.error('Error fetching circulars:', error);
    }
  };

  const fetchMessages = async () => {
    try {

      const response = await fetch(`${apiUrl}/admin/messages`, {
        headers: {

        },
        credentials: 'include',
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleCircularSubmit = async () => {
    try {

      const requestBody = {
        title: circularTitle,
        content: circularContent,
        recipients: Object.keys(selectedRecipients).filter(
          (key) => selectedRecipients[key]
        ),
        pdfUrl: selectedPdf,
      };

      const response = await fetch(`${apiUrl}/admin/createCircular`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      const newCircular = await response.json();
      setCirculars([...circulars, newCircular]);
      setShowCreateCircular(false);
      setCircularTitle('');
      setCircularContent('');
      setSelectedRecipients({
        students: false,
        staffs: false,
        guides: false,
      });
    } catch (error) {
      console.error('Error creating circular:', error);
    }
  };

  const handleMessageSubmit = async () => {
    try {


      const requestBody = {
        title: messageTitle,
        content: messageContent,
        recipients: Object.keys(selectedRecipients).filter(
          (key) => selectedRecipients[key]
        ),
        pdfUrl: selectedPdf,
      };

      const response = await fetch(`${apiUrl}/admin/createMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      const newMessage = await response.json();
      setMessages([...messages, newMessage]);
      setShowCreateMessage(false);
      setMessageTitle('');
      setMessageContent('');
      setSelectedRecipients({
        students: false,
        staffs: false,
        guides: false,
      });
    } catch (error) {
      console.error('Error creating message:', error);
    }
  };

  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('pdf', file);

    try {

      const response = await fetch(`${apiUrl}/admin/uploadPdf`, {
        method: 'POST',
        headers: {

        },
        credentials: 'include',
        body: formData,
      });

      const pdfData = await response.json();

      console.log('PDF Upload Response:', pdfData);

      setSelectedPdf(pdfData.pdfUrl);
      console.log('PDFURL:',pdfData.pdfUrl);
    } catch (error) {
      console.error('Error uploading PDF:', error);
    }
  };

  const handleViewPdf = async (pdfUrl) => {
    try {

      const fullPdfUrl = `${apiUrl}/${pdfUrl}`;
      console.log('PDF:',fullPdfUrl);
      const response = await fetch(fullPdfUrl, {
        headers: {

        },
        credentials: 'include',
      });

      if (response.ok) {
        const blob = await response.blob();
        console.log('BLOB:',blob);
        const blobUrl = URL.createObjectURL(blob);

        setPdfViewUrl(blobUrl);
        setShowPdfViewer(true);
      } else {
        console.error('Error fetching PDF:', response.status);
      }
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  };

  const handleClosePdfViewer = () => {
    setPdfViewUrl('');
    setShowPdfViewer(false);
  };

  const handleCircularDelete = async (circularId) => {
    try {

      await fetch(`${apiUrl}/admin/deleteCircular/${circularId}`, {
        method: 'DELETE',
        headers: {

        },
        credentials: 'include',
      });

      setCirculars(circulars.filter((circular) => circular.id !== circularId));
    } catch (error) {
      console.error('Error deleting circular:', error);
    }
  };

  const handleMessageDelete = async (messageId) => {
    try {

      await fetch(`${apiUrl}/admin/deleteMessage/${messageId}`, {
        method: 'DELETE',
        headers: {

        },
        credentials: 'include',
      });

      setMessages(messages.filter((message) => message.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <div className="d">
      <DashboardNavbar>
      <div className="dc">
        <div className="cd">
          <div className="ce">
            <h2>Dashboard Content</h2>
            <div className="options">
              <div className="option option-circular" onClick={() => setShowCreateCircular(true)}>
                <i className="fas fa-file-alt option-icon"></i>
                <span>Create Circular</span>
              </div>
              <div className="option option-message" onClick={() => setShowCreateMessage(true)}>
                <i className="fas fa-envelope option-icon"></i>
                <span>Create Message</span>
              </div>
            </div>
            {showCreateCircular && (
              <div className="cs">
                <h3>Create Circular:</h3>
                <input
                  type="text"
                  placeholder="Title"
                  value={circularTitle}
                  onChange={(e) => setCircularTitle(e.target.value)}
                />
                <textarea
                  placeholder="Content"
                  value={circularContent}
                  onChange={(e) => setCircularContent(e.target.value)}
                />
                <div>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedRecipients.students}
                      onChange={(e) =>
                        setSelectedRecipients({
                          ...selectedRecipients,
                          students: e.target.checked,
                        })
                      }
                    />
                    Students
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedRecipients.staffs}
                      onChange={(e) =>
                        setSelectedRecipients({
                          ...selectedRecipients,
                          staffs: e.target.checked,
                        })
                      }
                    />
                    Staffs
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedRecipients.guides}
                      onChange={(e) =>
                        setSelectedRecipients({
                          ...selectedRecipients,
                          guides: e.target.checked,
                        })
                      }
                    />
                    Guides
                  </label>
                </div>
                <input type="file" name="pdf" accept=".pdf" onChange={handlePdfUpload} />
                <button onClick={handleCircularSubmit}>Upload Circular</button>
              </div>
            )}
            {showCreateMessage && (
              <div className="cs">
                <h3>Create Message:</h3>
                <input
                  type="text"
                  placeholder="Title"
                  value={messageTitle}
                  onChange={(e) => setMessageTitle(e.target.value)}
                />
                <textarea
                  placeholder="Content"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                />
                <div>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedRecipients.students}
                      onChange={(e) =>
                        setSelectedRecipients({
                          ...selectedRecipients,
                          students: e.target.checked,
                        })
                      }
                    />
                    Students
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedRecipients.staffs}
                      onChange={(e) =>
                        setSelectedRecipients({
                          ...selectedRecipients,
                          staffs: e.target.checked,
                        })
                      }
                    />
                    Staffs
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedRecipients.guides}
                      onChange={(e) =>
                        setSelectedRecipients({
                          ...selectedRecipients,
                          guides: e.target.checked,
                        })
                      }
                    />
                    Guides
                  </label>
                </div>
                <input type="file" name="pdf" accept=".pdf" onChange={handlePdfUpload} />
                <button onClick={handleMessageSubmit}>Upload Message</button>
              </div>
            )}
            <div className="circulars">
              <p>Welcome to the Academic Operations and Evaluation (AOPE) Dashboard! This platform is designed to streamline various academic processes and provide essential tools for students and staff. Below are instructions to help you navigate and utilize the features effectively:</p>
            </div>
            <div className="circulars">
              <h3>Circulars</h3>
              {circulars.map((circular) => (
                <div key={circular.id} className="circular">
                  <i className="fas fa-file-alt circular-icon colored-icon"></i>
                  <div className="circular-info">
                    <h4>{circular.title}</h4>
                    <p>{circular.content}</p>
                    <p>Recipients: {circular.recipients ? circular.recipients.join(', ') : 'None'}</p>
                    {/*console.log('PDF URL:', circular.pdfUrl)*/}
                    {circular.pdfUrl && (
                      <div className="pdf-delete-buttons">
                        <button onClick={() => {
                          handleViewPdf(circular.pdfUrl);
                          setSelectedItemId(circular.id);
                        }} className="pdf-button">View PDF</button>
                        {showPdfViewer && selectedItemId === circular.id && (
                          <div className="pdf-viewer">
                            <iframe
                              src={pdfViewUrl}
                              title={`Circular PDF: ${circular.title}`}
                              width="900px"
                              height="600px"
                            ></iframe>
                            <button onClick={handleClosePdfViewer} className="pdf-button">Close PDF</button>
                          </div>
                        )}
                        <button onClick={() => handleCircularDelete(circular.id)} className="delete-button">Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="messages">
              <h3>Messages</h3>
              {messages.map((message) => (
                <div key={message.id} className="message">
                  <i className="fas fa-envelope message-icon colored-icon"></i>
                  <div className="message-info">
                    <h4>{message.title}</h4>
                    <p>{message.content}</p>
                    <p>Recipients: {message.recipients ? message.recipients.join(', ') : 'None'}</p>
                    {message.pdfUrl && (
                      <div className="pdf-delete-buttons">
                        <button onClick={() => {
                          handleViewPdf(message.pdfUrl);
                          setSelectedItemId(message.id);
                        }} className="pdf-button">View PDF</button>
                        {showPdfViewer && selectedItemId === message.id && (
                          <div className="pdf-viewer">
                            <iframe
                              src={pdfViewUrl}
                              title={`Message PDF: ${message.title}`}
                              width="900px"
                              height="600px"
                            ></iframe>
                            <button onClick={handleClosePdfViewer} className="pdf-button">Close PDF</button>
                          </div>
                        )}
                        <button onClick={() => handleMessageDelete(message.id)} className="delete-button">Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </DashboardNavbar>
    </div>
  );
};

export default DashboardA;
