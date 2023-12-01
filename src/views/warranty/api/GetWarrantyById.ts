import { AxiosError, AxiosResponse } from 'axios';

import { httpClient } from '@api';
import { Warranty } from '..';

const GetWarrantyById = async (id: number): Promise<Warranty> => {
  return httpClient
    .get<Warranty>(`${import.meta.env.VITE_APP_BASE_API}/warranties/${id}`)
    .then((response: AxiosResponse) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .catch((error: AxiosError) => {
      throw error;
    });
};

export default GetWarrantyById;
