import { Button, Form, Input, Skeleton, Typography, notification } from 'antd';
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
  CreateWarranty,
  DeleteWarrantyById,
  GetWarrantyById,
  UpdateWarranty,
  Warranty,
} from '../..';
import './WarrantyDetail.css';

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

const WarrantyDetail: React.FC = () => {
  const { warrantyId } = useParams();
  const [warrantyData, setWarrantyData] = useState<Warranty>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (warrantyId) {
      setIsEdit(true);
      GetWarrantyById(+warrantyId)
        .then((warranty) => {
          setWarrantyData(warranty);
          form.setFieldsValue({
            brand: warranty?.brand,
            productName: warranty?.productName,
            productNumber: warranty?.productNumber,
            model: warranty?.model,
            serialNumber: warranty?.serialNumber,
            purchaseDate: dayjs(warranty?.purchaseDate),
            warrantyDate: dayjs(warranty?.warrantyDate),
          });
        })
        .catch((err: AxiosError) => {
          const status = err.response?.status;
          if (status === 404) {
            onError('ไม่พบข้อมูล');
            setTimeout(() => {
              navigate('/warranty');
            }, 2000);
          }
          if (status === 500) {
            onError('เกิดข้อผิดพลาดบนเซิร์ฟเวอร์');
            setTimeout(() => {
              navigate('/warranty');
            }, 2000);
          }
        });
    }
  }, [warrantyId]);

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
      productNumber: values.productNumber ?? '-',
      purchaseDate: values.purchaseDate.format('YYYY-MM-DD'),
      warrantyDate: values.warrantyDate.format('YYYY-MM-DD'),
    };
    if (isEdit) {
      UpdateWarranty(+warrantyId, formValue)
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
            navigate('/warranty');
          }, 2000);
        });
    } else {
      CreateWarranty(formValue)
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
            navigate('/warranty');
          }, 2000);
        });
    }
  };

  const onReset = () => {
    if (isEdit) {
      form.setFieldsValue({
        brand: warrantyData.brand,
        productName: warrantyData.productName,
        productNumber: warrantyData.productNumber,
        model: warrantyData.model,
        serialNumber: warrantyData.serialNumber,
        purchaseDate: dayjs(warrantyData.purchaseDate),
        warrantyDate: dayjs(warrantyData.warrantyDate),
      });
    } else {
      form.resetFields();
    }
  };

  const onDelete = () => {
    DeleteWarrantyById(+warrantyId)
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
          navigate('/warranty');
        }, 2000);
      });
  };

  return (
    <>
      {contextHolder}
      <Title level={2}>
        {isEdit ? 'แก้ไขรายการการรับประกัน' : 'เพิ่มรายการการรับประกัน'}
      </Title>
      {!isEdit || warrantyData ? (
        <Form
          {...formItemLayout}
          form={form}
          name="warranty-detail-form"
          onFinish={onFinish}
          style={{ maxWidth: 576 }}
        >
          <Form.Item name="brand" label="ยี่ห้อ" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="productName"
            label="ชื่อสินค้า"
            rules={[{ required: true }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item name="productNumber" label="รหัสสินค้า">
            <Input size="large" />
          </Form.Item>
          <Form.Item name="model" label="รุ่น" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="serialNumber"
            label="Serial No."
            rules={[{ required: true }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="purchaseDate"
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
            name="warrantyDate"
            label="วันหมดประกัน"
            rules={[{ required: true }]}
          >
            <ThaiDatePicker
              locale={locale}
              size="large"
              inputReadOnly={true}
              placeholder="กรุณาเลือกวันหมดประกัน"
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

export default WarrantyDetail;
