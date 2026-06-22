import { RootState } from '@config';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Form, Input, Typography } from 'antd';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const { Title } = Typography;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },

  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};

const tailLayout = {
  wrapperCol: { offset: 4, span: 16 },
};

const StyledCard = styled(Card)`
  margin-bottom: 1rem;
`;

const Setting: React.FC = () => {
  const home = useSelector((state: RootState) => state.home);
  const [homeConfigForm] = Form.useForm();

  useEffect(() => {
    homeConfigForm.setFieldsValue({
      name: home.name,
    });
  });

  return (
    <>
      <Title level={2}>ตั้งค่าบ้าน</Title>
      <StyledCard title="บ้าน">
        <Form {...formItemLayout} form={homeConfigForm} name="home-config-form">
          <Form.Item name="name" label="ชื่อบ้าน">
            <Input />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginTop: '2rem' }}
            >
              <FontAwesomeIcon icon={faFloppyDisk} />
              Save
            </Button>
          </Form.Item>
        </Form>
      </StyledCard>
    </>
  );
};

export default Setting;
