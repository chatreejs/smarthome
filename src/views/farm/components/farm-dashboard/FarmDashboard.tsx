import {
  faBug,
  faDroplet,
  faEllipsis,
  faGauge,
  faShower,
  faTemperatureHalf,
  faWind,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { StompClient } from '@api';
import { WeatherSensor } from '../..';
import './FarmDashboard.css';

const { Title } = Typography;

const CardWrapper = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: 55vh;

  @media (max-width: 768px) {
    max-height: 40vh;
  }
`;

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
  const [temperature, setTemperature] = useState<number>(null);
  const [humidity, setHumidity] = useState<number>(null);
  const [pressure, setPressure] = useState<number>(null);
  const [aqi, setAqi] = useState<number>(20); // TODO: [AQI] Add AQI to sensor data
  const [sensorData, setSensorData] = useState<WeatherSensor>(null);

  useEffect(() => {
    StompClient.onConnect = () => {
      StompClient.subscribe('/topic/weather-sensor', (message) => {
        const body: WeatherSensor = JSON.parse(message.body);
        setSensorData(body);
      });
    };
    StompClient.activate();

    // Cleanup
    return () => {
      if (StompClient.connected) {
        StompClient.deactivate();
      }
    };
  }, []);

  useEffect(() => {
    if (sensorData) {
      setTemperature(sensorData.temperature);
      setHumidity(sensorData.humidity);
      setPressure(sensorData.pressure);
    }
  }, [sensorData]);

  const aqiColor = (aqi: number): string => {
    if (aqi <= 12) {
      return '#718A3B';
    } else if (aqi <= 35.4) {
      return '#A57F2E';
    } else if (aqi <= 55.4) {
      return '#B25925';
    } else if (aqi <= 150.4) {
      return '#AF2A3D';
    } else if (aqi <= 250.4) {
      return '#6B4A7C';
    } else {
      return '#693F53';
    }
  };

  return (
    <>
      <Title level={2}>ฟาร์ม</Title>
      <Row gutter={8}>
        <Col span={6}>
          <Statistic
            title="อุณหภูมิ"
            value={temperature}
            precision={2}
            prefix={<FontAwesomeIcon icon={faTemperatureHalf} />}
            suffix="°C"
            loading={temperature == null}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="ความชื้นสัมพัทธ์"
            value={humidity}
            precision={2}
            prefix={<FontAwesomeIcon icon={faDroplet} />}
            suffix="%"
            loading={humidity == null}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="ความดันบรรยากาศ"
            value={pressure}
            precision={2}
            prefix={<FontAwesomeIcon icon={faGauge} />}
            suffix="hPa"
            loading={pressure == null}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="AQI"
            value={aqi}
            precision={2}
            prefix={<FontAwesomeIcon icon={faWind} />}
            valueStyle={{ color: aqiColor(aqi) }}
            loading={aqi == null}
          />
        </Col>
      </Row>
      <Divider />
      <CardWrapper>
        <Row gutter={8}>
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
                <FontAwesomeIcon icon={faShower} />,
                <FontAwesomeIcon icon={faBug} />,
                <Dropdown menu={{ items }} trigger={['click']}>
                  <a onClick={(e) => e.preventDefault()}>
                    <FontAwesomeIcon icon={faEllipsis} />
                  </a>
                </Dropdown>,
              ]}
            >
              <Row>
                <Col span={12}>
                  <Statistic
                    title="ความชื้นในดิน"
                    value={10}
                    prefix={<FontAwesomeIcon icon={faShower} />}
                    suffix="%"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="pH"
                    value={5.5}
                    prefix={<FontAwesomeIcon icon={faDroplet} />}
                  />
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
                <FontAwesomeIcon icon={faShower} />,
                <FontAwesomeIcon icon={faBug} />,
                <Dropdown menu={{ items }} trigger={['click']}>
                  <a onClick={(e) => e.preventDefault()}>
                    <FontAwesomeIcon icon={faEllipsis} />
                  </a>
                </Dropdown>,
              ]}
            >
              <Row>
                <Col span={12}>
                  <Statistic
                    title="ความชื้นในดิน"
                    value={50}
                    prefix={<FontAwesomeIcon icon={faShower} />}
                    suffix="%"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="pH"
                    value={5.5}
                    prefix={<FontAwesomeIcon icon={faDroplet} />}
                  />
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
                <FontAwesomeIcon icon={faShower} />,
                <FontAwesomeIcon icon={faBug} />,
                <Dropdown menu={{ items }} trigger={['click']}>
                  <a onClick={(e) => e.preventDefault()}>
                    <FontAwesomeIcon icon={faEllipsis} />
                  </a>
                </Dropdown>,
              ]}
            >
              <Row>
                <Col span={12}>
                  <Statistic
                    title="ความชื้นในดิน"
                    value={30}
                    prefix={<FontAwesomeIcon icon={faShower} />}
                    suffix="%"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="pH"
                    value={5.5}
                    prefix={<FontAwesomeIcon icon={faDroplet} />}
                  />
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
                <FontAwesomeIcon icon={faShower} />,
                <FontAwesomeIcon icon={faBug} />,
                <Dropdown menu={{ items }} trigger={['click']}>
                  <a onClick={(e) => e.preventDefault()}>
                    <FontAwesomeIcon icon={faEllipsis} />
                  </a>
                </Dropdown>,
              ]}
            >
              <Row>
                <Col span={12}>
                  <Statistic
                    title="ความชื้นในดิน"
                    value={30}
                    prefix={<FontAwesomeIcon icon={faShower} />}
                    suffix="%"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="pH"
                    value={5.5}
                    prefix={<FontAwesomeIcon icon={faDroplet} />}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </CardWrapper>
    </>
  );
};

export default FarmDashboard;
