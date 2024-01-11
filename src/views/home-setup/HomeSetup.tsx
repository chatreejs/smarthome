import { Button, Steps, theme } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useLocalStorage } from '@hooks';

const steps = [
  {
    title: 'ตั้งค่าบ้าน',
    content: <div>Hello</div>,
  },
  {
    title: 'ระบบภายในบ้าน',
    content: 'Second-content',
  },
  {
    title: 'สิ้นสุด',
    content: 'Last-content',
  },
];

const HomeSetupWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: #0093e9;
  background-image: linear-gradient(160deg, #0093e9 0%, #80d0c7 100%);
`;

const StepWrapper = styled.div`
  padding: 40px;
  width: 100%;
  max-width: 900px;
  background-color: #fff;
  border-radius: 16px;

  @media (max-width: 768px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const HomeSetup: React.FC = () => {
  const { token } = theme.useToken();
  const [isHasHome, setIsHasHome] = useLocalStorage('sh-hashome', false);
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (isHasHome) {
      navigate('/');
    } else {
      setIsHasHome(false);
    }
  }, [isHasHome]);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    lineHeight: '260px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  return (
    <HomeSetupWrapper>
      <StepWrapper>
        <Steps current={current} items={items} />
        <div style={contentStyle}>{steps[current].content}</div>
        <div style={{ marginTop: 24 }}>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => setIsHasHome(true)}>
              Done
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              Previous
            </Button>
          )}
        </div>
      </StepWrapper>
    </HomeSetupWrapper>
  );
};

export default HomeSetup;
