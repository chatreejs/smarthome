import { RootState } from '@config';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Waterworks } from '@interfaces';
import { WaterworksService } from '@services';
import { App, Button, Card, Skeleton, Typography } from 'antd';

import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import WaterworksChart from './WaterworksChart';

const { Title } = Typography;

const WaterworksSummary: React.FC = () => {
  const { notification } = App.useApp();
  const homeId = useSelector((state: RootState) => state.home.id);
  const [waterworksData, setWaterworksData] = React.useState<Waterworks[]>([]);
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

  const fetchWaterworksData = useCallback(() => {
    setLoading(true);
    WaterworksService.getAllWaterworks(homeId).subscribe({
      next: (res) => {
        setWaterworksData(res);
        setLoading(false);
      },
      error: () => {
        onError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
        setLoading(false);
      },
    });
  }, [homeId, onError]);

  useEffect(() => {
    fetchWaterworksData();
  }, [fetchWaterworksData]);

  return (
    <>
      <Title level={2}>ค่าน้ำ</Title>
      <Button type="primary" onClick={() => navigate('new')}>
        <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.25rem' }} />
        เพิ่มบิลค่าน้ำ
      </Button>
      <Card style={{ marginTop: '1rem' }}>
        {loading && <Skeleton active />}
        {!loading && <WaterworksChart data={waterworksData} />}
      </Card>
    </>
  );
};

export default WaterworksSummary;
