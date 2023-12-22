import { AuthContext } from '@context';
import { Avatar, Badge } from 'antd';
import React, { useContext, useEffect, useState } from 'react';

const CurrentUser: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const [notificationCount, setNotificationCount] = useState<number>(2);

  useEffect(() => {
    const firstName = authContext.userProfile.firstName;
    const lastName = authContext.userProfile.lastName;

    if (firstName && lastName) {
      // Capitalize the first letter of the first name and last name.
      const firstNameCapitalized =
        firstName.charAt(0).toUpperCase() + firstName.slice(1);
      const lastNameCapitalized =
        lastName.charAt(0).toUpperCase() + lastName.slice(1);
      setCurrentUserName(`${firstNameCapitalized} ${lastNameCapitalized}`);
    }
  }, [authContext.userProfile]);

  const generateMonogram = (name: string) => {
    const nameSplit = name.split(' ');
    let monogram = '';

    if (nameSplit.length > 1) {
      monogram = nameSplit[0].charAt(0) + nameSplit[1].charAt(0);
    } else {
      monogram = nameSplit[0].charAt(0);
    }

    return monogram.toUpperCase();
  };

  return (
    <>
      <Badge count={notificationCount}>
        <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>
          {generateMonogram(currentUserName)}
        </Avatar>
      </Badge>
      <h5 style={{ margin: 0, marginLeft: '16px' }}>
        <a onClick={authContext.logout}>{currentUserName}</a>
      </h5>
    </>
  );
};

export default CurrentUser;
