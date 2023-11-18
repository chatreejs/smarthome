import { AxiosError, AxiosResponse } from 'axios';
import { httpClient } from '../../../api/HttpClient';

const DeleteMultipleWarranty = async (ids: number[]) => {
  return httpClient
    .delete(`${import.meta.env.VITE_APP_BASE_API}/warranties`, {
      data: {
        ids: ids.join(','),
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((response: AxiosResponse) => {
      console.log(response);
      if (response.status === 200) {
        return response.data;
      }
    })
    .catch((error: AxiosError) => {
      throw error;
    });
};

export default DeleteMultipleWarranty;
