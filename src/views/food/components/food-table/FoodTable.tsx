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
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useBrowserStorage } from '@hooks';
import { Food, FoodStatus } from '@models';
import { FoodService } from '@services';
import './FoodTable.css';

const { Title } = Typography;

dayjs.extend(buddhistEra);
dayjs.locale('th');

const columns: ColumnsType<Food> = [
  {
    title: 'ชื่อ',
    width: '200px',
    render: (food: Food) => (
      <Link to={{ pathname: `${food.id}` }}>{food.name}</Link>
    ),
  },
  {
    title: 'ยี่ห้อ',
    width: '150px',
    dataIndex: 'brand',
  },
  {
    title: 'สถานะ',
    width: '80px',
    align: 'center',
    render: (food: Food) => {
      if (food.status === FoodStatus.EXPIRED) {
        return <Tag color="red">หมดอายุ</Tag>;
      }
    },
  },
  {
    title: 'จำนวน',
    width: '80px',
    align: 'center',
    dataIndex: 'quantity',
  },
  {
    title: 'หน่วย',
    width: '80px',
    dataIndex: 'unit',
  },
  {
    title: 'วันที่ซื้อ',
    width: '120px',
    render: (food: Food) => (
      <span>{dayjs(food.buyDate).format('DD MMMM BBBB')}</span>
    ),
  },
  {
    title: 'วันหมดอายุ',
    width: '120px',
    render: (food: Food) => (
      <span>{dayjs(food.expiryDate).format('DD MMMM BBBB')}</span>
    ),
  },
];

const FoodTable: React.FC = () => {
  const { notification } = App.useApp();
  const [homeId, setHomeId] = useBrowserStorage(
    'sh-current-homeid',
    null,
    'local',
  );
  const [foodsData, setFoodsData] = useState<Food[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    FoodService.getAllFoods(homeId).subscribe({
      next: (res) => {
        setFoodsData(res);
      },
      error: (err) => onError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง'),
      complete: () => setLoading(false),
    });
  };

  const onSuccess = (successMessage: string) => {
    notification.success({
      message: 'สำเร็จ',
      description: successMessage,
    });
  };

  const onError = (errorMessage: string) => {
    notification.error({
      message: 'เกิดข้อผิดพลาด',
      description: errorMessage,
    });
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Food[]) => {
      setSelectedFoods(selectedRows);
    },

    getCheckboxProps: (record: Food) => ({
      name: record.name,
    }),
  };

  const navigateToCreateFood = () => {
    navigate('new');
  };

  const onConfirmDelete = (e: any) => {
    FoodService.deleteMultipleFoods(
      selectedFoods.map((food) => food.id),
      homeId,
    ).subscribe({
      next: () => {
        setSelectedFoods([]);
        loadData();
        onSuccess('ลบข้อมูลสำเร็จ');
      },
      error: (err) => onError('ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง'),
      complete: () => {},
    });
  };

  return (
    <>
      <Title level={2}>อาหาร</Title>
      <Row gutter={8} className="action-bar">
        <Col>
          <Button
            type="primary"
            className="action-btn"
            size="large"
            onClick={navigateToCreateFood}
          >
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.25rem' }} />
            เพิ่มอาหาร
          </Button>
          {selectedFoods.length > 0 && (
            <Popconfirm
              title="ยืนยันการลบ"
              description={`คุณต้องการลบรายการอาหารจำนวน ${selectedFoods.length} รายการใช่หรือไม่?`}
              onConfirm={onConfirmDelete}
              okText="ยืนยัน"
              cancelText="ยกเลิก"
              disabled={selectedFoods.length === 0}
            >
              <Button
                danger
                className="action-btn"
                size="large"
                disabled={selectedFoods.length === 0}
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
          dataSource={foodsData}
          rowKey={(food) => food.id}
          loading={loading}
          scroll={{ x: 576, y: '60vh' }}
        />
      </Card>
    </>
  );
};

export default FoodTable;
