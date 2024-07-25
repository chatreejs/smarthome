import { Card, Col, Row, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const { tokenData } = useContext<IAuthContext>(AuthContext);
  const [fullName, setFullName] = useState<string>('');

  useEffect(() => {
    const firstName = tokenData?.given_name;
    const lastName = tokenData?.family_name;

    if (firstName && lastName) {
      // Capitalize the first letter of the first name and last name.
      const firstNameCapitalized =
        firstName.charAt(0).toUpperCase() + firstName.slice(1);
      const lastNameCapitalized =
        lastName.charAt(0).toUpperCase() + lastName.slice(1);

      setFullName(`${firstNameCapitalized} ${lastNameCapitalized}`);
    }
  }, [tokenData]);

  return (
    <>
      <Title level={2}>ยินดีต้อนรับ {fullName}</Title>
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
