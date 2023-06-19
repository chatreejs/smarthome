import {
  faBoxesStacked,
  faChartLine,
  faUtensils,
  faWheatAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu } from "antd";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import "./SideMenu.css";

const MenuText = styled.span`
  font-size: 1rem;
  margin-left: 0.5rem;
`;

const SideMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [defaultSelectedKeys] = useState(
    location.pathname.split("/")[1] || "dashboard"
  );

  const onClickMenu = (path: string) => {
    navigate(`/${path}`);
  };

  return (
    <Menu
      defaultSelectedKeys={[defaultSelectedKeys]}
      mode='inline'
      theme='dark'
      className='menu'
    >
      <Menu.Item key='dashboard' onClick={() => onClickMenu("dashboard")}>
        <FontAwesomeIcon icon={faChartLine} className='fa-fw' />
        <MenuText>ภาพรวม</MenuText>
      </Menu.Item>
      <Menu.Item key='food' onClick={() => onClickMenu("food")}>
        <FontAwesomeIcon icon={faUtensils} className='fa-fw' />
        <MenuText>อาหาร</MenuText>
      </Menu.Item>
      <Menu.Item key='inventory' onClick={() => onClickMenu("inventory")}>
        <FontAwesomeIcon icon={faBoxesStacked} className='fa-fw' />
        <MenuText>ของใช้</MenuText>
      </Menu.Item>
      <Menu.Item key='farm' onClick={() => onClickMenu("farm")}>
        <FontAwesomeIcon icon={faWheatAlt} className='fa-fw' />
        <MenuText>ฟาร์ม</MenuText>
      </Menu.Item>
    </Menu>
  );
};

export default SideMenu;
