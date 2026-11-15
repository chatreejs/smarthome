import { AxiosError } from 'axios';

/** Shown when the API returns 403 because the user isn't a member of the selected home. */
export const FORBIDDEN_MESSAGE = 'คุณไม่มีสิทธิ์เข้าถึงบ้านนี้';

/**
 * Picks the message for a failed bulk delete. The API deletes nothing when any
 * id is missing, so a 404 means the list is stale and none of the items were removed.
 */
export const bulkDeleteErrorMessage = (err: AxiosError<unknown>): string => {
  switch (err.response?.status) {
    case 403:
      return FORBIDDEN_MESSAGE;
    case 404:
      return 'บางรายการถูกลบไปแล้ว จึงยังไม่ได้ลบรายการใดเลย กรุณาตรวจสอบรายการแล้วลองใหม่อีกครั้ง';
    default:
      return 'ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง';
  }
};

/**
 * Returns true when the request got no response, such as a refused connection,
 * a DNS failure, a CORS block or a timeout, or when a gateway answered 502, 503 or 504.
 */
export const isServiceUnavailable = (err: unknown): boolean => {
  if (!(err instanceof AxiosError)) return false;
  if (!err.response) return true;
  return [502, 503, 504].includes(err.response.status);
};
