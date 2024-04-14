import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  App,
  Button,
  Card,
  Col,
  Popconfirm,
  Row,
  Table,
  Tag,
  Typography,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Warranty, WarrantyStatus } from '@models';
import { WarrantyService } from '@services';
import './WarrantyTable.css';

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
    title: 'สถานะ',
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
  const [warrantiesData, setWarrantiesData] = useState<Warranty[]>([]);
  const [selectedWarranties, setSelectedWarranties] = useState<Warranty[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const loadData = () => {
    setLoading(true);
    WarrantyService.getAllWarranties().subscribe({
      next: (warranties) => {
        setWarrantiesData(warranties);
      },
      error: (err) => onError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง'),
      complete: () => setLoading(false),
    });
  };

  const onError = (errorMessage: string) => {
    notification.error({
      message: 'เกิดข้อผิดพลาด',
      description: errorMessage,
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Warranty[]) => {
      setSelectedWarranties(selectedRows);
    },

    getCheckboxProps: (record: Warranty) => ({
      name: record.productName,
    }),
  };

  const navigateToCreateWarranty = () => {
    navigate('new');
  };

  const onConfirmDelete = (e: any) => {
    WarrantyService.deleteMultipleWarranties(
      selectedWarranties.map((warranty) => warranty.id),
    ).subscribe({
      next: () => {
        setSelectedWarranties([]);
        loadData();
      },
      error: (err) => onError('ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง'),
      complete: () => {},
    });
  };

  return (
    <>
      <Title level={2}>การรับประกัน</Title>
      <Row gutter={8} className="action-bar">
        <Col>
          <Button
            type="primary"
            className="action-btn"
            size="large"
            onClick={navigateToCreateWarranty}
          >
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.25rem' }} />
            เพิ่มการรับประกัน
          </Button>
          {selectedWarranties.length > 0 && (
            <Popconfirm
              title="ยืนยันการลบ"
              description={`คุณต้องการลบรายการการรับประกันจำนวน ${selectedWarranties.length} รายการใช่หรือไม่?`}
              onConfirm={onConfirmDelete}
              okText="ยืนยัน"
              cancelText="ยกเลิก"
              disabled={selectedWarranties.length === 0}
            >
              <Button
                danger
                className="action-btn"
                size="large"
                disabled={selectedWarranties.length === 0}
              >
                <FontAwesomeIcon
                  icon={faTrashCan}
                  style={{ marginRight: '0.25rem' }}
                />
                ลบ
              </Button>
            </Popconfirm>
          )}
        </Col>
      </Row>
      <Row gutter={8} className="action-bar">
        <Col></Col>
      </Row>
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
