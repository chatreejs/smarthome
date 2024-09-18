import {
  App,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Skeleton,
  Typography,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  faFloppyDisk,
  faRotateLeft,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import locale from 'antd/lib/date-picker/locale/th_TH';
import dayjs from 'dayjs';

import { ThaiDatePicker } from '@components';
import { useBrowserStorage } from '@hooks';
import { Inventory } from '@models';
import { InventoryService } from '@services';

const { Title, Text } = Typography;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },

  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const validateMessages = {
  required: 'กรุณากรอก${label}',
};

const InventoryDetail: React.FC = () => {
  const { notification } = App.useApp();
  const { inventoryId } = useParams();
  const [homeId] = useBrowserStorage('sh-current-homeid', null, 'local');
  const [inventoryData, setInventoryData] = useState<Inventory>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchInventoryData = useCallback(() => {
    if (inventoryId) {
      setIsEdit(true);
      InventoryService.getInventoryById(+inventoryId, homeId).subscribe({
        next: (inventory) => {
          setInventoryData(inventory);
          form.setFieldsValue({
            name: inventory?.name,
            brand: inventory?.brand,
            quantity: inventory?.quantity,
            maxQuantity: inventory?.maxQuantity,
            unit: inventory?.unit,
            restockDate: dayjs(inventory?.restockDate),
          });
        },
        error: (err) => {
          const status = err.response?.status;
          if (status === 404) {
            notification.error({
              message: 'เกิดข้อผิดพลาด',
              description: 'ไม่พบข้อมูล',
            });
          }
        },
      });
    }
  }, [inventoryId, homeId, form, notification]);

  useEffect(() => {
    fetchInventoryData();
  }, [fetchInventoryData]);

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

  const onFinish = (values: any) => {
    const formValue: Inventory = {
      ...values,
      restockDate: values.restockDate.format('YYYY-MM-DD'),
    };
    if (isEdit) {
      InventoryService.updateInventory(
        +inventoryId,
        homeId,
        formValue,
      ).subscribe({
        next: (res) => {
          onSuccess('แก้ไขข้อมูลสำเร็จ');
        },
        error: (err) => {
          const status = err.response?.status;
          if (status === 400) {
            onError('ข้อมูลไม่ถูกต้อง');
          }
          if (status === 500) {
            onError('เกิดข้อผิดพลาดบนเซิร์ฟเวอร์');
          }
        },
        complete: () => {
          setTimeout(() => {
            navigate('/inventory');
          }, 500);
        },
      });
    } else {
      InventoryService.createInventory(formValue, homeId).subscribe({
        next: (res) => {
          onSuccess('เพิ่มข้อมูลสำเร็จ');
        },
        error: (err) => {
          const status = err.response?.status;
          if (status === 400) {
            onError('ข้อมูลไม่ถูกต้อง');
          }
          if (status === 500) {
            onError('เกิดข้อผิดพลาดบนเซิร์ฟเวอร์');
          }
        },
        complete: () => {
          setTimeout(() => {
            navigate('/inventory');
          }, 500);
        },
      });
    }
  };

  const onReset = () => {
    if (isEdit) {
      form.setFieldsValue({
        name: inventoryData.name,
        brand: inventoryData.brand,
        quantity: inventoryData.quantity,
        maxQuantity: inventoryData.maxQuantity,
        unit: inventoryData.unit,
        restockDate: dayjs(inventoryData.restockDate),
      });
    } else {
      form.resetFields();
    }
  };

  const onDelete = () => {
    InventoryService.deleteInventory(+inventoryId, homeId).subscribe({
      next: (res) => {
        onSuccess('ลบข้อมูลสำเร็จ');
      },
      error: (err) => {
        const status = err.response?.status;
        if (status === 404) {
          onError('ไม่พบข้อมูล');
        }
        if (status === 500) {
          onError('เกิดข้อผิดพลาดบนเซิร์ฟเวอร์');
        }
      },
      complete: () => {
        setTimeout(() => {
          navigate('/inventory');
        }, 500);
      },
    });
  };

  return (
    <>
      <Title level={2}>
        {isEdit ? 'แก้ไขรายการของใช้ในบ้าน' : 'เพิ่มรายการของใช้ในบ้าน'}
      </Title>
      <Card>
        {!isEdit || inventoryData ? (
          <Form
            {...formItemLayout}
            form={form}
            validateMessages={validateMessages}
            name="food-detail-form"
            onFinish={onFinish}
            style={{ maxWidth: 576 }}
          >
            <Form.Item name="name" label="ชื่อ" rules={[{ required: true }]}>
              <Input data-testid="name-input" />
            </Form.Item>
            <Form.Item name="brand" label="ยี่ห้อ" rules={[{ required: true }]}>
              <Input data-testid="name-brand" />
            </Form.Item>
            <Form.Item
              name="quantity"
              label="จำนวน"
              rules={[{ required: true }]}
            >
              <InputNumber data-testid="quantity-input" />
            </Form.Item>
            <Form.Item
              name="maxQuantity"
              label="จำนวนสูงสุด"
              rules={[{ required: true }]}
            >
              <InputNumber data-testid="max-quantity-input" />
            </Form.Item>
            <Form.Item name="unit" label="หน่วย" rules={[{ required: true }]}>
              <Input data-testid="unit-input" />
            </Form.Item>
            <Form.Item
              name="restockDate"
              label="วันที่เติมสินค้า"
              rules={[{ required: true }]}
            >
              <ThaiDatePicker
                data-testid="restock-date-input"
                locale={locale}
                inputReadOnly={true}
                placeholder="กรุณาเลือกวันหมดอายุ"
                format="DD MMMM BBBB"
              />
            </Form.Item>
            {isEdit && (
              <Form.Item {...tailLayout}>
                <Text italic>
                  แก้ไขล่าสุดเมื่อ{' '}
                  {dayjs(inventoryData?.updateDate)
                    .locale('th')
                    .format('D MMMM BBBB')}{' '}
                  โดย {inventoryData?.updateBy}
                </Text>
              </Form.Item>
            )}
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                <FontAwesomeIcon icon={faFloppyDisk} />
                บันทึก
              </Button>
              <Button htmlType="button" onClick={onReset}>
                <FontAwesomeIcon icon={faRotateLeft} />
                ล้างข้อมูล
              </Button>
              {isEdit && (
                <Button danger htmlType="button" onClick={onDelete}>
                  <FontAwesomeIcon icon={faTrashCan} />
                  ลบ
                </Button>
              )}
            </Form.Item>
          </Form>
        ) : (
          <Skeleton active />
        )}
      </Card>
    </>
  );
};

export default InventoryDetail;
