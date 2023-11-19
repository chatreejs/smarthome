import {
  Button,
  Form,
  Input,
  InputNumber,
  Skeleton,
  Typography,
  notification,
} from 'antd';
import locale from 'antd/es/date-picker/locale/th_TH';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ThaiDatePicker } from '@components';
import {
  faFloppyDisk,
  faRotateLeft,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  CreateFood,
  DeleteFoodById,
  Food,
  GetFoodById,
  UpdateFood,
} from '../..';
import './FoodDetail.css';

const { Title } = Typography;

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

const FoodDetail = () => {
  const { foodId } = useParams();
  const [foodData, setFoodData] = useState<Food>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (foodId) {
      setIsEdit(true);
      GetFoodById(+foodId)
        .then((food) => {
          setFoodData(food);
          form.setFieldsValue({
            name: food?.name,
            quantity: food?.quantity,
            unit: food?.unit,
            buyDate: dayjs(food?.buyDate),
            expiryDate: dayjs(food?.expiryDate),
          });
        })
        .catch((err: AxiosError) => {
          const status = err.response?.status;
          if (status === 404) {
            onError('ไม่พบข้อมูล');
            setTimeout(() => {
              navigate('/food');
            }, 2000);
          }
          if (status === 500) {
            onError('เกิดข้อผิดพลาดบนเซิร์ฟเวอร์');
            setTimeout(() => {
              navigate('/food');
            }, 2000);
          }
        });
    }
  }, [foodId]);

  const onSuccess = (successMessage: string) => {
    api.success({
      message: 'สำเร็จ',
      description: successMessage,
    });
  };

  const onError = (errorMessage: string) => {
    api.error({
      message: 'เกิดข้อผิดพลาด',
      description: errorMessage,
    });
  };

  const onFinish = (values: any) => {
    const formValue = {
      ...values,
      buyDate: values.buyDate.format('YYYY-MM-DD'),
      expiryDate: values.expiryDate.format('YYYY-MM-DD'),
    };
    if (isEdit) {
      UpdateFood(+foodId, formValue)
        .then((res) => {
          onSuccess('แก้ไขข้อมูลสำเร็จ');
        })
        .catch((err: AxiosError) => {
          const status = err.response?.status;
          if (status === 400) {
            onError('ข้อมูลไม่ถูกต้อง');
          }
          if (status === 500) {
            onError('เกิดข้อผิดพลาดบนเซิร์ฟเวอร์');
          }
        })
        .then(() => {
          setTimeout(() => {
            navigate('/food');
          }, 2000);
        });
    } else {
      CreateFood(formValue)
        .then((res) => {
          onSuccess('เพิ่มข้อมูลสำเร็จ');
        })
        .catch((err: AxiosError) => {
          const status = err.response?.status;
          if (status === 400) {
            onError('ข้อมูลไม่ถูกต้อง');
          }
          if (status === 500) {
            onError('เกิดข้อผิดพลาดบนเซิร์ฟเวอร์');
          }
        })
        .then(() => {
          setTimeout(() => {
            navigate('/food');
          }, 2000);
        });
    }
  };

  const onReset = () => {
    if (isEdit) {
      form.setFieldsValue({
        name: foodData.name,
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
    DeleteFoodById(+foodId)
      .then((res) => {
        onSuccess('ลบข้อมูลสำเร็จ');
      })
      .catch((err: AxiosError) => {
        const status = err.response?.status;
        if (status === 500) {
          onError('เกิดข้อผิดพลาดบนเซิร์ฟเวอร์');
        }
      })
      .then(() => {
        setTimeout(() => {
          navigate('/food');
        }, 2000);
      });
  };

  return (
    <>
      {contextHolder}
      <Title level={2}>
        {isEdit ? 'แก้ไขรายการอาหาร' : 'เพิ่มรายการอาหาร'}
      </Title>
      {!isEdit || foodData ? (
        <Form
          {...formItemLayout}
          form={form}
          name="food-detail-form"
          onFinish={onFinish}
          style={{ maxWidth: 576 }}
        >
          <Form.Item name="name" label="ชื่อ" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item name="quantity" label="จำนวน" rules={[{ required: true }]}>
            <InputNumber size="large" />
          </Form.Item>
          <Form.Item name="unit" label="หน่วย" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="buyDate"
            label="วันที่ซื้อ"
            rules={[{ required: true }]}
          >
            <ThaiDatePicker
              locale={locale}
              size="large"
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
              size="large"
              inputReadOnly={true}
              placeholder="กรุณาเลือกวันหมดอายุ"
              format="DD MMMM BBBB"
            />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" size="large" htmlType="submit">
              <FontAwesomeIcon icon={faFloppyDisk} />
              บันทึก
            </Button>
            <Button size="large" htmlType="button" onClick={onReset}>
              <FontAwesomeIcon icon={faRotateLeft} />
              ล้างข้อมูล
            </Button>
            {isEdit && (
              <Button danger size="large" htmlType="button" onClick={onDelete}>
                <FontAwesomeIcon icon={faTrashCan} />
                ลบ
              </Button>
            )}
          </Form.Item>
        </Form>
      ) : (
        <Skeleton active />
      )}
    </>
  );
};

export default FoodDetail;
