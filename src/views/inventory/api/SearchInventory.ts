import { AxiosError, AxiosResponse } from 'axios';
import { Inventory } from '..';
import { httpClient } from '../../../api/HttpClient';

const SearchInventory = async (): Promise<Inventory[]> => {
  return httpClient
    .get<Inventory[]>(`${import.meta.env.VITE_APP_BASE_API}/inventories`)
    .then((response: AxiosResponse) => {
      if (response.status === 200) {
        return response.data.map((inventory: Inventory) => {
          return new Inventory(
            inventory.id,
            inventory.name,
            inventory.quantity,
            inventory.maxQuantity,
            inventory.unit,
          );
        });
      }
    })
    .catch((error: AxiosError) => {
      throw error;
    });
};

export default SearchInventory;
