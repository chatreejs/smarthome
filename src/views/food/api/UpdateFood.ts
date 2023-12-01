import { AxiosError, AxiosResponse } from 'axios';

import { httpClient } from '@api';
import { Food } from '..';

const UpdateFood = async (id: number, food: Food): Promise<Food> => {
  return httpClient
    .put<Food>(`${import.meta.env.VITE_APP_BASE_API}/foods/${id}`, food)
    .then((response: AxiosResponse) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .catch((error: AxiosError) => {
      throw error;
    });
};

export default UpdateFood;
