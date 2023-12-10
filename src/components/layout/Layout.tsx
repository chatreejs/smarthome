import { Avatar, Badge, Layout as Layouts, theme } from 'antd';
import React, { useEffect } from 'react';
import styled from 'styled-components';

import { Logo, SideMenu } from '@components';
import useWindowResize from '../../hooks/useWindowResize';
import './Layout.css';

type LayoutProps = {
  children: React.ReactNode;
};

const ContentWrapper = styled.div`
  padding-left: 40px;
  padding-right: 40px;
  width: 100%;
  max-width: 1500px;

  @media (max-width: 768px) {
    padding-left: 20px;
    padding-right: 20px;
  }
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
  const [collapsed, setCollapsed] = React.useState(false);
  const [showOverlay, setShowOverlay] = React.useState(false);
  const { width } = useWindowResize();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    if (width >= 992 && showOverlay) {
      setShowOverlay(false);
    }
  }, [width]);

  const onOverlayClick = () => {
    setShowOverlay(false);
    setCollapsed(true);
  };

  return (
    <Layouts>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        width={300}
        theme="light"
        style={{ borderRight: '1px solid rgb(240, 240, 240)' }}
        collapsed={collapsed}
        onCollapse={(collapsed, type) => {
          setCollapsed(collapsed);
          if (!collapsed && type === 'clickTrigger') {
            setShowOverlay(true);
          } else if (collapsed && type === 'clickTrigger') {
            setShowOverlay(false);
          }
        }}
      >
        <Logo systemName="smarthome" />
        <SideMenu />
      </Sider>
      <div
        className={'overlay ' + (showOverlay ? 'active' : '')}
        onClick={onOverlayClick}
      />
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
            overflowY: 'scroll',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <ContentWrapper>{children}</ContentWrapper>
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
