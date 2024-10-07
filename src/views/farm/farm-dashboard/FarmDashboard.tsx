import { faBug, faEllipsis, faShower } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Client, IMessage } from '@stomp/stompjs';
import {
  Card,
  Col,
  Divider,
  Dropdown,
  MenuProps,
  Row,
  Statistic,
  Typography,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { AirQuality, Weather } from '@interfaces';
import './FarmDashboard.css';

const { Title } = Typography;

const items: MenuProps['items'] = [
  {
    label: 'แก้ไขข้อมูล',
    key: '0',
  },
  {
    type: 'divider',
  },
  {
    label: 'ประวัติการรักษา',
    key: '1',
  },
  {
    label: 'ประวัติการใส่ปุ๋ย',
    key: '2',
  },
  {
    label: 'รายงานการรดน้ำ',
    key: '3',
  },
];

const FarmDashboard: React.FC = () => {
  const [weatherData, setWeatherData] = useState<Weather>();
  const [airQualityData, setAirQualityData] = useState<AirQuality>();

  const handleWeatherMessage = (message: IMessage) => {
    const body: Weather = JSON.parse(message.body) as Weather;
    setWeatherData(body);
  };

  const handleAirQualityMessage = (message: IMessage) => {
    const body: AirQuality = JSON.parse(message.body) as AirQuality;
    setAirQualityData(body);
  };

  const setupStompClient = useCallback(() => {
    const weatherStompClient = new Client({
      brokerURL: process.env.VITE_APP_WEATHER_SOCKET,
      reconnectDelay: 2000,
    });

    weatherStompClient.onConnect = () => {
      weatherStompClient.subscribe(
        '/topic/weather-sensor',
        handleWeatherMessage,
      );
      weatherStompClient.subscribe(
        '/topic/air-quality',
        handleAirQualityMessage,
      );
    };

    weatherStompClient.activate();

    return () => {
      void weatherStompClient.deactivate();
    };
  }, []);

  useEffect(() => {
    const stompClient = setupStompClient();
    return stompClient;
  }, [setupStompClient]);

  return (
    <>
      <Title level={2}>ฟาร์ม</Title>
      <Row gutter={[8, 8]}>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Card>
            <Statistic
              title="อุณหภูมิ"
              value={weatherData?.temperature}
              precision={2}
              suffix="°C"
              loading={weatherData?.temperature == null}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Card>
            <Statistic
              title="ความชื้นสัมพัทธ์"
              value={weatherData?.humidity}
              precision={2}
              suffix="%"
              loading={weatherData?.humidity == null}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Card>
            <Statistic
              title="ความดันบรรยากาศ"
              value={weatherData?.pressure}
              precision={2}
              suffix="hPa"
              loading={weatherData?.pressure == null}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Card>
            <Statistic
              title="Air Quality (PM2.5)"
              value={airQualityData?.pm25}
              suffix="μg/m³"
              loading={airQualityData?.pm25 == null}
            />
          </Card>
        </Col>
      </Row>
      <Divider />

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12} md={8}>
          <Card
            title="มะนาว"
            cover={
              <img
                alt="example"
                src="https://www.gardeningknowhow.com/wp-content/uploads/2007/09/lime-tree.jpg"
              />
            }
            actions={[
              <FontAwesomeIcon icon={faShower} key="watering" />,
              <FontAwesomeIcon icon={faBug} key="disease" />,
              <Dropdown menu={{ items }} trigger={['click']} key="menu-list">
                <a onClick={(e) => e.preventDefault()}>
                  <FontAwesomeIcon icon={faEllipsis} />
                </a>
              </Dropdown>,
            ]}
          >
            <Row>
              <Col span={12}>
                <Statistic title="ความชื้นในดิน" value={10} suffix="%" />
              </Col>
              <Col span={12}>
                <Statistic title="pH" value={5.5} />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            title="เลมอน"
            cover={
              <img
                alt="example"
                src="https://www.bhg.com/thmb/u6rFkSUuKIWEeUYyTVThJhrJk84=/4000x0/filters:no_upscale():strip_icc()/How-to-Grow-a-Lemon-Tree-from-Seed-EpMfZ-e-KadA6psBW7Me0e-7444bd1697b3418595ab1df6c3dcb48f.jpg"
              />
            }
            actions={[
              <FontAwesomeIcon icon={faShower} key="watering" />,
              <FontAwesomeIcon icon={faBug} key="disease" />,
              <Dropdown menu={{ items }} trigger={['click']} key="menu-list">
                <a onClick={(e) => e.preventDefault()}>
                  <FontAwesomeIcon icon={faEllipsis} />
                </a>
              </Dropdown>,
            ]}
          >
            <Row>
              <Col span={12}>
                <Statistic title="ความชื้นในดิน" value={50} suffix="%" />
              </Col>
              <Col span={12}>
                <Statistic title="pH" value={5.5} />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            title="ต้นหอม"
            cover={
              <img
                alt="example"
                src="https://media.istockphoto.com/id/1226286409/photo/young-green-spring-shoots-of-green-onions-in-the-garden-selective-focus.jpg?s=612x612&w=0&k=20&c=1k6CPblUttEj_94REWPnbt9LguMIfOgKN39d896lfrI="
              />
            }
            actions={[
              <FontAwesomeIcon icon={faShower} key="watering" />,
              <FontAwesomeIcon icon={faBug} key="disease" />,
              <Dropdown menu={{ items }} trigger={['click']} key="menu-list">
                <a onClick={(e) => e.preventDefault()}>
                  <FontAwesomeIcon icon={faEllipsis} />
                </a>
              </Dropdown>,
            ]}
          >
            <Row>
              <Col span={12}>
                <Statistic title="ความชื้นในดิน" value={30} suffix="%" />
              </Col>
              <Col span={12}>
                <Statistic title="pH" value={5.5} />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            title="ต้นหอม"
            cover={
              <img
                alt="example"
                src="https://media.istockphoto.com/id/1226286409/photo/young-green-spring-shoots-of-green-onions-in-the-garden-selective-focus.jpg?s=612x612&w=0&k=20&c=1k6CPblUttEj_94REWPnbt9LguMIfOgKN39d896lfrI="
              />
            }
            actions={[
              <FontAwesomeIcon icon={faShower} key="watering" />,
              <FontAwesomeIcon icon={faBug} key="disease" />,
              <Dropdown menu={{ items }} trigger={['click']} key="menu-list">
                <a onClick={(e) => e.preventDefault()}>
                  <FontAwesomeIcon icon={faEllipsis} />
                </a>
              </Dropdown>,
            ]}
          >
            <Row>
              <Col span={12}>
                <Statistic title="ความชื้นในดิน" value={30} suffix="%" />
              </Col>
              <Col span={12}>
                <Statistic title="pH" value={5.5} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default FarmDashboard;
