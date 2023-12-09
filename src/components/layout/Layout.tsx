import { Layout as Layouts, theme } from 'antd';
import React from 'react';
import styled from 'styled-components';

import { Logo, SideMenu } from '@components';
import './Layout.css';

type LayoutProps = {
  children: React.ReactNode;
};

const ContentWrapper = styled.div<{ $background?: string }>`
  padding: 24px;
  background: ${(props) => props.$background};
  border-radius: 8px;
  width: 100%;
  max-width: 1500px;
`;

const { Header, Content, Footer, Sider } = Layouts;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layouts>
      <Sider breakpoint="lg" collapsedWidth="0" width={300}>
        <Logo systemName="smarthome" />
        <SideMenu />
      </Sider>
      <Layouts style={{ minHeight: '100vh', maxHeight: '100vh' }}>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content
          style={{
            margin: '24px 16px 0',
            overflowY: 'scroll',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
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
