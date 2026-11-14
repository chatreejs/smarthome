import { App, Card, Skeleton, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { ActionBar } from '@components';
import { RootState } from '@config';
import { Electricity } from '@interfaces';
import { ElectricityService } from '@services';
import { bulkDeleteErrorMessage } from '@utils';
import ElectricityChart from './ElectricityChart';

const { Title } = Typography;

dayjs.extend(buddhistEra);
dayjs.locale('th');

const formatBaht = (value: number) =>
  value.toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const columns: ColumnsType<Electricity> = [
  {
    title: 'เลขที่ใบแจ้งหนี้',
    width: '150px',
    render: (electricity: Electricity) => (
      <Link to={{ pathname: `${electricity.id}` }}>
        {electricity.invoiceNumber}
      </Link>
    ),
  },
  {
    title: 'วันที่ใบแจ้งหนี้',
    width: '120px',
    render: (electricity: Electricity) => (
      <span>{dayjs(electricity.invoiceDate).format('DD MMMM BBBB')}</span>
    ),
  },
  {
    title: 'หน่วยที่ใช้ (kWh)',
    width: '100px',
    align: 'right',
    dataIndex: 'usage',
  },
  {
    title: 'ยอดรวม (บาท)',
    width: '100px',
    align: 'right',
    render: (electricity: Electricity) => formatBaht(electricity.total),
  },
];

const ElectricityTable: React.FC = () => {
  const { notification } = App.useApp();
  const homeId = useSelector((state: RootState) => state.home.id);
  const [electricityData, setElectricityData] = useState<Electricity[]>([]);
  const [selectedElectricity, setSelectedElectricity] = useState<Electricity[]>(
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

  const fetchElectricityData = useCallback(() => {
    setLoading(true);
    ElectricityService.getAllElectricity(homeId).subscribe({
      next: (res) => {
        setElectricityData(res);
        setLoading(false);
      },
      error: () => {
        onError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
        setLoading(false);
      },
    });
  }, [homeId, onError]);

  useEffect(() => {
    fetchElectricityData();
  }, [fetchElectricityData]);

  const onSuccess = (successMessage: string) => {
    notification.success({
      message: 'สำเร็จ',
      description: successMessage,
    });
  };

  const rowSelection = {
    onChange: (_: React.Key[], selectedRows: Electricity[]) => {
      setSelectedElectricity(selectedRows);
    },
  };

  const onConfirmDelete = () => {
    ElectricityService.deleteMultipleElectricity(
      selectedElectricity.map((electricity) => electricity.id),
      homeId,
    ).subscribe({
      next: () => {
        setSelectedElectricity([]);
        fetchElectricityData();
        onSuccess('ลบข้อมูลสำเร็จ');
      },
      error: (err: AxiosError<unknown>) => {
        onError(bulkDeleteErrorMessage(err));
        if (err.response?.status === 404) {
          fetchElectricityData();
        }
      },
    });
  };

  return (
    <>
      <Title level={2}>ค่าไฟ</Title>
      <Card style={{ marginBottom: '1rem' }}>
        {loading ? (
          <Skeleton active />
        ) : (
          <ElectricityChart data={electricityData} />
        )}
      </Card>
      <ActionBar
        resourceName="บิลค่าไฟ"
        selectedItems={selectedElectricity}
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
          dataSource={electricityData}
          rowKey={(electricity) => electricity.id}
          loading={loading}
          scroll={{ x: 576, y: '60vh' }}
        />
      </Card>
    </>
  );
};

export default ElectricityTable;
