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
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  DeleteMultipleInventory,
  Inventory,
  InventoryStatus,
  SearchInventory,
} from '../..';
import './InventoryTable.css';

const { Title } = Typography;

const columns: ColumnsType<Inventory> = [
  {
    title: 'ชื่อ',
    render: (inventory: Inventory) => (
      <Link to={{ pathname: `${inventory.id}` }}>{inventory.name}</Link>
    ),
  },
  {
    title: 'สถานะ',
    width: '15%',
    align: 'center',
    render: (inventory: Inventory) => {
      if (inventory.status === InventoryStatus.OUT_OF_STOCK) {
        return <Tag color="red">หมด</Tag>;
      } else if (inventory.status === InventoryStatus.LOW_STOCK) {
        return <Tag color="orange">เหลือน้อย</Tag>;
      }
    },
  },
  {
    title: 'จำนวน',
    width: '15%',
    align: 'center',
    render: (inventory: Inventory) => (
      <>
        {inventory.quantity} / {inventory.maxQuantity}
      </>
    ),
  },
  {
    title: 'หน่วย',
    width: '15%',
    dataIndex: 'unit',
  },
];

const InventoryTable = () => {
  const [inventoriesData, setInventoriesData] = useState<Inventory[]>([]);
  const [selectedInventories, setSelectedInventories] = useState<Inventory[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      const inventories = await SearchInventory();
      setInventoriesData(inventories);
      setLoading(false);
    } catch (err) {
      console.log(err);
      onError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
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
    onChange: (selectedRowKeys: React.Key[], selectedRows: Inventory[]) => {
      setSelectedInventories(selectedRows);
    },

    getCheckboxProps: (record: Inventory) => ({
      name: record.name,
    }),
  };

  const navigateToCreateInventory = () => {
    navigate('new');
  };

  const onConfirmDelete = async (e: any) => {
    try {
      await DeleteMultipleInventory(
        selectedInventories.map((inventory) => inventory.id),
      );
      setSelectedInventories([]);
      loadData();
    } catch (err) {
      console.log(err);
      onError('ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <>
      {contextHolder}
      <Title level={2}>รายการของใช้ในบ้าน</Title>
      <Row gutter={8} className="action-bar">
        <Col>
          <Button
            type="primary"
            className="action-btn"
            size="large"
            onClick={navigateToCreateInventory}
          >
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.25rem' }} />
            เพิ่มของใช้ในบ้าน
          </Button>
          {selectedInventories.length > 0 && (
            <Popconfirm
              title="ยืนยันการลบ"
              description={`คุณต้องการลบรายการของใช้ในบ้านจำนวน ${selectedInventories.length} รายการใช่หรือไม่?`}
              onConfirm={onConfirmDelete}
              okText="ยืนยัน"
              cancelText="ยกเลิก"
            >
              <Button danger className="action-btn" size="large">
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
        dataSource={inventoriesData}
        loading={loading}
        scroll={{ x: 576, y: '45vh' }}
      />
    </>
  );
};

export default InventoryTable;
