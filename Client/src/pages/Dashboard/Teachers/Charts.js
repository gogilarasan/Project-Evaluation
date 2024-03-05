import React from 'react';
import DashboardNavbar from './DashboardNavbar';
import { Pie, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns'; // Import the chartjs-adapter-date-fns package
import 'chart.js/auto';

const Charts = () => {
  // Sample data for overall student performance (replace with real data)
  const overallStudentData = {
    labels: ['Student A', 'Student B', 'Student C', 'Student D'],
    datasets: [
      {
        label: 'Overall Student Performance',
        data: [80, 90, 75, 85],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40'],
      },
    ],
  };

  // Sample data for individual student performance (replace with real data)
  const individualStudentData = {
    labels: ['Exam 1', 'Exam 2', 'Exam 3', 'Exam 4'],
    datasets: [
      {
        label: 'Student A',
        data: [90, 85, 92, 88],
        backgroundColor: '#FF6384',
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <DashboardNavbar>
      <div className="dashboard-content">
        <h2>Overall Student Performance (Pie Chart)</h2>
        <Pie data={overallStudentData} />

        <h2>Individual Student Performance (Bar Chart)</h2>
        <Bar data={individualStudentData} />
      </div>
      </DashboardNavbar>
    </div>
  );
};

export default Charts;
