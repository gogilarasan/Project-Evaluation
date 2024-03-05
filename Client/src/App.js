import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginForm from './pages/Login';
import SignUp from './pages/SignUp';
import Aboutus from './pages/Aboutus';

import Dashboard from './pages/Dashboard/Teachers/Dashboard';
import Documents from './pages/Dashboard/Teachers/Documents';
import Users from './pages/Dashboard/Teachers/Users';
import Students from './pages/Dashboard/Teachers/Students';
import Details from './pages/Dashboard/Teachers/Details';
import Evaluation from './pages/Dashboard/Teachers/Evaluation';
import Charts from './pages/Dashboard/Teachers/Charts';
import Calendar from './pages/Dashboard/Teachers/Calendar';
import Forms from './pages/Dashboard/Teachers/Forms';
import Analytics from './pages/Dashboard/Teachers/Analytics';
import EventT from './pages/Dashboard/Teachers/Event';
import ResultT from './pages/Dashboard/Teachers/Result';
import ProgresT from './pages/Dashboard/Teachers/Progress';

import DashboardS from './pages/Dashboard/Students/Dashboard';
import UsersS from './pages/Dashboard/Students/Users';
import DetailsS from './pages/Dashboard/Students/Details';
import ContactS from './pages/Dashboard/Students/Contact';
import DocumentsS from './pages/Dashboard/Students/Documents';
import FormS from './pages/Dashboard/Students/Forms';
import CalendarS from './pages/Dashboard/Students/Calendar';
import Result from './pages/Dashboard/Students/Result';

import DashboardG from './pages/Dashboard/Guide/Dashboard';
import UsersG from './pages/Dashboard/Guide/Users';
import CalendarG from './pages/Dashboard/Guide/Calendar';
import Studentg from './pages/Dashboard/Guide/Students';
import Mail from './pages/Dashboard/Guide/Mail';
import Eval from './pages/Dashboard/Guide/Evaluation';
import Report from './pages/Dashboard/Guide/Report';
import EventG from './pages/Dashboard/Guide/Event';
import Manage from './pages/Dashboard/Admin/Manage';
import DashboardA from './pages/Dashboard/Admin/Dashboard';
import UsersA from './pages/Dashboard/Admin/Users';
import View from './pages/Dashboard/Admin/View';
import CalendarA from './pages/Dashboard/Admin/Calendar';

import './App.css';

const HomePage = () => {
  return (
    
        <Home/>
    
  );
};

const SignUpPage = () => {
  return (
    
      
      <SignUp />
   
  );
};

const LoginPage = () => {
  return (
    
      
      <LoginForm /> 
    
  );
};

const AboutusPage = () => {
  return (
    
      <Aboutus />
   
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>

        {/*Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/aboutus" element={<AboutusPage />} />

        {/*Teachers */}
        <Route path="/dashboardt" element={<Dashboard />} />
        <Route path="/userst" element={<Users />} />
        <Route path="/documentst" element={<Documents />} />
        <Route path="/analyticst" element={<Analytics />} />
        <Route path="/calendart" element={<Calendar />} />
        <Route path="/chartst" element={<Charts />} />
        <Route path="/evaluationt" element={<Evaluation />} />
        <Route path="/messagest" element={<Details />} />
        <Route path="/studentst" element={<Students />} />
        <Route path="/formt" element={<Forms />} />
        <Route path="/event" element={<EventT />} />
        <Route path="/resultst" element={<ResultT />} />
        <Route path="/progresst" element={<ProgresT />} />

        {/*Students */}
        <Route path="/dashboards" element={<DashboardS />} />
        <Route path="/users" element={<UsersS />} />
        <Route path="/contacts" element={<ContactS />} />
        <Route path="/messages" element={<DetailsS />} />
        <Route path="/forms" element={<FormS />} />
        <Route path="/calendars" element={<CalendarS />} />
        <Route path="/documents" element={<DocumentsS />} />
        <Route path="/result" element={<Result />} />

        {/*Admins */}
        <Route path="/dashboarda" element={<DashboardA />} />
        <Route path="/usersa" element={<UsersA />} />
        <Route path="/manage" element={<Manage />} />
        <Route path="/view" element={<View />} />
        <Route path="/calendara" element={<CalendarA />} />

        {/*Guides */}
        <Route path="/dashboardg" element={<DashboardG />} />
        <Route path="/usersg" element={<UsersG />} />
        <Route path="/calendarg" element={<CalendarG />} />
        <Route path="/studentg" element={<Studentg />} />
        <Route path="/mailg" element={<Mail />} />
        <Route path="/evalg" element={<Eval />} />
        <Route path="/reportg" element={<Report />} />
        <Route path="/eventg" element={<EventG />} />

      </Routes>
    </Router>
  );
}

export default App;
