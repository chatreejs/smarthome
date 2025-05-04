import { App, Card, Table, Tag, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { ActionBar } from '@components';
import { RootState } from '@config';
import { WarrantyStatus } from '@enums';
import { Warranty } from '@interfaces';
import { WarrantyService } from '@services';

const { Title } = Typography;

const columns: ColumnsType<Warranty> = [
  {
    title: 'ชื่อสินค้า',
    width: '200px',
    render: (warranty: Warranty) => (
      <Link to={{ pathname: `${warranty.id}` }}>{warranty.productName}</Link>
    ),
  },
  {
    title: 'สถานะประกัน',
    width: '90px',
    align: 'center',
    render: (warranty: Warranty) => {
      if (warranty.status === WarrantyStatus.OUT_OF_WARRANTY) {
        return <Tag color="red">หมดประกัน</Tag>;
      } else {
        return <Tag color="green">อยู่ในประกัน</Tag>;
      }
    },
  },
  {
    title: 'ยี่ห้อ',
    width: '100px',
    dataIndex: 'brand',
  },

  {
    title: 'รุ่น',
    width: '150px',
    dataIndex: 'model',
  },
  {
    title: 'Serial No.',
    width: '180px',
    dataIndex: 'serialNumber',
  },
  {
    title: 'วันที่ซื้อ',
    width: '120px',
    render: (warranty: Warranty) => (
      <span>{dayjs(warranty.purchaseDate).format('DD MMMM BBBB')}</span>
    ),
  },
  {
    title: 'วันหมดประกัน',
    width: '120px',
    render: (warranty: Warranty) => (
      <span>{dayjs(warranty.warrantyDate).format('DD MMMM BBBB')}</span>
    ),
  },
];

const WarrantyTable: React.FC = () => {
  const { notification } = App.useApp();
  const homeId = useSelector((state: RootState) => state.home.id);
  const [warrantiesData, setWarrantiesData] = useState<Warranty[]>([]);
  const [selectedWarranties, setSelectedWarranties] = useState<Warranty[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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

  const fetchWarrantyData = useCallback(() => {
    setLoading(true);
    WarrantyService.getAllWarranties(homeId).subscribe({
      next: (warranties) => {
        setWarrantiesData(warranties);
      },
      error: () => {
        onError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
        setLoading(false);
      },
    });
  }, [onError]);

  useEffect(() => {
    fetchWarrantyData();
  }, [fetchWarrantyData]);

  const rowSelection = {
    onChange: (_: React.Key[], selectedRows: Warranty[]) => {
      setSelectedWarranties(selectedRows);
    },

    getCheckboxProps: (record: Warranty) => ({
      name: record.productName,
    }),
  };

  const navigateToCreateWarranty = () => {
    navigate('new');
  };

  const onConfirmDelete = () => {
    WarrantyService.deleteMultipleWarranties(
      selectedWarranties.map((warranty) => warranty.id),
      homeId,
    ).subscribe({
      next: () => {
        setSelectedWarranties([]);
        fetchWarrantyData();
      },
      error: () => onError('ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง'),
    });
  };

  return (
    <>
      <Title level={2}>เครื่องใช้ไฟฟ้า</Title>
      <ActionBar
        resourceName="เครื่องใช้ไฟฟ้า"
        selectedItems={selectedWarranties}
        onAddClick={navigateToCreateWarranty}
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
          dataSource={warrantiesData}
          rowKey={(warranty) => warranty.id}
          loading={loading}
          scroll={{ x: 576, y: '60vh' }}
        />
      </Card>
    </>
  );
};

export default WarrantyTable;
