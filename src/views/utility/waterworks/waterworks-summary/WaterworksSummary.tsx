import { App, Card, Skeleton, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { ActionBar } from '@components';
import { RootState } from '@config';
import { Waterworks } from '@interfaces';
import { WaterworksService } from '@services';
import WaterworksChart from './WaterworksChart';

const { Title } = Typography;

dayjs.extend(buddhistEra);
dayjs.locale('th');

const formatBaht = (value: number) =>
  value.toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const columns: ColumnsType<Waterworks> = [
  {
    title: 'เลขที่ใบแจ้งหนี้',
    width: '150px',
    render: (waterworks: Waterworks) => (
      <Link to={{ pathname: `${waterworks.id}` }}>
        {waterworks.invoiceNumber}
      </Link>
    ),
  },
  {
    title: 'วันที่ใบแจ้งหนี้',
    width: '120px',
    render: (waterworks: Waterworks) => (
      <span>{dayjs(waterworks.invoiceDate).format('DD MMMM BBBB')}</span>
    ),
  },
  {
    title: 'น้ำที่ใช้ (ลบ.ม.)',
    width: '100px',
    align: 'right',
    dataIndex: 'waterUsage',
  },
  {
    title: 'ยอดรวม (บาท)',
    width: '100px',
    align: 'right',
    render: (waterworks: Waterworks) => formatBaht(waterworks.total),
  },
];

const WaterworksSummary: React.FC = () => {
  const { notification } = App.useApp();
  const homeId = useSelector((state: RootState) => state.home.id);
  const [waterworksData, setWaterworksData] = useState<Waterworks[]>([]);
  const [selectedWaterworks, setSelectedWaterworks] = useState<Waterworks[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onError = useCallback(
    (errorMessage: string) => {
      notification.error({
        message: 'เกิดข้อผิดพลาด',
        description: errorMessage,
      });
    },
    [notification],
  );

  const fetchWaterworksData = useCallback(() => {
    setLoading(true);
    WaterworksService.getAllWaterworks(homeId).subscribe({
      next: (res) => {
        setWaterworksData(res);
        setLoading(false);
      },
      error: () => {
        onError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
        setLoading(false);
      },
    });
  }, [homeId, onError]);

  useEffect(() => {
    fetchWaterworksData();
  }, [fetchWaterworksData]);

  const onSuccess = (successMessage: string) => {
    notification.success({
      message: 'สำเร็จ',
      description: successMessage,
    });
  };

  const rowSelection = {
    onChange: (_: React.Key[], selectedRows: Waterworks[]) => {
      setSelectedWaterworks(selectedRows);
    },
  };

  const onConfirmDelete = () => {
    WaterworksService.deleteMultipleWaterworks(
      selectedWaterworks.map((waterworks) => waterworks.id),
      homeId,
    ).subscribe({
      next: () => {
        setSelectedWaterworks([]);
        fetchWaterworksData();
        onSuccess('ลบข้อมูลสำเร็จ');
      },
      error: () => onError('ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง'),
    });
  };

  return (
    <>
      <Title level={2}>ค่าน้ำ</Title>
      <Card style={{ marginBottom: '1rem' }}>
        {loading ? (
          <Skeleton active />
        ) : (
          <WaterworksChart data={waterworksData} />
        )}
      </Card>
      <ActionBar
        resourceName="บิลค่าน้ำ"
        selectedItems={selectedWaterworks}
        onAddClick={() => navigate('new')}
        onConfirmDelete={onConfirmDelete}
      />
      <Card>
        <Table
          rowSelection={{
            type: 'checkbox',
            columnWidth: '40px',
            ...rowSelection,
          }}
          columns={columns}
          dataSource={waterworksData}
          rowKey={(waterworks) => waterworks.id}
          loading={loading}
          scroll={{ x: 576, y: '60vh' }}
        />
      </Card>
    </>
  );
};

export default WaterworksSummary;
