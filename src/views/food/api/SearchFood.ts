import { AxiosError, AxiosResponse } from 'axios';

import { httpClient } from '@api';
import { Food } from '..';

const SearchFood = async (): Promise<Food[]> => {
  return httpClient
    .get<Food[]>(`${process.env.VITE_APP_BASE_API}/foods`)
    .then((response: AxiosResponse) => {
      if (response.status === 200) {
        return response.data.map((food: Food) => {
          return new Food(
            food.id,
            food.name,
            food.quantity,
            food.unit,
            food.buyDate,
            food.expiryDate,
            food.status,
          );
        });
      }
    })
    .catch((error: AxiosError) => {
      throw error;
    });
};

export default SearchFood;
