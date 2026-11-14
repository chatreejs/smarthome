import { Electricity } from '@interfaces';
import dayjs from 'dayjs';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';

interface Props {
  data: Electricity[];
}

const CHART_COLOR = '#fa8c16';

const ElectricityChart: React.FC<Props> = ({ data }) => {
  const options: Highcharts.Options = {
    chart: {
      style: {
        fontFamily: 'Noto Sans Thai',
      },
    },
    title: {
      text: 'ประวัติการใช้ไฟฟ้า',
    },
    xAxis: {
      categories: data.map((item) =>
        dayjs(item.invoiceDate).format('YYYY-MM-DD'),
      ),
    },
    yAxis: {
      title: {
        text: 'ค่าไฟ (บาท)',
      },
      min: 0,
    },
    plotOptions: {
      areaspline: {
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: 2,
          states: {
            hover: {
              enabled: true,
            },
          },
        },
      },
    },
    series: [
      {
        type: 'areaspline',
        name: 'ค่าไฟ',
        color: CHART_COLOR,
        data: data.map((item) => item.total),
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, CHART_COLOR],
            [
              1,
              Highcharts.color(CHART_COLOR).setOpacity(0).get('rgba') as string,
            ],
          ],
        },
      },
    ],
    credits: {
      enabled: false,
    },
  };

  return data.length == 0 ? (
    <div>No data available.</div>
  ) : (
    <HighchartsReact highcharts={Highcharts} options={options} />
  );
};

export default ElectricityChart;
