import {
  faMagnifyingGlass,
  faPlus,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Input, Popconfirm, Row } from 'antd';
import styled from 'styled-components';

const StyledRow = styled(Row)`
  margin-bottom: 0.75em;
`;

const StyledButton = styled(Button)`
  margin-right: 0.5em;
`;

interface Props<T> {
  resourceName: string;
  selectedItems: T[];
  onAddClick: () => void;
  onConfirmDelete: () => void;
  onSearchChanged?: (value: string) => void;
}

const ActionBar = <T,>(props: Props<T>) => {
  return (
    <>
      <StyledRow gutter={8}>
        <Col>
          <StyledButton type="primary" onClick={props.onAddClick}>
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.25rem' }} />
            เพิ่ม{props.resourceName}
          </StyledButton>
          {props.selectedItems.length > 0 && (
            <Popconfirm
              title="ยืนยันการลบ"
              description={`คุณต้องการลบรายการ${props.resourceName}จำนวน ${props.selectedItems.length} รายการใช่หรือไม่?`}
              onConfirm={props.onConfirmDelete}
              okText="ยืนยัน"
              cancelText="ยกเลิก"
              disabled={props.selectedItems.length === 0}
            >
              <StyledButton danger disabled={props.selectedItems.length === 0}>
                <FontAwesomeIcon
                  icon={faTrashCan}
                  style={{ marginRight: '0.25rem' }}
                />
                ลบ
              </StyledButton>
            </Popconfirm>
          )}
        </Col>
      </StyledRow>
      <StyledRow gutter={8}>
        <Col span={24}>
          <Input
            placeholder="Search..."
            prefix={<FontAwesomeIcon icon={faMagnifyingGlass} />}
            onChange={(e) =>
              props.onSearchChanged && props.onSearchChanged(e.target.value)
            }
          />
        </Col>
      </StyledRow>
    </>
  );
};

export default ActionBar;
