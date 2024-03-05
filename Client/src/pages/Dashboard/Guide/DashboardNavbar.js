import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Switch, Avatar } from 'antd';
import {
  TeamOutlined,
  HomeOutlined,
  UserOutlined,
  FolderOpenOutlined,
  CalendarOutlined,
  FileDoneOutlined,
  ScheduleOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';

import '../CSS/DashboardNavbar.css'; 

import { LayoutContainer } from './Style';

;
const { Sider } = Layout;

const DashboardNavbar = ({ children }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedCollapsedState = localStorage.getItem('collapsed');
    if (storedCollapsedState === 'true') {
      setCollapsed(true);
    }

    const storedDarkModeState = localStorage.getItem('darkMode');
    if (storedDarkModeState === 'true') {
      setDarkMode(true);
    }
  }, []);

  const toggleCollapsed = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    localStorage.setItem('collapsed', newCollapsedState);
  };

  const toggleDarkLightMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  const getTopMenuStyle = () => {
    return darkMode ? { background: '#001529' } : { background: '#1890ff' };
  };

  const getIconStyle = () => {
    return darkMode ? { color: 'white' } : { color: 'black' };
  };

  const getMenuItemStyle = (selected) => {
    if (darkMode) {
      return selected
        ? { background: '#1890ff', color: 'white' }
        : { background: '#001529', color: 'white' };
    } else {
      return selected
        ? { background: '#1890ff', color: 'white' }
        : { background: 'white', color: 'black' };
    }
  };

  const handleLogout = () => {
    // Replace 'yourCookieName' with the actual name of the cookie you want to delete
    document.cookie = 'loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Redirect to the desired URL after clearing the cookie
    window.location.href = '/';
  };

  return (
    <LayoutContainer>
      <Layout style={{ minHeight: '100vh' }}>
        <Layout.Header className="top-menu-bar" style={getTopMenuStyle()}>
          <div className="top-menu-left">
            <Button
              className="menu-toggle-button"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
            />
          </div>
          <div className="top-menu-right">
            <Switch
              className="dark-light-toggle"
              checked={darkMode}
              onChange={toggleDarkLightMode}
              checkedChildren="Dark"
              unCheckedChildren="Light"
            />
            <Avatar icon={<UserOutlined />} />
            <Button icon={<LogoutOutlined />} onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        </Layout.Header>

        <Layout>
          <Sider
            width={200}
            theme={darkMode ? 'dark' : 'light'}
            collapsed={collapsed}
            collapsible
            onCollapse={toggleCollapsed}
          >
            <Menu
              mode="vertical"
              selectedKeys={[location.pathname]}
              className="left-navbar"
              style={darkMode ? { background: '#001529' } : { background: 'white' }}
            >
              <Menu.Item
                key="/dashboardg"
                icon={<HomeOutlined style={getIconStyle()} />}
                style={getMenuItemStyle(location.pathname === '/dashboardg')}
              >
                <Link to="/dashboardg">Dashboard</Link>
              </Menu.Item>
              <Menu.Item
                key="/usersg"
                icon={<UserOutlined style={getIconStyle()} />}
                style={getMenuItemStyle(location.pathname === '/usersg')}
              >
                <Link to="/usersg">Profile</Link>
              </Menu.Item>
              <Menu.Item
                key="/studentg"
                icon={<TeamOutlined style={getIconStyle()} />}
                style={getMenuItemStyle(location.pathname === '/studentg')}
              >
                <Link to="/studentg">Students</Link>
              </Menu.Item>
              <Menu.Item
                key="/evalg"
                icon={<FolderOpenOutlined style={getIconStyle()} />}
                style={getMenuItemStyle(location.pathname === '/evalg')}
              >
                <Link to="/evalg">Evaluation</Link>
              </Menu.Item>
              <Menu.Item
                key="/eventg"
                icon={<ScheduleOutlined style={getIconStyle()} />}
                style={getMenuItemStyle(location.pathname === '/eventg')}
              >
                <Link to="/eventg">Event</Link>
              </Menu.Item>
              <Menu.Item
                key="/calendarg"
                icon={<CalendarOutlined style={getIconStyle()} />}
                style={getMenuItemStyle(location.pathname === '/calendarg')}
              >
                <Link to="/calendarg">Calendar</Link>
              </Menu.Item>
              <Menu.Item
                key="/reportg"
                icon={<FileDoneOutlined style={getIconStyle()} />}
                style={getMenuItemStyle(location.pathname === '/reportg')}
              >
                <Link to="/reportg">Report</Link>
              </Menu.Item>
              <Menu.Item
                key="/mailg"
                icon={<FileDoneOutlined style={getIconStyle()} />}
                style={getMenuItemStyle(location.pathname === '/mailg')}
              >
                <Link to="/mailg">Mail</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout.Content className="c-container">{children}</Layout.Content>
        </Layout>
      </Layout>
    </LayoutContainer>
  );
};

export default DashboardNavbar;
