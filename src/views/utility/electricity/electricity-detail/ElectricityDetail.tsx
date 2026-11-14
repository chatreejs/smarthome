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
import { Electricity, ElectricityRequest } from '@interfaces';
import { ElectricityService } from '@services';
import { FORBIDDEN_MESSAGE } from '@utils';
import './ElectricityDetail.css';

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

interface ElectricityForm {
  invoiceNumber: string;
  invoiceDate: dayjs.Dayjs;
  usage: number;
  ftRate: number;
  electricityPrice: number;
  serviceCharge: number;
  ft: number;
  vat: number;
  total: number;
}

const toFormValues = (electricity: Electricity): ElectricityForm => ({
  invoiceNumber: electricity.invoiceNumber,
  invoiceDate: dayjs(electricity.invoiceDate),
  usage: electricity.usage,
  ftRate: electricity.ftRate,
  electricityPrice: electricity.electricityPrice,
  serviceCharge: electricity.serviceCharge,
  ft: electricity.ft,
  vat: electricity.vat,
  total: electricity.total,
});

const ElectricityDetail: React.FC = () => {
  const { notification } = App.useApp();
  const { electricityId } = useParams();
  const homeId = useSelector((state: RootState) => state.home.id);
  const [electricityData, setElectricityData] = useState<Electricity>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [form] = Form.useForm<ElectricityForm>();
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

  const fetchElectricityData = useCallback(() => {
    if (electricityId) {
      setIsEdit(true);
      ElectricityService.getElectricityById(+electricityId, homeId).subscribe({
        next: (electricity) => {
          setElectricityData(electricity);
          form.setFieldsValue(toFormValues(electricity));
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
            navigate('/electricity');
          }, 500);
        },
      });
    }
  }, [electricityId, homeId, onError, form, navigate]);

  useEffect(() => {
    fetchElectricityData();
  }, [fetchElectricityData]);

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
      navigate('/electricity');
    }, 500);
  };

  const onFinish = (values: ElectricityForm) => {
    const request: ElectricityRequest = {
      ...values,
      invoiceDate: values.invoiceDate.format('YYYY-MM-DD'),
    };
    if (isEdit) {
      ElectricityService.updateElectricity(
        +electricityId!,
        request,
        homeId,
      ).subscribe({
        next: () => onSuccess('แก้ไขข้อมูลสำเร็จ'),
        error: onSaveError,
        complete: backToSummary,
      });
    } else {
      ElectricityService.createElectricity(request, homeId).subscribe({
        next: () => onSuccess('เพิ่มข้อมูลสำเร็จ'),
        error: onSaveError,
        complete: backToSummary,
      });
    }
  };

  const onReset = () => {
    if (isEdit && electricityData) {
      form.setFieldsValue(toFormValues(electricityData));
    } else {
      form.resetFields();
    }
  };

  const onDelete = () => {
    ElectricityService.deleteElectricity(+electricityId!, homeId).subscribe({
      next: () => onSuccess('ลบข้อมูลสำเร็จ'),
      error: onSaveError,
      complete: backToSummary,
    });
  };

  return (
    <>
      <Title level={2}>{isEdit ? 'แก้ไขบิลค่าไฟ' : 'เพิ่มบิลค่าไฟ'}</Title>
      <Card>
        {!isEdit || electricityData ? (
          <Form
            {...formItemLayout}
            form={form}
            validateMessages={validateMessages}
            name="electricity-detail-form"
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
              name="usage"
              label="หน่วยที่ใช้ (kWh)"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} precision={0} />
            </Form.Item>
            <Form.Item
              name="electricityPrice"
              label="ค่าไฟฟ้า (บาท)"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} precision={2} />
            </Form.Item>
            <Form.Item
              name="serviceCharge"
              label="ค่าบริการ (บาท)"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} precision={2} />
            </Form.Item>
            <Form.Item
              name="ftRate"
              label="อัตราค่า Ft (บาท/หน่วย)"
              rules={[{ required: true }]}
            >
              <InputNumber precision={4} />
            </Form.Item>
            <Form.Item
              name="ft"
              label="ค่า Ft (บาท)"
              rules={[{ required: true }]}
            >
              <InputNumber precision={2} />
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
                  {dayjs(electricityData?.updateDate)
                    .locale('th')
                    .format('D MMMM BBBB')}{' '}
                  โดย {electricityData?.updateBy}
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

export default ElectricityDetail;
