import { AxiosError, AxiosResponse } from 'axios';

import { httpClient } from '@api';
import { Inventory } from '..';

const SearchInventory = async (): Promise<Inventory[]> => {
  return httpClient
    .get<Inventory[]>(`${process.env.VITE_APP_BASE_API}/inventories`)
    .then((response: AxiosResponse) => {
      if (response.status === 200) {
        return response.data.map((inventory: Inventory) => {
          return new Inventory(
            inventory.id,
            inventory.name,
            inventory.quantity,
            inventory.maxQuantity,
            inventory.unit,
            inventory.status,
          );
        });
      }
    })
    .catch((error: AxiosError) => {
      throw error;
    });
};

export default SearchInventory;
