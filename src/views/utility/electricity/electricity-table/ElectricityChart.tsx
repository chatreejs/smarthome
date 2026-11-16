import { Col, Empty, Row } from 'antd';
import dayjs from 'dayjs';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useMemo } from 'react';

import { Electricity } from '@interfaces';

interface Props {
  data: Electricity[];
}

// Every chart uses this height so the cards line up.
const CHART_HEIGHT = 360;

// Brand orange for the bill total.
const TOTAL_COLOR = '#fa8c16';

// These colours pass a colour-blind check as a set.
// Each bill part uses the same colour in both charts.
const SERIES_COLOR = {
  electricityPrice: '#2a78d6',
  serviceCharge: '#eb6834',
  ft: '#1baf7a',
  vat: '#eda100',
  costPerUnit: '#6250d6',
};

const baseOptions = (
  title: string,
  categories: string[],
  yTitle: string,
): Highcharts.Options => ({
  chart: {
    height: CHART_HEIGHT,
    style: { fontFamily: 'Noto Sans Thai' },
  },
  title: { text: title, align: 'left' },
  xAxis: {
    categories,
    crosshair: true,
  },
  yAxis: {
    title: { text: yTitle },
    gridLineColor: '#f0f0f0',
  },
  legend: { enabled: true },
  credits: { enabled: false },
});

const ElectricityChart: React.FC<Props> = ({ data }) => {
  const sorted = useMemo(
    () =>
      [...data].sort(
        (a, b) =>
          dayjs(a.invoiceDate).valueOf() - dayjs(b.invoiceDate).valueOf(),
      ),
    [data],
  );

  const categories = useMemo(
    () => sorted.map((item) => dayjs(item.invoiceDate).format('MMM BB')),
    [sorted],
  );

  if (sorted.length === 0) {
    return <Empty description="ยังไม่มีข้อมูลค่าไฟ" />;
  }

  const breakdownOptions: Highcharts.Options = {
    ...baseOptions('องค์ประกอบค่าไฟแต่ละเดือน', categories, 'บาท'),
    tooltip: {
      shared: true,
      valueDecimals: 2,
      valueSuffix: ' บาท',
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        borderWidth: 2,
        borderColor: '#ffffff',
        borderRadius: 4,
        maxPointWidth: 40,
      },
    },
    series: [
      {
        type: 'column',
        name: 'ค่าไฟฟ้า',
        color: SERIES_COLOR.electricityPrice,
        data: sorted.map((item) => item.electricityPrice),
      },
      {
        type: 'column',
        name: 'ค่าบริการ',
        color: SERIES_COLOR.serviceCharge,
        data: sorted.map((item) => item.serviceCharge),
      },
      {
        type: 'column',
        name: 'ค่า Ft',
        color: SERIES_COLOR.ft,
        data: sorted.map((item) => item.ft),
      },
      {
        type: 'column',
        name: 'ภาษีมูลค่าเพิ่ม',
        color: SERIES_COLOR.vat,
        data: sorted.map((item) => item.vat),
      },
      {
        type: 'line',
        name: 'ยอดรวม',
        color: TOTAL_COLOR,
        lineWidth: 2,
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: 4,
          lineWidth: 2,
          lineColor: '#ffffff',
        },
        tooltip: {
          pointFormat:
            '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y:,.2f} บาท</b> ({point.usage:,.0f} kWh)<br/>',
        },
        data: sorted.map((item) => ({ y: item.total, usage: item.usage })),
      },
    ],
  };

  const unitPriceOptions: Highcharts.Options = {
    ...baseOptions('ราคาต่อหน่วย', categories, 'บาท/หน่วย'),
    tooltip: {
      shared: true,
      valueDecimals: 4,
      valueSuffix: ' บาท/หน่วย',
    },
    plotOptions: {
      line: {
        lineWidth: 2,
        marker: { enabled: true, symbol: 'circle', radius: 4 },
      },
    },
    series: [
      {
        type: 'line',
        name: 'ค่าไฟเฉลี่ยต่อหน่วย (รวม VAT)',
        color: SERIES_COLOR.costPerUnit,
        data: sorted.map((item) =>
          item.usage > 0 ? item.total / item.usage : null,
        ),
      },
      {
        type: 'line',
        name: 'อัตราค่า Ft',
        color: SERIES_COLOR.ft,
        step: 'left',
        data: sorted.map((item) => item.ftRate),
      },
    ],
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <HighchartsReact highcharts={Highcharts} options={breakdownOptions} />
      </Col>
      <Col span={24}>
        <HighchartsReact highcharts={Highcharts} options={unitPriceOptions} />
      </Col>
    </Row>
  );
};

export default ElectricityChart;
