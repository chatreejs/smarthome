import { Waterworks } from '@interfaces';
import dayjs from 'dayjs';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';

interface Props {
  data: Waterworks[];
}

const WaterworksChart: React.FC<Props> = ({ data }) => {
  const options: Highcharts.Options = {
    title: {
      text: 'ประวัติการใช้น้ำ',
    },
    xAxis: {
      categories: data.map((item) =>
        dayjs(item.invoiceDate).format('YYYY-MM-DD'),
      ),
    },
    yAxis: {
      title: {
        text: 'ค่าน้ำ (บาท)',
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
        name: 'ค่าน้ำ',
        data: data.map((item) => item.total),
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, (Highcharts.getOptions().colors?.[0] as string) || '#000000'],
            [
              1,
              Highcharts.color(Highcharts.getOptions().colors?.[0] ?? '#000000')
                .setOpacity(0)
                .get('rgba') as string,
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

export default WaterworksChart;
