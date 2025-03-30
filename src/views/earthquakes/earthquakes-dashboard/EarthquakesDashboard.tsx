import { Flex, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';

const { Title } = Typography;

const GraphWrapper = styled.div`
  flex: 1 1 auto;
  flex-direction: column;
  display: flex;

  .frame {
    flex: 1 1 auto;
  }
`;

const EarthqualesDashboard: React.FC = () => {
  const station = 'S150A';

  return (
    <>
      <Title level={2}>Real-Time Seismogram Data</Title>
      <Flex>
        <GraphWrapper>
          <iframe
            title="ehz"
            height={window.innerHeight * 0.5 - 48}
            src={`https://stationview.raspberryshake.org/#/?lat=19.63792&lon=100.62396&zoom=5.5`}
          ></iframe>
        </GraphWrapper>
      </Flex>
      <Flex>
        <GraphWrapper>
          <Title level={5}>{station} EHZ</Title>
          <iframe
            className="frame"
            title="ehz"
            height={250}
            src={`https://dataview.raspberryshake.org/#/embed/AM/${station}/00/EHZ`}
          ></iframe>
        </GraphWrapper>
        <GraphWrapper>
          <Title level={5}>{station} HDF</Title>
          <iframe
            className="frame"
            title="hdf"
            height={250}
            src={`https://dataview.raspberryshake.org/#/embed/AM/${station}/00/HDF`}
          ></iframe>
        </GraphWrapper>
      </Flex>
    </>
  );
};

export default EarthqualesDashboard;
