import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardNavbar from './DashboardNavbar';
import { Form, Input, Button, InputNumber } from 'antd';
import config from '../../../config';
import './CSS/Forms.css';
const apiUrl = config.apiUrl;

const Forms = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const response = await fetch(`${apiUrl}/api/formproject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        form.resetFields(); // Reset the form
        toast.success('Form submitted successfully');
      } else {
        console.error('Project submission failed:', data.error);
        toast.error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      toast.error('Error submitting form');
    }
  };

  return (
    <div className="df">
      <DashboardNavbar>
        <div className="dfc">
          <div className="logo-containers"></div>
          <h2>Project Submission Form</h2>
          <Form
            form={form}
            onFinish={onFinish}
            className="project-form"
            initialValues={{
              teamMember2: null,
              teamMember3: null,
            }}
            size="large" 
          >
            <Form.Item
              name="studentName"
              label="Student Name:"
              rules={[
                {
                  required: true,
                  message: 'Please enter student name',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="rollNumber"
              label="Roll Number:"
              rules={[
                {
                  required: true,
                  message: 'Please enter roll number',
                },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="teamMember1"
              label="Team Member 1:"
              rules={[
                {
                  required: true,
                  message: 'Please enter team member 1',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="teamMember1RollNumber"
              label="Team Member 1 Roll Number:"
              rules={[
                {
                  required: true,
                  message: 'Please enter team member 1 roll number',
                },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="teamMember2"
              label="Team Member 2:"
              rules={[
                {
                  required: true,
                  message: 'Please enter team member 2',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="teamMember2RollNumber"
              label="Team Member 2 Roll Number:"
              rules={[
                {
                  required: true,
                  message: 'Please enter team member 2 roll number',
                },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="teamMember3"
              label="Team Member 3:"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="teamMember3RollNumber"
              label="Team Member 3 Roll Number:"
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="projectTitle"
              label="Project Title:"
              rules={[
                {
                  required: true,
                  message: 'Please enter project title',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description:"
              rules={[
                {
                  required: true,
                  message: 'Please enter project description',
                },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="guideName"
              label="Guide Name:"
              rules={[
                {
                  required: true,
                  message: 'Please enter guide name',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="guideDepartment"
              label="Guide Department:"
              rules={[
                {
                  required: true,
                  message: 'Please enter guide department',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="guideMobile"
              label="Guide Mobile Number:"
              rules={[
                {
                  required: true,
                  message: 'Please enter guide mobile number',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="guideEmail"
              label="Guide Email:"
              rules={[
                {
                  required: true,
                  message: 'Please enter guide email',
                },
                {
                  type: 'email',
                  message: 'Invalid email address',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="guideRollNumber"
              label="Guide Roll Number:"
              rules={[
                {
                  required: true,
                  message: 'Please enter guide roll number',
                },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="submit-btns">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
        <ToastContainer />
      </DashboardNavbar>
    </div>
  );
};

export default Forms;
