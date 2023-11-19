import { AxiosError, AxiosResponse } from 'axios';
import { Warranty } from '..';
import { httpClient } from '../../../api/HttpClient';

const CreateWarranty = async (warranty: Warranty): Promise<Warranty> => {
  return httpClient
    .post<Warranty>(`${import.meta.env.VITE_APP_BASE_API}/warranties`, warranty)
    .then((response: AxiosResponse) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .catch((error: AxiosError) => {
      throw error;
    });
};

export default CreateWarranty;
