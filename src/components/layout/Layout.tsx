import { Layout as Layouts, theme } from 'antd';
import React from 'react';
import styled from 'styled-components';

import { SideMenu } from '@components';
import './Layout.css';

type LayoutProps = {
  children: React.ReactNode;
};

const ContentWrapper = styled.div<{ $background?: string }>`
  padding: 24px;
  background: ${(props) => props.$background};
  border-radius: 8px;
`;

const DemoLogo = styled.div`
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
  border-radius: 6px;
`;

const { Header, Content, Footer, Sider } = Layouts;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layouts>
      <Sider breakpoint="lg" collapsedWidth="0" width={300}>
        <DemoLogo />
        <SideMenu />
      </Sider>
      <Layouts style={{ minHeight: '100vh', maxHeight: '100vh' }}>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content
          style={{
            margin: '24px 16px 0',
            overflowX: 'hidden',
          }}
        >
          <ContentWrapper $background={colorBgContainer}>
            {children}
          </ContentWrapper>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Smarthome ©2023 made with ❤️ by{' '}
          <a
            href="https://github.com/chatreejs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chatree.js
          </a>
        </Footer>
      </Layouts>
    </Layouts>
  );
};

export default Layout;
