import React, { useState } from 'react';
import DashboardNavbar from './DashboardNavbar';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CSS/Forms.css';
import config from '../../../config';
import {
  Layout,
  Typography,
  Form,
  Select,
  Switch,
  Button,
  Input,
  Card,
  Row,
  Col,
} from 'antd';

const { Content } = Layout;
const { Option } = Select;
const { Title, Paragraph } = Typography;

const apiUrl = config.apiUrl;

const Forms = () => {
  const [createForm, setCreateForm] = useState(false);
  const [selectedReviewType, setSelectedReviewType] = useState('First Review'); 
  const navigate = useNavigate();

  const handleCreateFormToggle = () => {
    setCreateForm(!createForm);
  };

  const handleReviewTypeChange = (value) => {
    setSelectedReviewType(value);
  };
  

  const handleFormSubmit = async (formData) => {
    formData.reviewType = selectedReviewType;

    try {
      const response = await fetch(`${apiUrl}/api/forms/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Form saved:', data);


      toast.success('Form created successfully!');

      setCreateForm(false);

      navigate('/evaluationt', { state: { formData } });
    } catch (error) {
      console.error('Error saving form:', error);

      toast.error('Failed to create form');
    }
  };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <DashboardNavbar>
        <Content style={{ padding: '24px' }}>
          <div className="dft">
            <Card title="Form Options" style={{ width: 400 }}>
              <Form layout="vertical">
                <Form.Item label="Select Review Type">
                  <Select
                    value={selectedReviewType}
                    onChange={handleReviewTypeChange}
                    disabled={createForm}
                  >
                    <Option value="">Select</Option>
                    <Option value="First">First Review</Option>
                    <Option value="Second">Second Review</Option>
                    <Option value="Third">Third Review</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Create New Form">
                  <Switch
                    checked={createForm}
                    onChange={handleCreateFormToggle}
                  />
                </Form.Item>
              </Form>
            </Card>
            {createForm ? (
              <FormBuilder onSubmit={handleFormSubmit} />
            ) : (
              <DataTable />
            )}
          </div>
        </Content>
       <ToastContainer />
      </DashboardNavbar>
    </Layout>
  );
};

const FormBuilder = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    formTitle: '',
    formParameters: [],
    overallTotalMarks: 0, 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleParameterChange = (index, parameterData) => {
    const updatedParameters = [...formData.formParameters];
    updatedParameters[index] = parameterData;
    setFormData((prevData) => ({ ...prevData, formParameters: updatedParameters }));

    const overallTotalMarks = updatedParameters.reduce(
      (total, parameter) => total + parameter.parameterTotalMarks,
      0
    );
    setFormData((prevData) => ({ ...prevData, overallTotalMarks }));
  };

  const handleAddParameter = () => {
    const newParameter = {
      parameterTitle: '',
      subParameters: [],
      parameterTotalMarks: 0,
    };
    setFormData((prevData) => ({
      ...prevData,
      formParameters: [...prevData.formParameters, newParameter],
    }));
  };

  const handleRemoveParameter = (index) => {
    const updatedParameters = [...formData.formParameters];
    updatedParameters.splice(index, 1);

    const overallTotalMarks = updatedParameters.reduce(
      (total, parameter) => total + parameter.parameterTotalMarks,
      0
    );

    setFormData((prevData) => ({
      ...prevData,
      formParameters: updatedParameters,
      overallTotalMarks,
    }));
  };

  const handleAddSubParameter = (index) => {
    const newSubParameter = {
      subParameterName: '',
      subParameterMaxMarks: '',
      subParameterGivenMarks: '',
    };
    const updatedParameters = [...formData.formParameters];
    updatedParameters[index].subParameters.push(newSubParameter);
    setFormData((prevData) => ({
      ...prevData,
      formParameters: updatedParameters,
    }));
  };

  const handleRemoveSubParameter = (parameterIndex, subParameterIndex) => {
    const updatedParameters = [...formData.formParameters];
    const updatedSubParameters = [...updatedParameters[parameterIndex].subParameters];
    updatedSubParameters.splice(subParameterIndex, 1);
    updatedParameters[parameterIndex].subParameters = updatedSubParameters;

    let totalMarks = 0;
    updatedSubParameters.forEach((subParameter) => {
      if (!isNaN(subParameter.subParameterMaxMarks)) {
        totalMarks += parseInt(subParameter.subParameterMaxMarks);
      }
    });

    updatedParameters[parameterIndex].parameterTotalMarks = totalMarks;

    const overallTotalMarks = updatedParameters.reduce(
      (total, parameter) => total + parameter.parameterTotalMarks,
      0
    );

    setFormData((prevData) => ({
      ...prevData,
      formParameters: updatedParameters,
      overallTotalMarks,
    }));
  };

  const handleSubParameterChange = (parameterIndex, subParameterIndex, subParameterData) => {
    const updatedParameters = [...formData.formParameters];
    const updatedSubParameters = [...updatedParameters[parameterIndex].subParameters];
    updatedSubParameters[subParameterIndex] = subParameterData;
    updatedParameters[parameterIndex].subParameters = updatedSubParameters;

    let totalMarks = 0;
    updatedSubParameters.forEach((subParameter) => {
      if (!isNaN(subParameter.subParameterMaxMarks)) {
        totalMarks += parseInt(subParameter.subParameterMaxMarks);
      }
    });

    updatedParameters[parameterIndex].parameterTotalMarks = totalMarks;

    const overallTotalMarks = updatedParameters.reduce(
      (total, parameter) => total + parameter.parameterTotalMarks,
      0
    );

    setFormData((prevData) => ({
      ...prevData,
      formParameters: updatedParameters,
      overallTotalMarks,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    onSubmit(formData);
  };

  return (
    <div className="form-buildertf">
      <h2>Evaluation Parameters</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="form-fieldtf">
          <label htmlFor="form-title-input">Form Title:</label>
          <input
            type="text"
            id="form-title-input"
            name="formTitle"
            value={formData.formTitle}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-columnst">
          <div className="form-columntf">
            <div className="form-headertf">Parameter Title</div>
            {formData.formParameters.map((parameter, index) => (
              <ParameterField
                key={index}
                index={index}
                parameter={parameter}
                onParameterChange={handleParameterChange}
                onAddSubParameter={handleAddSubParameter}
                onRemoveParameter={handleRemoveParameter}
                onSubParameterChange={handleSubParameterChange}
                onRemoveSubParameter={handleRemoveSubParameter}
              />
            ))}
          </div>
        </div>
        <div className="overall-total-marks-rowtf">
          <label htmlFor="overall-total-marks-input">Overall Total Marks:</label>
          <input
            type="number"
            id="overall-total-marks-input"
            name="overallTotalMarks"
            value={formData.overallTotalMarks || ''}
            readOnly 
          />
        </div>
        <button type="button" className="add-parameter-buttontf" onClick={handleAddParameter}>
          Add Parameter
        </button>
        <button type="submit" className="submit-buttontf">Submit</button>
      </form>
    </div>
  );
};

const ParameterField = ({ index, parameter, onParameterChange, onAddSubParameter, onRemoveParameter, onSubParameterChange, onRemoveSubParameter }) => {
  const handleParameterChange = (e) => {
    const { name, value } = e.target;
    onParameterChange(index, { ...parameter, [name]: value });
  };

  return (
    <div className="parameter-fieldtf">
      <div className="parameter-title-rowtf">
        <label htmlFor={`parameter-title-input-${index}`}>Parameter Title:</label>
        <input
          type="text"
          id={`parameter-title-input-${index}`}
          name="parameterTitle"
          value={parameter.parameterTitle}
          onChange={handleParameterChange}
        />
        <button type="button" className="remove-parameter-buttontf" onClick={() => onRemoveParameter(index)}>
          Remove Parameter
        </button>
      </div>
      {parameter.subParameters.map((subParameter, subIndex) => (
        <SubParameterField
          key={subIndex}
          parameterIndex={index}
          subParameterIndex={subIndex}
          subParameter={subParameter}
          onSubParameterChange={onSubParameterChange}
          onRemoveSubParameter={onRemoveSubParameter}
        />
      ))}
      <div className="total-marks-rowtf">
        <label htmlFor={`parameter-total-marks-input-${index}`}>Total Marks:</label>
        <input
          type="number"
          id={`parameter-total-marks-input-${index}`}
          name="parameterTotalMarks"
          value={parameter.parameterTotalMarks || ''}
          readOnly 
        />
      </div>
      <button type="button" className="add-sub-parameter-buttontf" onClick={() => onAddSubParameter(index)}>
        Add Sub Parameter
      </button>
    </div>
  );
};

const SubParameterField = ({ parameterIndex, subParameterIndex, subParameter, onSubParameterChange, onRemoveSubParameter }) => {
  const handleSubParameterChange = (e) => {
    const { name, value } = e.target;
    onSubParameterChange(parameterIndex, subParameterIndex, { ...subParameter, [name]: value });
  };

  return (
    <Form>
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item label={`Sub Parameter Name`}>
            <Input
              type="text"
              name="subParameterName"
              value={subParameter.subParameterName}
              onChange={handleSubParameterChange}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label={`Max Marks`}>
            <Input
              type="number"
              name="subParameterMaxMarks"
              value={subParameter.subParameterMaxMarks}
              onChange={handleSubParameterChange}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label={`Given Marks`}>
            <Input
              type="number"
              name="subParameterGivenMarks"
              value={subParameter.subParameterGivenMarks}
              onChange={handleSubParameterChange}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Button type="danger" onClick={() => onRemoveSubParameter(parameterIndex, subParameterIndex)}>
            Remove Sub Parameter
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

const DataTable = () => {
  // Render table with data fetched from the backend database
  return (
    <div className="data-table">
      <Title level={2}>Form Data Table Creation</Title>
      <Paragraph className="form-description">
        <strong>Create New Form:</strong> By toggling the "Create New Form" switch, users can start building a new evaluation form. When the switch is turned on, it reveals a dynamic form creation interface.
      </Paragraph>
      <Paragraph className="form-description">
        <strong>Add Parameters:</strong> Within the form creation interface, users can add multiple evaluation parameters. Each parameter consists of a "Parameter Title" field. Users can click the "Add Parameter" button to include additional parameters as needed.
      </Paragraph>
      <Paragraph className="form-description">
        <strong>Add Sub-Parameters:</strong> For each parameter, users can add sub-parameters, if required. Sub-parameters have attributes like "Sub Parameter Name," "Max Marks," and "Given Marks." Sub-parameters are useful for breaking down complex evaluation criteria into smaller components.
      </Paragraph>
      <Paragraph className="form-description">
        <strong>Overall Total Marks Calculation:</strong> The system automatically calculates and displays the overall total marks based on the sub-parameter input values. This ensures that users can see the total possible marks for the entire form.
      </Paragraph>
      <Paragraph className="form-description">
        <strong>Form Title:</strong> Users must provide a title for the form.
      </Paragraph>
    </div>
  );
};

export default Forms;
