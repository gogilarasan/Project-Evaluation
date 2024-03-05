import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import './CSS/View.css'; // Import your CSS file for styling
import config from '../../../config';

const apiUrl = config.apiUrl;

const View = () => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [guideCount, setGuideCount] = useState(0);

  useEffect(() => {
    fetchRoleCounts(); // Fetch role counts when component mounts

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/admin/getUsersByRole/${selectedRole}`, {
          headers: {},
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setFilteredUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [selectedRole]);

  const fetchRoleCounts = async () => {
    try {
      const response = await fetch(`${apiUrl}/admin/getRoleCounts`, {
        headers: {},
        credentials: 'include',
      });

      if (response.ok) {
        const counts = await response.json();
        setStudentCount(counts.studentCount);
        setTeacherCount(counts.teacherCount);
        setGuideCount(counts.guideCount);
      }
    } catch (error) {
      console.error('Error fetching role counts:', error);
    }
  };

  const handleRoleFilterChange = (event) => {
    setSelectedRole(event.target.value);
  };

  return (
    <div className="view-container">
      <DashboardNavbar>
      <div className="view-content">
      <h2>User Details</h2>
      <div className="role-counts">
          <div className="role-count">
            <div className="role-logo-container">
              <i className="fas fa-user-graduate role-logo student-logo"></i>
              <div className="count"><p>Students</p>{studentCount}</div>
            </div>
          </div>
          <div className="role-count">
            <div className="role-logo-container">
              <i className="fas fa-chalkboard-teacher role-logo teacher-logo"></i>
              <div className="count"><p>Panel</p>{teacherCount}</div>
            </div>
          </div>
          <div className="role-count">
            <div className="role-logo-container">
              <i className="fas fa-compass role-logo guide-logo"></i>
              <div className="count"><p>Guide</p>{guideCount}</div>
            </div>
          </div>
        </div>
        <div className="filter-container">
          <label htmlFor="roleFilter">Filter by Role:</label>
          <select id="roleFilter" value={selectedRole} onChange={handleRoleFilterChange}>
            <option value="">All</option>
            <option value="Student">Student</option>
            <option value="Panel">Panel</option>
            <option value="Guide">Guide</option>
          </select>
        </div>
        <div className="table-container">
          {filteredUsers.length > 0 ? (
            <table className="user-table">
              <thead>
                <tr>
                  <th className="table-header">First Name</th>
                  <th className="table-header">Last Name</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Role</th>
                  <th className="table-header">University</th>
                  <th className="table-header">Department</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="table-row">
                    <td className="table-data">{user.firstName}</td>
                    <td className="table-data">{user.lastName}</td>
                    <td className="table-data">{user.email}</td>
                    <td className="table-data">{user.role}</td>
                    <td className="table-data">{user.university}</td>
                    <td className="table-data">{user.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No users found for the selected role.</p>
          )}
        </div>
        <div className="additional-content">
          <h3>Provider</h3>
          <p>
            Welcome to the User Details page. This page allows you to filter and view user information
            based on their roles. Use the dropdown menu above to select a role and see the corresponding users.
          </p>
        </div>
      </div>
      </DashboardNavbar>
    </div>
  );
};

export default View;
