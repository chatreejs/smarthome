import { Button, Result } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './PageResult.css';

interface PageResultProps {
  status: '403' | '404' | '500';
}

const PageResult: React.FC<PageResultProps> = ({ status }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [subTitle, setSubTitle] = useState<string>('');

  useEffect(() => {
    switch (status) {
      case '403':
        setTitle('We are sorry');
        setSubTitle(
          'The page you-re trying to access has restricted access. Please refer to your system administrator.',
        );
        break;
      case '404':
        setTitle('Looks like you got lost');
        setSubTitle('The page you are looking for was not found.');
        break;
      case '500':
        setTitle('Oops! Something went wrong.');
        setSubTitle("Sorry for the inconvenience. we're working on it.");
        break;
      default:
        setTitle('Oops! Something went wrong.');
        setSubTitle("Sorry for the inconvenience. we're working on it.");
        break;
    }
  }, []);

  return (
    <Result
      status={status}
      title={title}
      subTitle={subTitle}
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          กลับหน้าหลัก
        </Button>
      }
    />
  );
};

export default PageResult;
