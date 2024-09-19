import { Layout as AntLayout, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { CurrentUser, Footer, Logo, SideMenu } from '@components';
import { useBrowserStorage, useWindowResize } from '@hooks';
import './Layout.css';

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

const { Header, Content, Sider } = AntLayout;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { width } = useWindowResize();
  const [isHasHome, setIsHasHome] = useBrowserStorage<boolean | undefined>(
    'sh-hashome',
    undefined,
    'local',
  );
  const [collapsed, setCollapsed] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    if (!isHasHome) {
      setIsHasHome(false);
      navigate('/initial-setup');
    }
  }, [navigate, isHasHome, setIsHasHome]);

  useEffect(() => {
    if (width >= 992 && showOverlay) {
      setShowOverlay(false);
    }
  }, [width, showOverlay]);

  const onOverlayClick = () => {
    setShowOverlay(false);
    setCollapsed(true);
  };

  return (
    <AntLayout>
      {isHasHome && (
        <>
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
          <AntLayout
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
                <div>Some Menu</div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <CurrentUser />
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
              <ContentWrapper>
                <Outlet />
              </ContentWrapper>
            </Content>
            <Footer
              githubUrl="https://github.com/chatreejs"
              githubUsername="Chatree.js"
            />
          </AntLayout>
        </>
      )}
    </AntLayout>
  );
};

export default Layout;
