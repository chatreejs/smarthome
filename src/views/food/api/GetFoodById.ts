import { AxiosError, AxiosResponse } from 'axios';

import { httpClient } from '@api';
import { Food } from '..';

const GetFoodById = async (id: number): Promise<Food> => {
  return httpClient
    .get<Food>(`${import.meta.env.VITE_APP_BASE_API}/foods/${id}`)
    .then((response: AxiosResponse) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .catch((error: AxiosError) => {
      throw error;
    });
};

export default GetFoodById;
