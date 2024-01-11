import { App, Card, Form, Input, Typography } from 'antd';
import React, { useState } from 'react';

const { Title } = Typography;

const InventoryDetail: React.FC = () => {
  const { notification } = App.useApp();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  return (
    <>
      <Title level={2}></Title>
      <Card>
        <Form>
          <Form.Item label="Name">
            <Input />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default InventoryDetail;
