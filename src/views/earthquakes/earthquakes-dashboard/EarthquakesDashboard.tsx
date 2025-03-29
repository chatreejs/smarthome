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
  const station = 'R0ED0';
  return (
    <>
      <Title level={2}>Real-Time Seismogram Data</Title>
      <Flex>
        <GraphWrapper>
          <Title level={4}>{station} EHZ</Title>
          <iframe
            className="frame"
            title="ehz"
            height={300}
            src={`https://dataview.raspberryshake.org/#/embed/AM/${station}/00/EHZ`}
          ></iframe>
        </GraphWrapper>
        <GraphWrapper>
          <Title level={4}>{station} ENE</Title>
          <iframe
            className="frame"
            title="ene"
            height={300}
            src={`https://dataview.raspberryshake.org/#/embed/AM/${station}/00/ENE`}
          ></iframe>
        </GraphWrapper>
      </Flex>
      <Flex>
        <GraphWrapper>
          <Title level={4}>{station} ENN</Title>
          <iframe
            className="frame"
            title="enn"
            height={300}
            src={`https://dataview.raspberryshake.org/#/embed/AM/${station}/00/ENN`}
          ></iframe>
        </GraphWrapper>
        <GraphWrapper>
          <Title level={4}>{station} ENZ</Title>
          <iframe
            className="frame"
            title="enz"
            height={300}
            src={`https://dataview.raspberryshake.org/#/embed/AM/${station}/00/ENZ`}
          ></iframe>
        </GraphWrapper>
      </Flex>
    </>
  );
};

export default EarthqualesDashboard;
