import React from "react";
import { ConfigProvider, Layout, theme } from "antd";
import "./App.css";

import styled from "styled-components";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard";
import SideMenu from "./components/side-menu/SideMenu";
import Food from "./components/food/Food";
import Inventory from "./components/inventory/Inventory";
import Farm from "./components/farm/Farm";

const { Header, Content, Footer, Sider } = Layout;

const ContentWrapper = styled.div<{ $background?: string }>`
  padding: 24px;
  height: 1000px;
  background: ${(props) => props.$background};
`;

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#30D5C8",
        },
      }}
    >
      <Layout>
        <Sider breakpoint="lg" collapsedWidth="0">
          <div className="demo-logo-vertical" />
          <SideMenu />
        </Sider>
        <Layout style={{ maxHeight: "100vh" }}>
          <Header style={{ padding: 0, background: colorBgContainer }} />
          <Content
            style={{
              margin: "24px 16px 0",
              overflow: "auto",
            }}
          >
            <ContentWrapper $background={colorBgContainer}>
              <Routes>
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/food" element={<Food />}></Route>
                <Route path="/inventory" element={<Inventory />}></Route>
                <Route path="/farm" element={<Farm />}></Route>
              </Routes>
            </ContentWrapper>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            SmartHome ©2023 made with ❤️ by{" "}
            <a
              href="https://github.com/chatreejs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chatree.js
            </a>
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
