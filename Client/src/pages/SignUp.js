import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SignUp.css';
import config from '../config';

const apiUrl = config.apiUrl;


const SignUp = () => {
  const history = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const [university, setUniversity] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [department, setDepartment] = useState('');

  const engineeringDepartments = ['Mechanical', 'ECE', 'Computer Science', 'Civil', 'Chemical', 'IT', 'EEE', 'Biomedical', 'Industrial'];

  const createAccount = (formData) => {
    return fetch(`${apiUrl}/api/signup`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Account creation failed');
        }
      })
      .then(() => {
        // Show success notification
        toast.success('Account created successfully!');
      })
      .catch((error) => {
        // Show error notification
        toast.error('Account creation failed');
        console.log(error);
      });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Perform signup logic here
    if (firstName && lastName && email && password && phoneNumber && role && university && rollNo && department) {
      const formData = {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        role,
        university,
        rollNo,
        department,
      };

      createAccount(formData)
        .then(() => {
          // Reset the form fields
          setFirstName('');
          setLastName('');
          setEmail('');
          setPassword('');
          setPhoneNumber('');
          setRole('');
          setUniversity('');
          setRollNo('');
          setDepartment('');
          history.push('/');
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log('Please fill in all fields');
    }
  };

  return (
    <div className="signup-container">
      <div className="left-half">
        <h2>Sign Up</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-half">
            <div className="form-group">
              <label htmlFor="firstName">
                <i className="fas fa-user"></i> First Name:
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">
                <i className="fas fa-user"></i> Last Name:
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">
                <i className="fas fa-envelope"></i> Email:
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-lock"></i> Password:
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">
                <i className="fas fa-phone"></i> Phone Number:
              </label>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone Number"
                required
              />
            </div>
          </div>
          <div className="form-half">
            {/* Last 4 input fields */}
            <div className="form-group">
              <label htmlFor="role">
                <i className="fas fa-user-tag"></i> Role:
              </label>
              <select name="role" id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="" disabled>Select Role</option>
                <option value="Student">Student</option>
                <option value="Panel">Panel</option>
                <option value="Admin">Admin</option>
                <option value="Guide">Guide</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="university">
                <i className="fas fa-university"></i> University:
              </label>
              <input
                type="text"
                name="university"
                id="university"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="University"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="rollNo">
                <i className="fas fa-id-card"></i> Roll No:
              </label>
              <input
                type="text"
                name="rollNo"
                id="rollNo"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="Roll No"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="department">
                <i className="fas fa-building"></i> Department:
              </label>
              <select name="department" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} required>
                <option value="" disabled>Select Department</option>
                {engineeringDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <input type="submit" value="Sign Up" className="form-button" />
            </div>
          </div>
        </form>
        <p className="center-text">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;