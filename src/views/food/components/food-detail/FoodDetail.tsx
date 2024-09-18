import {
  faFloppyDisk,
  faRotateLeft,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import locale from 'antd/lib/date-picker/locale/th_TH';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ThaiDatePicker } from '@components';
import { useBrowserStorage } from '@hooks';
import { Food } from '@models';
import { FoodService } from '@services';
import './FoodDetail.css';

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

const FoodDetail: React.FC = () => {
  const { notification } = App.useApp();
  const { foodId } = useParams();
  const [homeId, setHomeId] = useBrowserStorage(
    'sh-current-homeid',
    null,
    'local',
  );
  const [foodData, setFoodData] = useState<Food>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (foodId) {
      setIsEdit(true);
      FoodService.getFoodById(+foodId, homeId).subscribe({
        next: (food) => {
          setFoodData(food);
          form.setFieldsValue({
            name: food?.name,
            brand: food?.brand,
            quantity: food?.quantity,
            unit: food?.unit,
            buyDate: dayjs(food?.buyDate),
            expiryDate: dayjs(food?.expiryDate),
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
  }, [foodId]);

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
    const formValue: Food = {
      ...values,
      buyDate: values.buyDate.format('YYYY-MM-DD'),
      expiryDate: values.expiryDate.format('YYYY-MM-DD'),
    };
    if (isEdit) {
      FoodService.updateFood(+foodId, formValue, homeId).subscribe({
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
            navigate('/food');
          }, 500);
        },
      });
    } else {
      FoodService.createFood(formValue, homeId).subscribe({
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
            navigate('/food');
          }, 500);
        },
      });
    }
  };

  const onReset = () => {
    if (isEdit) {
      form.setFieldsValue({
        name: foodData.name,
        brand: foodData.brand,
        quantity: foodData.quantity,
        unit: foodData.unit,
        buyDate: dayjs(foodData.buyDate),
        expiryDate: dayjs(foodData.expiryDate),
      });
    } else {
      form.resetFields();
    }
  };

  const onDelete = () => {
    FoodService.deleteFood(+foodId, homeId).subscribe({
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
          navigate('/food');
        }, 500);
      },
    });
  };

  return (
    <>
      <Title level={2}>
        {isEdit ? 'แก้ไขรายการอาหาร' : 'เพิ่มรายการอาหาร'}
      </Title>
      <Card>
        {!isEdit || foodData ? (
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
            <Form.Item name="unit" label="หน่วย" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="buyDate"
              label="วันที่ซื้อ"
              rules={[{ required: true }]}
            >
              <ThaiDatePicker
                locale={locale}
                inputReadOnly={true}
                placeholder="กรุณาเลือกวันที่ซื้อ"
                format="DD MMMM BBBB"
              />
            </Form.Item>
            <Form.Item
              name="expiryDate"
              label="วันหมดอายุ"
              rules={[{ required: true }]}
            >
              <ThaiDatePicker
                locale={locale}
                inputReadOnly={true}
                placeholder="กรุณาเลือกวันหมดอายุ"
                format="DD MMMM BBBB"
              />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Text italic>
                แก้ไขล่าสุดเมื่อ{' '}
                {dayjs(foodData?.updateDate)
                  .locale('th')
                  .format('D MMMM BBBB')}{' '}
                โดย {foodData?.updateBy}
              </Text>
            </Form.Item>
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

export default FoodDetail;
