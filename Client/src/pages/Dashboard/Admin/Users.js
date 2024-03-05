import React, { useState, useEffect, useCallback } from 'react';
import DashboardNavbar from './DashboardNavbar';
import 'react-toastify/dist/ReactToastify.css';
import './CSS/User.css';
import config from '../../../config';
import {
  Input,
  Button,
  Card,
  Spin,
  Form,
  Space,
  Typography,
  Row,
  Col,
  Avatar,
  Menu,
  message,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  CloseOutlined,
  SaveOutlined,
  ProfileOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { getCookie } from './cookie';

const apiUrl = config.apiUrl;
const { Meta } = Card;
const { Title, Text } = Typography;

const Users = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [selectedMenu, setSelectedMenu] = useState('profile');

  const fetchUser = useCallback(async () => {
    try {
      console.log("Fetching user data...");
      const rollNo = getCookie('loggedIn');

      const response = await fetch(`${apiUrl}/api/currentuser?rollNo=${rollNo}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        console.log("User data fetched successfully.");
        const data = await response.json();
        console.log("Fetched user data:", data);
        setUser(data);
        setEditedUser(data);
        setLoading(false);
      } else {
        console.log('Failed to fetch user data:', response.status, response.statusText);
        setError('Failed to fetch user data');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('An error occurred while fetching user data');
      setLoading(false);
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const saveChanges = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/updateuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editedUser),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setEditMode(false);
      } else {
        console.log('Failed to update user data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditedUser(user);
    setEditMode(false);
  };

  const handleSavePassword = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/changepassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          oldPassword: form.getFieldValue('oldPassword'),
          newPassword: form.getFieldValue('newPassword'),
        }),
      });

      if (response.ok) {
        form.resetFields(['oldPassword', 'newPassword']);
        message.success('Password changed successfully');
      } else {
        console.log('Failed to change password:', response.status, response.statusText);
        message.error('Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      message.error('An error occurred while changing password');
    }
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const labelColProps = {
    flex: '0 0 25%',
    style: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginRight: '8px', 
      textAlign: 'left', 
    },
  };

  /*const valueColProps = {
    flex: '0 0 75%',
    style: {
      fontSize: '16px',
      marginBottom: '12px',
    },
  };*/

  return (
    <div className="us">
      <DashboardNavbar>
        <div className="us1">
          <Row gutter={0}>
            <Col xxl={6} lg={8} md={10} xs={24}>
              <Menu
                mode="vertical"
                theme="light"
                inlineIndent={24}
                style={{ width: '100%', height: '100%', borderRight: 'none' }}
                defaultSelectedKeys={['profile']}
                selectedKeys={[selectedMenu]}
                onClick={({ key }) => setSelectedMenu(key)}
              >
                <div className="user-container">
                  <Avatar size={100} icon={<UserOutlined />} className="user-avatar" />
                  <div className="user-details">
                    <Title level={4} className="user-name">
                      {user?.firstName} {user?.lastName}
                    </Title>
                    <Text className="user-role">Role: {user?.role}</Text>
                  </div>
                </div>
                <Menu.Item key="profile" icon={<ProfileOutlined />} className="custom-menu-item">
                  Profile
                </Menu.Item>
                <Menu.Item key="password" icon={<LockOutlined />} className="custom-menu-item">
                  Password
                </Menu.Item>
              </Menu>
            </Col>
            <Col xxl={18} lg={16} md={14} xs={24}>
              {loading ? (
                <div className="loading-container">
                  <Spin size="large" />
                </div>
              ) : error ? (
                <h2>Error: {error}</h2>
              ) : (
                <div className="profile-container">
                  <Card className="profile-card">
                    {selectedMenu === 'profile' && (
                      <Meta
                        description={
                          <Form form={form} onFinish={saveChanges} layout="vertical">
                            <Row gutter={16}>
                              <Col span={12}>
                                <Form.Item
                                  label="First Name"
                                  name="firstName"
                                  initialValue={user.firstName}
                                  labelCol={labelColProps}
                                >
                                  {editMode ? (
                                    <Input name="firstName" value={editedUser.firstName} onChange={handleInputChange} />
                                  ) : (
                                    <Input name="firstName" value={user.firstName} readOnly />
                                  )}
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item
                                  label="Last Name"
                                  name="lastName"
                                  initialValue={user.lastName}
                                  labelCol={labelColProps}
                                >
                                  {editMode ? (
                                    <Input name="lastName" value={editedUser.lastName} onChange={handleInputChange} />
                                  ) : (
                                    <Input name="lastName" value={user.lastName} readOnly />
                                  )}
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row gutter={16}>
                              <Col span={12}>
                                <Form.Item
                                  label="Roll No"
                                  name="rollNo"
                                  initialValue={user.rollNo}
                                  labelCol={labelColProps}
                                >
                                  {editMode ? (
                                    <Input name="rollNo" value={editedUser.rollNo} onChange={handleInputChange} />
                                  ) : (
                                    <Input name="rollNo" value={user.rollNo} readOnly />
                                  )}
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item label="Email" labelCol={labelColProps}>
                                  <Input name="email" value={user.email} readOnly />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row gutter={16}>
                              <Col span={12}>
                                <Form.Item
                                  label="Phone Number"
                                  name="phoneNumber"
                                  initialValue={user.phoneNumber}
                                  labelCol={labelColProps}
                                >
                                  {editMode ? (
                                    <Input name="phoneNumber" value={editedUser.phoneNumber} onChange={handleInputChange} />
                                  ) : (
                                    <Input name="phoneNumber" value={user.phoneNumber} readOnly />
                                  )}
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item label="Role" labelCol={labelColProps}>
                                  <Input name="role" value={user.role} readOnly />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row gutter={16}>
                              <Col span={12}>
                                <Form.Item label="University" labelCol={labelColProps}>
                                  <Input name="university" value={user.university} readOnly />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item
                                  label="Department"
                                  name="department"
                                  initialValue={user.department}
                                  labelCol={labelColProps}
                                >
                                  {editMode ? (
                                    <Input name="department" value={editedUser.department} onChange={handleInputChange} />
                                  ) : (
                                    <Input name="department" value={user.department} readOnly />
                                  )}
                                </Form.Item>
                              </Col>
                            </Row>
                            <Form.Item>
                              {editMode ? (
                                <Space>
                                  <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
                                    Save
                                  </Button>
                                  <Button icon={<CloseOutlined />} onClick={handleCancelClick}>
                                    Cancel
                                  </Button>
                                </Space>
                              ) : (
                                <Button type="primary" icon={<EditOutlined />} onClick={handleEditClick}>
                                  Edit
                                </Button>
                              )}
                            </Form.Item>
                          </Form>
                        }
                      />
                    )}

                    {selectedMenu === 'password' && (
                      <Meta
                        description={
                          <Form form={form} onFinish={handleSavePassword} layout="vertical">
                            <Row gutter={16}>
                              <Col span={24}>
                                <Form.Item
                                  label="Old Password"
                                  name="oldPassword"
                                  labelCol={labelColProps}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Please enter your old password',
                                    },
                                  ]}
                                >
                                  <Input.Password name="oldPassword" />
                                </Form.Item>
                              </Col>
                              <Col span={24}>
                                <Form.Item
                                  label="New Password"
                                  name="newPassword"
                                  labelCol={labelColProps}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Please enter your new password',
                                    },
                                    {
                                      min: 5,
                                      message: 'Password must be at least 5 characters long',
                                    },
                                  ]}
                                >
                                  <Input.Password name="newPassword" />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Form.Item>
                              {editMode ? (
                                <Space>
                                  <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
                                    Save Changes
                                  </Button>
                                  <Button icon={<CloseOutlined />} onClick={handleCancelClick}>
                                    Cancel
                                  </Button>
                                </Space>
                              ) : (
                                <Button type="primary" icon={<EditOutlined />} onClick={handleEditClick}>
                                  Change Password
                                </Button>
                              )}
                            </Form.Item>
                          </Form>
                        }
                      />
                    )}
                  </Card>
                </div>
              )}
            </Col>
          </Row>
        </div>
      </DashboardNavbar>
    </div>
  );
};

export default Users;
