import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import config from '../config';
console.log(config); 

const apiUrl = config.apiUrl;

const LoginForm = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = {
        role,
        rollNo,
        password,
      };

      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      

      if (response.ok) {

        const cookieOptions = {
          path: '/',
          sameSite: 'None', 
          secure: true, 
        };
        document.cookie = `loggedIn=${rollNo}; ${Object.entries(cookieOptions).map(([value, key]) => `${key}=${value}`).join('; ')}`;

        if (role === 'Student') {
          navigate('/dashboards');
        } else if (role === 'Panel') {
          navigate('/dashboardt');
        } else if (role === 'Admin') {
          navigate('/dashboarda');
        } else if (role === 'Guide') {
          navigate('/dashboardg');
        }

        toast.success('Login successful!');
      } else {
        toast.error('Invalid email, password, or roll number');
      }
    } catch (error) {
      console.log('An error occurred during login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="login-container">
      <div className="left-half">
        <h2>Login</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="role">
              <i className="fas fa-user-tag"></i> Role:
            </label>
            <select name="role" id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="" disabled defaultValue>Select Role</option>
              <option value="Student">Student</option>
              <option value="Panel">Panel</option>
              <option value="Admin">Admin</option>
              <option value="Guide">Guide</option>
            </select>
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
            <button type="submit" className="form-button" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
        </form>
        <p className="center-text">
        
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginForm;