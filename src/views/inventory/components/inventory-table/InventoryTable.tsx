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
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { RootState } from '@config';
import { Inventory, InventoryStatus } from '@models';
import { InventoryService } from '@services';
import './InventoryTable.css';

const { Title } = Typography;

const columns: ColumnsType<Inventory> = [
  {
    title: 'ชื่อ',
    width: '200px',
    render: (inventory: Inventory) => (
      <Link to={{ pathname: `${inventory.id}` }}>{inventory.name}</Link>
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
    width: '80px',
    align: 'center',
    render: (inventory: Inventory) => (
      <>
        {inventory.quantity} / {inventory.maxQuantity}
      </>
    ),
  },
  {
    title: 'หน่วย',
    width: '80px',
    dataIndex: 'unit',
  },
  {
    title: 'วันที่เติมครั้งล่าสุด',
    width: '120px',
    render: (inventory: Inventory) => (
      <span>
        {inventory.restockDate
          ? dayjs(inventory.restockDate).format('DD MMMM BBBB')
          : '-'}
      </span>
    ),
  },
];

const InventoryTable: React.FC = () => {
  const { notification } = App.useApp();
  const homeId = useSelector((state: RootState) => state.home.id);
  const [inventoriesData, setInventoriesData] = useState<Inventory[]>([]);
  const [selectedInventories, setSelectedInventories] = useState<Inventory[]>(
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

  const fetchInventoryData = useCallback(() => {
    setLoading(true);
    InventoryService.getAllInventories(homeId).subscribe({
      next: (response) => {
        setInventoriesData(response);
      },
      error: () => onError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง'),
      complete: () => setLoading(false),
    });
  }, [homeId, onError]);

  useEffect(() => {
    fetchInventoryData();
  }, [fetchInventoryData]);

  const rowSelection = {
    onChange: (_: React.Key[], selectedRows: Inventory[]) => {
      setSelectedInventories(selectedRows);
    },

    getCheckboxProps: (record: Inventory) => ({
      name: record.name,
    }),
  };

  const navigateToCreateInventory = () => {
    navigate('new');
  };

  const onConfirmDelete = () => {
    InventoryService.deleteMultipleInventories(
      selectedInventories.map((inventory) => inventory.id),
      homeId,
    ).subscribe({
      next: () => {
        setSelectedInventories([]);
        fetchInventoryData();
      },
      error: () => onError('ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง'),
    });
  };

  return (
    <>
      <Title level={2}>ของใช้ในบ้าน</Title>
      <Row gutter={8} className="action-bar">
        <Col>
          <Button
            type="primary"
            className="action-btn"
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
              <Button danger className="action-btn">
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
          dataSource={inventoriesData}
          rowKey={(inventory) => inventory.id}
          loading={loading}
          scroll={{ x: 576, y: '60vh' }}
        />
      </Card>
    </>
  );
};

export default InventoryTable;
