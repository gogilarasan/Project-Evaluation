import React from 'react';
import DashboardNavbar from './DashboardNavbar';

const DashboardWrapper = ({ children }) => {
  return (
    <>
      <DashboardNavbar />
      <div className="dashboard-content">{children}</div>
    </>
  );
};

export default DashboardWrapper;
