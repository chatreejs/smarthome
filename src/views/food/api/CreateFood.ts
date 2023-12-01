import { AxiosError, AxiosResponse } from 'axios';

import { httpClient } from '@api';
import { Food } from '..';

const CreateFood = async (food: Food): Promise<Food> => {
  return httpClient
    .post<Food>(`${import.meta.env.VITE_APP_BASE_API}/foods`, food)
    .then((response: AxiosResponse) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .catch((error: AxiosError) => {
      throw error;
    });
};

export default CreateFood;
