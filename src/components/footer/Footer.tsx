import { Layout } from 'antd';
import React from 'react';

interface FooterProps {
  githubUrl: string;
  githubUsername: string;
}

const Footer: React.FC<FooterProps> = (props) => {
  return (
    <Layout.Footer
      style={{ textAlign: 'center', backgroundColor: 'rgb(250, 250, 251)' }}
    >
      Smarthome ©2024 made with ❤️ by{' '}
      <a href={props.githubUrl} target="_blank" rel="noopener noreferrer">
        {props.githubUsername}
      </a>
    </Layout.Footer>
  );
};

export default Footer;
