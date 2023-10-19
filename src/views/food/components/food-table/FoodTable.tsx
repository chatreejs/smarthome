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

import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Food, FoodStatus } from '../..';
import DeleteMultipleFood from '../../api/DeleteMultipleFood';
import SearchFood from '../../api/SearchFood';
import './FoodTable.css';

const { Title } = Typography;

const columns: ColumnsType<Food> = [
  {
    title: 'ชื่อ',
    render: (food: Food) => (
      <Link to={{ pathname: `${food.id}` }}>{food.name}</Link>
    ),
  },
  {
    title: 'สถานะ',
    render: (food: Food) => {
      if (food.status === FoodStatus.EXPIRED) {
        return <Tag color="red">หมดอายุ</Tag>;
      }
    },
  },
  {
    title: 'จำนวน',
    dataIndex: 'quantity',
  },
  {
    title: 'หน่วย',
    dataIndex: 'unit',
  },
  {
    title: 'วันที่ซื้อ',
    render: (food: Food) => (
      <span>{moment(food.buyDate).locale('th').format('DD MMMM yyyy')}</span>
    ),
  },
  {
    title: 'วันหมดอายุ',
    render: (food: Food) => (
      <span>{moment(food.expiryDate).locale('th').format('DD MMMM yyyy')}</span>
    ),
  },
];

const FoodTable = () => {
  const [foodData, setFoodData] = useState<Food[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  // const handleDelete = useCallback(() => {}, []);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      const food = await SearchFood();
      setFoodData(food);
      setLoading(false);
    } catch (err) {
      console.log(err);
      onError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  const onError = (errorMessage: string) => {
    api.error({
      message: `เกิดข้อผิดพลาด`,
      description: errorMessage,
    });
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const onConfirmDelete = async (e: any) => {
    try {
      await DeleteMultipleFood(selectedFoods.map((food) => food.id));
      setSelectedFoods([]);
      loadData();
    } catch (err) {
      console.log(err);
      onError('ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <>
      {contextHolder}
      <Title level={2}>รายการอาหาร</Title>
      <Row gutter={8} className="action-bar">
        <Col>
          <Button
            type="primary"
            className="action-btn"
            onClick={navigateToCreateFood}
          >
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.25rem' }} />
            เพิ่มอาหาร
          </Button>
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
              disabled={selectedFoods.length === 0}
            >
              <FontAwesomeIcon
                icon={faTrashCan}
                style={{ marginRight: '0.25rem' }}
              />
              ลบ
            </Button>
          </Popconfirm>
        </Col>
      </Row>
      <Row gutter={8} className="action-bar">
        <Col></Col>
      </Row>
      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={columns}
        dataSource={foodData}
        loading={loading}
      />
    </>
  );
};

export default FoodTable;
