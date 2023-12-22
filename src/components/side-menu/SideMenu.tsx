import { AuthContext } from '@context';
import {
  faBolt,
  faBoxesStacked,
  faCertificate,
  faChartPie,
  faCog,
  faFaucet,
  faFileInvoiceDollar,
  faHouse,
  faUtensils,
  faWheatAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu } from 'antd';
import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import './SideMenu.css';

const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 64px);
`;

const MenuText = styled.span`
  font-size: 1rem;
  margin-left: 0.5rem;
`;

const SideMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const [defaultSelectedKeys] = useState(
    location.pathname.split('/')[1] || 'dashboard',
  );

  const onClickMenu = (path: string) => {
    navigate(`/${path}`);
  };

  return (
    <Menu
      defaultSelectedKeys={[defaultSelectedKeys]}
      mode="inline"
      theme="light"
      className="menu"
    >
      <Menu.ItemGroup title="ภาพรวม" />
      <Menu.Item key="dashboard" onClick={() => onClickMenu('dashboard')}>
        <FontAwesomeIcon icon={faChartPie} className="fa-fw" />
        <MenuText>แดชบอร์ด</MenuText>
      </Menu.Item>
      <Menu.SubMenu
        title="สาธารณูปโภค"
        icon={<FontAwesomeIcon icon={faHouse} className="fa-fw" />}
      >
        <Menu.Item key="electricity" onClick={() => onClickMenu('electricity')}>
          <FontAwesomeIcon icon={faBolt} className="fa-fw" />
          <MenuText>ค่าไฟ</MenuText>
        </Menu.Item>
        <Menu.Item key="waterworks" onClick={() => onClickMenu('waterworks')}>
          <FontAwesomeIcon icon={faFaucet} className="fa-fw" />
          <MenuText>ค่าน้ำ</MenuText>
        </Menu.Item>
        <Menu.Item key="services" onClick={() => onClickMenu('services')}>
          <FontAwesomeIcon icon={faFileInvoiceDollar} className="fa-fw" />
          <MenuText>ค่าบริการ</MenuText>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="food" onClick={() => onClickMenu('food')}>
        <FontAwesomeIcon icon={faUtensils} className="fa-fw" />
        <MenuText>อาหาร</MenuText>
      </Menu.Item>
      <Menu.Item key="inventory" onClick={() => onClickMenu('inventory')}>
        <FontAwesomeIcon icon={faBoxesStacked} className="fa-fw" />
        <MenuText>ของใช้</MenuText>
      </Menu.Item>
      <Menu.Item key="warranty" onClick={() => onClickMenu('warranty')}>
        <FontAwesomeIcon icon={faCertificate} className="fa-fw" />
        <MenuText>การรับประกัน</MenuText>
      </Menu.Item>
      <Menu.Divider />
      <Menu.ItemGroup title="ระบบ" />
      <Menu.Item key="smartfarm" onClick={() => onClickMenu('smartfarm')}>
        <FontAwesomeIcon icon={faWheatAlt} className="fa-fw" />
        <MenuText>ฟาร์มอัจฉริยะ</MenuText>
      </Menu.Item>
      <Menu.Divider />
      {authContext.hasRole('admin') && (
        <>
          <Menu.ItemGroup title="การตั้งค่า" />
          <Menu.Item key="setting" onClick={() => onClickMenu('setting')}>
            <FontAwesomeIcon icon={faCog} className="fa-fw" />
            <MenuText>ตั้งค่าบ้าน</MenuText>
          </Menu.Item>
        </>
      )}
    </Menu>
  );
};

export default SideMenu;
