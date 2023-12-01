import { AxiosError, AxiosResponse } from 'axios';

import { httpClient } from '@api';
import { Warranty } from '..';

const SearchWarranty = async (): Promise<Warranty[]> => {
  return httpClient
    .get<Warranty[]>(`${import.meta.env.VITE_APP_BASE_API}/warranties`)
    .then((response: AxiosResponse) => {
      if (response.status === 200) {
        return response.data.map((warranty: Warranty) => {
          return new Warranty(
            warranty.id,
            warranty.brand,
            warranty.productName,
            warranty.productNumber,
            warranty.model,
            warranty.serialNumber,
            warranty.purchaseDate,
            warranty.warrantyDate,
            warranty.status,
          );
        });
      }
    })
    .catch((error: AxiosError) => {
      throw error;
    });
};

export default SearchWarranty;
