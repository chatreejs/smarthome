import { Flex, Typography } from 'antd';
import React from 'react';

import { HomeRequest } from '@models';

const { Title, Text } = Typography;

interface HomeSummaryProps {
  homeData: HomeRequest;
}

const HomeSummary: React.FC<HomeSummaryProps> = ({ homeData }) => {
  return (
    <Flex vertical justify="center">
      <Title level={3}>ยืนยันการตั้งค่าบ้านของคุณ</Title>
      <Text>ชื่อบ้าน: {homeData.name}</Text>
      <Text>ที่อยู่: {homeData.address}</Text>
      <Text>
        หากข้อมูลดังกล่าวถูกต้อง กรุณากดปุ่มบันทึก เพื่อเริ่มใช้งานระบบ
      </Text>
    </Flex>
  );
};

export default HomeSummary;
