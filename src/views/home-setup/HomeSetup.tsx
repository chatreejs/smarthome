import { Button, Flex, Form, Steps, theme, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { AuthContext } from '@context';
import { useBrowserStorage } from '@hooks';
import { HomeRequest } from '@models';
import { HomeService } from '@services';
import HomeConfigForm from './components/HomeConfigForm';
import HomeSummary from './components/HomeSummary';

const { Title, Text } = Typography;

const HomeSetupWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #0093e9;
  background-image: linear-gradient(160deg, #0093e9 0%, #80d0c7 100%);
`;

const StepWrapper = styled.div`
  width: 100%;
  padding: 40px;
  margin: 0 12px;
  background-color: #fff;
  border-radius: 16px;
`;

const HomeSetup: React.FC = () => {
  const authContext = useContext(AuthContext);
  const { token } = theme.useToken();
  const [isHasHome, setIsHasHome] = useBrowserStorage(
    'sh-hashome',
    null,
    'local',
  );
  const [homeId, setHomeId] = useBrowserStorage(
    'sh-current-homeid',
    null,
    'local',
  );
  const navigate = useNavigate();
  const [homeConfigForm] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [homeData, setHomeData] = useState<HomeRequest>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isHasHome) {
      navigate('/');
    } else {
      setIsHasHome(false);
    }
  }, [isHasHome]);

  const next = async () => {
    if (current === 0) {
      try {
        await homeConfigForm.validateFields();
        setHomeData(homeConfigForm.getFieldsValue());
        setCurrent(current + 1);
      } catch (error) {}
    } else {
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const saveHome = () => {
    setLoading(true);
    HomeService.createHome(homeData).subscribe({
      next: (home) => {
        setLoading(false);
        setHomeId(home.id);
        setIsHasHome(true);
      },
      error: (error) => {
        setLoading(false);
      },
    });
  };

  const steps = [
    {
      title: 'ตั้งค่าบ้าน',
      content: <HomeConfigForm form={homeConfigForm} />,
    },
    {
      title: 'ระบบภายในบ้าน',
      content: 'Second-content',
    },
    {
      title: 'สิ้นสุด',
      content: <HomeSummary homeData={homeData} />,
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
    padding: '24px 16px 0 16px',
  };

  return (
    <HomeSetupWrapper>
      <Flex vertical justify="center" style={{ height: '100%' }}>
        <Title level={2} style={{ alignSelf: 'center', color: 'white' }}>
          ยินดีต้อนรับคุณ {authContext.userProfile.username}
        </Title>
        <Text style={{ alignSelf: 'center', fontSize: 18, color: 'white' }}>
          เพื่อเข้าใช้งานระบบ กรุณาตั้งค่าบ้านของคุณให้เรียบร้อย
        </Text>
        <Flex justify="center">
          <StepWrapper>
            <Steps current={current} items={items} />
            <div style={contentStyle}>{steps[current].content}</div>
            <div style={{ marginTop: 24 }}>
              {current < steps.length - 1 && (
                <Button type="primary" onClick={() => next()}>
                  ถัดไป
                </Button>
              )}
              {current === steps.length - 1 && (
                <Button
                  type="primary"
                  loading={loading}
                  onClick={() => saveHome()}
                >
                  บันทึก
                </Button>
              )}
              {current > 0 && (
                <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                  ย้อนกลับ
                </Button>
              )}
            </div>
          </StepWrapper>
        </Flex>
      </Flex>
    </HomeSetupWrapper>
  );
};

export default HomeSetup;
