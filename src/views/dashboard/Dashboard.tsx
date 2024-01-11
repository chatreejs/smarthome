import { Card, Col, Row, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';

import { AuthContext } from '@context';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [data, setData] = useState([]);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    // random data
    const temp = data;
    temp.push({ x: 1, y: 2 });
    setData(temp);
  }, []);

  return (
    <>
      <Title level={2}>ยินดีต้อนรับ {authContext.userProfile.firstName}</Title>
      <Row gutter={[8, 8]}>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Card>
            <h4>55</h4>
            <span>PM 2.5</span>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
