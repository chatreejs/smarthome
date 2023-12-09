import { Avatar, Badge, Layout as Layouts, theme } from 'antd';
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
  border: 1px solid rgb(240, 240, 240);
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  width: 100%;
`;

const { Header, Content, Footer, Sider } = Layouts;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layouts>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        width={300}
        theme="light"
        style={{ borderRight: '1px solid rgb(240, 240, 240)' }}
      >
        <Logo systemName="smarthome" />
        <SideMenu />
      </Sider>
      <Layouts
        style={{
          minHeight: '100vh',
          maxHeight: '100vh',
          backgroundColor: 'rgb(250, 250, 251)',
        }}
      >
        <Header
          style={{
            display: 'flex',
            padding: 0,
            background: colorBgContainer,
            borderBottom: '1px solid rgb(240, 240, 240)',
          }}
        >
          <HeaderWrapper>
            <div>a1</div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Badge count={5}>
                <Avatar
                  style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}
                >
                  U
                </Avatar>
              </Badge>
              <h5 style={{ marginLeft: '16px' }}>John Doe</h5>
            </div>
          </HeaderWrapper>
        </Header>
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
        <Footer
          style={{ textAlign: 'center', backgroundColor: 'rgb(250, 250, 251)' }}
        >
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
