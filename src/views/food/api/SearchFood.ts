import { AxiosError, AxiosResponse } from 'axios';
import { Food } from '..';
import { httpClient } from '../../../api/HttpClient';

const SearchFood = async (): Promise<Food[]> => {
  return httpClient
    .get<Food[]>(`${import.meta.env.VITE_APP_BASE_API}/foods`)
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
          );
        });
      }
    })
    .catch((error: AxiosError) => {
      throw error;
    });
};

export default SearchFood;
