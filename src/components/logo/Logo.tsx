import React from 'react';
import styled from 'styled-components';

import './Logo.css';

interface LogoProps {
  systemName: string;
}

const LogoWrapper = styled.div`
  height: 40px;
  margin: 12px 16px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  user-select: none;
`;

const EnvBadge = styled.div`
  background: #fa3e3e;
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: 8px;
  align-self: flex-start;
`;

const Logo: React.FC<LogoProps> = ({ systemName }) => {
  const env = process.env.VITE_APP_ENV ?? 'local';
  const isProduction = env === 'production';

  const getEnvironmentText = (env: string) => {
    switch (env) {
      case 'local':
        return 'LOCAL';
      case 'develop':
        return 'DEV';
      case 'staging':
        return 'STAGE';
      default:
        return '';
    }
  };

  return (
    <LogoWrapper>
      <p className="logo">{systemName.toUpperCase()}</p>
      {!isProduction && <EnvBadge>{getEnvironmentText(env)}</EnvBadge>}
    </LogoWrapper>
  );
};

export default Logo;
