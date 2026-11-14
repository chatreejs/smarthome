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
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { ThaiDatePicker } from '@components';
import { RootState } from '@config';
import { Waterworks, WaterworksRequest } from '@interfaces';
import { WaterworksService } from '@services';
import { FORBIDDEN_MESSAGE } from '@utils';
import './WaterworksDetail.css';

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

interface WaterworksForm {
  invoiceNumber: string;
  invoiceDate: dayjs.Dayjs;
  rawWaterUsage: number;
  waterUsage: number;
  serviceCharge: number;
  vat: number;
  total: number;
}

const toFormValues = (waterworks: Waterworks): WaterworksForm => ({
  invoiceNumber: waterworks.invoiceNumber,
  invoiceDate: dayjs(waterworks.invoiceDate),
  rawWaterUsage: waterworks.rawWaterUsage,
  waterUsage: waterworks.waterUsage,
  serviceCharge: waterworks.serviceCharge,
  vat: waterworks.vat,
  total: waterworks.total,
});

const WaterworksDetail: React.FC = () => {
  const { notification } = App.useApp();
  const { waterworksId } = useParams();
  const homeId = useSelector((state: RootState) => state.home.id);
  const [waterworksData, setWaterworksData] = useState<Waterworks>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [form] = Form.useForm<WaterworksForm>();
  const navigate = useNavigate();

  const onSuccess = (successMessage: string) => {
    notification.success({
      message: 'สำเร็จ',
      description: successMessage,
    });
  };

  const onError = useCallback(
    (errorMessage: string) => {
      notification.error({
        message: 'เกิดข้อผิดพลาด',
        description: errorMessage,
      });
    },
    [notification],
  );

  const fetchWaterworksData = useCallback(() => {
    if (waterworksId) {
      setIsEdit(true);
      WaterworksService.getWaterworksById(+waterworksId, homeId).subscribe({
        next: (waterworks) => {
          setWaterworksData(waterworks);
          form.setFieldsValue(toFormValues(waterworks));
        },
        error: (err: AxiosError<unknown>) => {
          const status = err.response?.status;
          if (status === 403) {
            onError(FORBIDDEN_MESSAGE);
          }
          if (status === 404) {
            onError('ไม่พบข้อมูล');
          }
          if (status === 500) {
            onError('เกิดข้อผิดพลาดบนเซิร์ฟเวอร์');
          }
          setTimeout(() => {
            navigate('/waterworks');
          }, 500);
        },
      });
    }
  }, [waterworksId, homeId, onError, form, navigate]);

  useEffect(() => {
    fetchWaterworksData();
  }, [fetchWaterworksData]);

  const onSaveError = (err: AxiosError<unknown>) => {
    const status = err.response?.status;
    if (status === 400) {
      onError('ข้อมูลไม่ถูกต้อง');
    }
    if (status === 403) {
      onError(FORBIDDEN_MESSAGE);
    }
    if (status === 404) {
      onError('ไม่พบข้อมูล');
    }
    if (status === 500) {
      onError('เกิดข้อผิดพลาดบนเซิร์ฟเวอร์');
    }
  };

  const backToSummary = () => {
    setTimeout(() => {
      navigate('/waterworks');
    }, 500);
  };

  const onFinish = (values: WaterworksForm) => {
    const request: WaterworksRequest = {
      ...values,
      invoiceDate: values.invoiceDate.format('YYYY-MM-DD'),
    };
    if (isEdit) {
      WaterworksService.updateWaterworks(
        +waterworksId!,
        request,
        homeId,
      ).subscribe({
        next: () => onSuccess('แก้ไขข้อมูลสำเร็จ'),
        error: onSaveError,
        complete: backToSummary,
      });
    } else {
      WaterworksService.createWaterworks(request, homeId).subscribe({
        next: () => onSuccess('เพิ่มข้อมูลสำเร็จ'),
        error: onSaveError,
        complete: backToSummary,
      });
    }
  };

  const onReset = () => {
    if (isEdit && waterworksData) {
      form.setFieldsValue(toFormValues(waterworksData));
    } else {
      form.resetFields();
    }
  };

  const onDelete = () => {
    WaterworksService.deleteWaterworks(+waterworksId!, homeId).subscribe({
      next: () => onSuccess('ลบข้อมูลสำเร็จ'),
      error: onSaveError,
      complete: backToSummary,
    });
  };

  return (
    <>
      <Title level={2}>{isEdit ? 'แก้ไขบิลค่าน้ำ' : 'เพิ่มบิลค่าน้ำ'}</Title>
      <Card>
        {!isEdit || waterworksData ? (
          <Form
            {...formItemLayout}
            form={form}
            validateMessages={validateMessages}
            name="waterworks-detail-form"
            onFinish={onFinish}
            style={{ maxWidth: 576 }}
          >
            <Form.Item
              name="invoiceNumber"
              label="เลขที่ใบแจ้งหนี้"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="invoiceDate"
              label="วันที่ใบแจ้งหนี้"
              rules={[{ required: true }]}
            >
              <ThaiDatePicker
                locale={locale}
                inputReadOnly={true}
                placeholder="กรุณาเลือกวันที่ใบแจ้งหนี้"
                format="DD MMMM BBBB"
              />
            </Form.Item>
            <Form.Item
              name="rawWaterUsage"
              label="น้ำดิบที่ใช้ (ลบ.ม.)"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} precision={0} />
            </Form.Item>
            <Form.Item
              name="waterUsage"
              label="น้ำที่ใช้ (ลบ.ม.)"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} precision={0} />
            </Form.Item>
            <Form.Item
              name="serviceCharge"
              label="ค่าบริการ (บาท)"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} precision={2} />
            </Form.Item>
            <Form.Item
              name="vat"
              label="ภาษีมูลค่าเพิ่ม (บาท)"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} precision={2} />
            </Form.Item>
            <Form.Item
              name="total"
              label="ยอดรวม (บาท)"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} precision={2} />
            </Form.Item>
            {isEdit && (
              <Form.Item {...tailLayout}>
                <Text italic>
                  แก้ไขล่าสุดเมื่อ{' '}
                  {dayjs(waterworksData?.updateDate)
                    .locale('th')
                    .format('D MMMM BBBB')}{' '}
                  โดย {waterworksData?.updateBy}
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

export default WaterworksDetail;
