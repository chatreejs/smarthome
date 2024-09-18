import {
  faFloppyDisk,
  faRotateLeft,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { App, Button, Card, Form, Input, Skeleton, Typography } from 'antd';
import locale from 'antd/lib/date-picker/locale/th_TH';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ThaiDatePicker } from '@components';
import { Warranty } from '@models';
import { WarrantyService } from '@services';
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
  const { notification } = App.useApp();
  const { warrantyId } = useParams();
  const [warrantyData, setWarrantyData] = useState<Warranty>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (warrantyId) {
      setIsEdit(true);
      WarrantyService.getWarrantyById(+warrantyId).subscribe({
        next: (warranty) => {
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
        },
        error: (err) => {
          const status = err.response?.status;
          if (status === 404) {
            onError('ไม่พบข้อมูล');
            setTimeout(() => {
              navigate('/warranty');
            }, 500);
          }
          if (status === 500) {
            onError('เกิดข้อผิดพลาดบนเซิร์ฟเวอร์');
            setTimeout(() => {
              navigate('/warranty');
            }, 500);
          }
        },
      });
    }
  }, [warrantyId]);

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
    const formValue: Warranty = {
      ...values,
      productNumber: values.productNumber ?? '-',
      purchaseDate: values.purchaseDate.format('YYYY-MM-DD'),
      warrantyDate: values.warrantyDate.format('YYYY-MM-DD'),
    };
    if (isEdit) {
      WarrantyService.updateWarranty(+warrantyId, formValue).subscribe({
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
            navigate('/warranty');
          }, 500);
        },
      });
    } else {
      WarrantyService.createWarranty(formValue).subscribe({
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
            navigate('/warranty');
          }, 500);
        },
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
    WarrantyService.deleteWarranty(+warrantyId).subscribe({
      next: (res) => {
        onSuccess('ลบข้อมูลสำเร็จ');
      },
      error: (err) => {
        const status = err.response?.status;
        if (status === 500) {
          onError('เกิดข้อผิดพลาดบนเซิร์ฟเวอร์');
        }
      },
      complete: () => {
        setTimeout(() => {
          navigate('/warranty');
        }, 500);
      },
    });
  };

  return (
    <>
      <Title level={2}>
        {isEdit ? 'แก้ไขรายการการรับประกัน' : 'เพิ่มรายการการรับประกัน'}
      </Title>
      <Card>
        {!isEdit || warrantyData ? (
          <Form
            {...formItemLayout}
            form={form}
            name="warranty-detail-form"
            onFinish={onFinish}
            style={{ maxWidth: 576 }}
          >
            <Form.Item name="brand" label="ยี่ห้อ" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="productName"
              label="ชื่อสินค้า"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="productNumber" label="รหัสสินค้า">
              <Input />
            </Form.Item>
            <Form.Item name="model" label="รุ่น" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="serialNumber"
              label="Serial No."
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="purchaseDate"
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
              name="warrantyDate"
              label="วันหมดประกัน"
              rules={[{ required: true }]}
            >
              <ThaiDatePicker
                locale={locale}
                inputReadOnly={true}
                placeholder="กรุณาเลือกวันหมดประกัน"
                format="DD MMMM BBBB"
              />
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

export default WarrantyDetail;
