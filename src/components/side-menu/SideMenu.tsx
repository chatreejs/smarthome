import {
  faBoxesStacked,
  faChartLine,
  faUtensils,
  faWheatAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import "./SideMenu.css";
import { useState } from "react";

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
      mode="inline"
      theme="dark"
      className="menu"
    >
      <Menu.Item key="dashboard" onClick={() => onClickMenu("dashboard")}>
        <FontAwesomeIcon icon={faChartLine} className="menu-icon" />
        Dashboard
      </Menu.Item>
      <Menu.Item key="food" onClick={() => onClickMenu("food")}>
        <FontAwesomeIcon icon={faUtensils} className="menu-icon" />
        Food
      </Menu.Item>
      <Menu.Item key="inventory" onClick={() => onClickMenu("inventory")}>
        <FontAwesomeIcon icon={faBoxesStacked} className="menu-icon" />
        Inventory
      </Menu.Item>
      <Menu.Item key="farm" onClick={() => onClickMenu("farm")}>
        <FontAwesomeIcon icon={faWheatAlt} className="menu-icon" />
        Farm
      </Menu.Item>
    </Menu>
  );
};

export default SideMenu;
