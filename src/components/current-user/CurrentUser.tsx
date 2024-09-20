import {
  faArrowRightFromBracket,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Badge, Dropdown } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const CurrentUserWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const CurrentUserText = styled.span`
  font-size: 1rem;
  margin-left: 0.75rem;
`;

const DropdownMenuItem = styled.div`
  display: flex;
  align-items: center;
`;

const DropdownMenuItemText = styled.span`
  margin-left: 0.5rem;
`;

const CurrentUser: React.FC = () => {
  const { tokenData, logOut } = useContext<IAuthContext>(AuthContext);
  const navigate = useNavigate();
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const [monogramColor, setMonogramColor] = useState<string>('');
  const [monogramTextColor, setMonogramTextColor] = useState<string>('');
  const [notificationCount, setNotificationCount] = useState<number>(0);

  useEffect(() => {
    setNotificationCount(3);
  }, []);

  useEffect(() => {
    const firstName = tokenData?.given_name as string;
    const lastName = tokenData?.family_name as string;

    if (firstName && lastName) {
      // Capitalize the first letter of the first name and last name.
      const firstNameCapitalized =
        firstName.charAt(0).toUpperCase() + firstName.slice(1);
      const lastNameCapitalized =
        lastName.charAt(0).toUpperCase() + lastName.slice(1);
      const { monogramColor, monogramTextColor } = generateMonogramColor(
        `${firstNameCapitalized} ${lastNameCapitalized}`,
      );
      setCurrentUserName(`${firstNameCapitalized} ${lastNameCapitalized}`);
      setMonogramColor(monogramColor);
      setMonogramTextColor(monogramTextColor);
    }
  }, [tokenData]);

  const generateMonogramText = (name: string) => {
    const nameSplit = name.split(' ');
    let monogram = '';

    if (nameSplit.length > 1) {
      monogram = nameSplit[0].charAt(0) + nameSplit[1].charAt(0);
    } else {
      monogram = nameSplit[0].charAt(0);
    }

    return monogram.toUpperCase();
  };

  const generateMonogramColor = (name: string) => {
    const nameSplit = name.split(' ');
    let monogramColor = '';
    let monogramTextColor = '';

    // Reference: https://flatuicolors.com/palette/defo.
    const colorPalette = [
      '#1abc9c',
      '#2ecc71',
      '#3498db',
      '#9b59b6',
      '#f1c40f',
      '#e67e22',
      '#e74c3c',
      '#34495e',
      '#16a085',
      '#27ae60',
      '#2980b9',
      '#8e44ad',
    ];

    if (nameSplit.length > 1) {
      monogramColor =
        colorPalette[
          (nameSplit[0].charCodeAt(0) + nameSplit[1].charCodeAt(0)) % 12
        ];
    } else {
      monogramColor = colorPalette[nameSplit[0].charCodeAt(0) % 12];
    }

    // Generate a text color based on the monogram background color.
    // Reference: https://stackoverflow.com/a/3943023.
    const hexColor = monogramColor.substring(1);
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
    // YIQ equation from https://en.wikipedia.org/wiki/YIQ.
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    monogramTextColor = yiq >= 128 ? '#000000' : '#ffffff';

    return { monogramColor, monogramTextColor };
  };

  const onClickMenu = (path: string) => {
    navigate(`/${path}`);
  };

  const onLogout = () => {
    logOut();
  };

  return (
    <Dropdown
      trigger={['click']}
      menu={{
        items: [
          {
            key: 'setting',
            label: (
              <DropdownMenuItem>
                <FontAwesomeIcon icon={faCog} className="fa-fw" />
                <DropdownMenuItemText>ตั้งค่า</DropdownMenuItemText>
              </DropdownMenuItem>
            ),
            onClick: () => onClickMenu('setting'),
          },
          {
            type: 'divider',
          },
          {
            key: 'logout',
            label: (
              <DropdownMenuItem>
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  className="fa-fw"
                />
                <DropdownMenuItemText>ออกจากระบบ</DropdownMenuItemText>
              </DropdownMenuItem>
            ),
            onClick: () => onLogout(),
          },
        ],
      }}
    >
      <CurrentUserWrapper>
        <Badge count={notificationCount}>
          <Avatar
            style={{ backgroundColor: monogramColor, color: monogramTextColor }}
          >
            {generateMonogramText(currentUserName)}
          </Avatar>
        </Badge>
        <CurrentUserText>{currentUserName}</CurrentUserText>
      </CurrentUserWrapper>
    </Dropdown>
  );
};

export default CurrentUser;
