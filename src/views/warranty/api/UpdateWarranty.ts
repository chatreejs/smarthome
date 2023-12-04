import { AxiosError, AxiosResponse } from 'axios';

import { httpClient } from '@api';
import { Warranty } from '..';

const UpdateWarranty = async (
  id: number,
  warranty: Warranty,
): Promise<Warranty> => {
  return httpClient
    .put<Warranty>(
      `${process.env.VITE_APP_BASE_API}/warranties/${id}`,
      warranty,
    )
    .then((response: AxiosResponse) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .catch((error: AxiosError) => {
      throw error;
    });
};

export default UpdateWarranty;
