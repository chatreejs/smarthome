import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Col,
  Popconfirm,
  Row,
  Table,
  Tag,
  Typography,
  notification,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  DeleteMultipleWarranty,
  SearchWarranty,
  Warranty,
  WarrantyStatus,
} from '../..';
import './WarrantyTable.css';

const { Title } = Typography;

const columns: ColumnsType<Warranty> = [
  {
    title: 'ชื่อสินค้า',
    render: (warranty: Warranty) => (
      <Link to={{ pathname: `${warranty.id}` }}>{warranty.productName}</Link>
    ),
  },
  {
    title: 'สถานะ',
    width: '10%',
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
    width: '10%',
    dataIndex: 'brand',
  },

  {
    title: 'รุ่น',
    width: '10%',
    dataIndex: 'model',
  },
  {
    title: 'Serial No.',
    width: '10%',
    dataIndex: 'serialNumber',
  },
  {
    title: 'วันที่ซื้อ',
    width: '15%',
    render: (warranty: Warranty) => (
      <span>{dayjs(warranty.purchaseDate).format('DD MMMM BBBB')}</span>
    ),
  },
  {
    title: 'วันหมดประกัน',
    width: '15%',
    render: (warranty: Warranty) => (
      <span>{dayjs(warranty.warrantyDate).format('DD MMMM BBBB')}</span>
    ),
  },
];

const WarrantyTable = () => {
  const [warrantiesData, setWarrantiesData] = useState<Warranty[]>([]);
  const [selectedWarranties, setSelectedWarranties] = useState<Warranty[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      const warranties = await SearchWarranty();
      setWarrantiesData(warranties);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onError = (errorMessage: string) => {
    api.error({
      message: 'เกิดข้อผิดพลาด',
      description: errorMessage,
    });
    setLoading(false);
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

  const onConfirmDelete = async (e: any) => {
    try {
      await DeleteMultipleWarranty(
        selectedWarranties.map((warranty) => warranty.id),
      );
      setSelectedWarranties([]);
      loadData();
    } catch (err) {
      console.log(err);
      onError('ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <>
      {contextHolder}
      <Title level={2}>รายการการรับประกัน</Title>
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
      <Table
        rowSelection={{
          type: 'checkbox',
          columnWidth: '5%',
          ...rowSelection,
        }}
        columns={columns}
        dataSource={warrantiesData}
        loading={loading}
        scroll={{ x: 576, y: '45vh' }}
      />
    </>
  );
};

export default WarrantyTable;
