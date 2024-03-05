import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Switch, Avatar } from 'antd';
import {
  TeamOutlined,
  HomeOutlined,
  UserOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  CalendarOutlined,
  FormOutlined,
  FileDoneOutlined,
  ScheduleOutlined,
  BarChartOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';

import '../CSS/DashboardNavbar.css'; 
import { LayoutContainer } from './Style';

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
    document.cookie = 'loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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
                key="/dashboardt"
                icon={<HomeOutlined style={getIconStyle()} />}
                style={getMenuItemStyle(location.pathname === '/dashboardt')}
              >
                <Link to="/dashboardt">Dashboard</Link>
              </Menu.Item>
              <Menu.Item
                key="/userst"
                icon={<UserOutlined style={getIconStyle()} />}
                style={getMenuItemStyle(location.pathname === '/userst')}
              >
                <Link to="/userst">Profile</Link>
              </Menu.Item>
              <Menu.Item
                key="/studentst"
                icon={<TeamOutlined style={getIconStyle()} />}
                style={getMenuItemStyle(location.pathname === '/studentst')}
              >
                <Link to="/studentst">Students</Link>
              </Menu.Item>
              <Menu.Item
                key="/formt"
                icon={<FormOutlined style={getIconStyle()} />}
                style={getMenuItemStyle(location.pathname === '/formt')}
              >
                <Link to="/formt">Form</Link>
              </Menu.Item>
              <Menu.Item
                key="/event"
                icon={<ScheduleOutlined style={getIconStyle()} />}
                style={getMenuItemStyle(location.pathname === '/event')}
              >
                <Link to="/event">Event</Link>
              </Menu.Item>
              <Menu.Item
                key="/calendart"
                icon={<CalendarOutlined style={getIconStyle()} />}
                style={getMenuItemStyle(location.pathname === '/calendart')}
              >
                <Link to="/calendart">Calendar</Link>
              </Menu.Item>
              <Menu.Item
                key="/messagest"
                icon={<FileTextOutlined style={getIconStyle()} />}
                style={getMenuItemStyle(location.pathname === '/messagest')}
              >
                <Link to="/messagest">Details</Link>
              </Menu.Item>
              <Menu.Item
                key="/evaluationt"
                icon={<FolderOpenOutlined style={getIconStyle()} />}
                style={getMenuItemStyle(location.pathname === '/evaluationt')}
              >
                <Link to="/evaluationt">Evaluation</Link>
              </Menu.Item>
              <Menu.Item
                key="/resultst"
                icon={<FileDoneOutlined style={getIconStyle()} />}
                style={getMenuItemStyle(location.pathname === '/resultst')}
              >
                <Link to="/resultst">Result</Link>
              </Menu.Item>
              <Menu.Item
                key="/analyticst"
                icon={<BarChartOutlined style={getIconStyle()} />}
                style={getMenuItemStyle(location.pathname === '/analyticst')}
              >
                <Link to="/analyticst">Analytics</Link>
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
