import { Form, Input } from 'antd';
import { FormInstance } from 'antd/lib';
import React from 'react';

const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
    md: { span: 6 },
  },

  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    md: { span: 14 },
  },
};

interface HomeConfigFormProps {
  form: FormInstance;
}

const HomeConfigForm: React.FC<HomeConfigFormProps> = ({ form }) => {
  return (
    <>
      <Form {...formItemLayout} form={form} name="home-config-form">
        <Form.Item name="name" label="ชื่อบ้าน" rules={[{ required: true }]}>
          <Input size="large" data-testid="name-input" />
        </Form.Item>
        <Form.Item name="address" label="ที่อยู่" rules={[{ required: true }]}>
          <TextArea rows={3} data-testid="address-input" />
        </Form.Item>
      </Form>
    </>
  );
};

export default HomeConfigForm;
