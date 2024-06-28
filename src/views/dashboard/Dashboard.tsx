import { Card, Col, Row, Typography } from 'antd';
import React, { useContext } from 'react';
import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const { tokenData } = useContext<IAuthContext>(AuthContext);

  return (
    <>
      <Title level={2}>
        ยินดีต้อนรับ {tokenData?.given_name} {tokenData?.family_name}
      </Title>
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
