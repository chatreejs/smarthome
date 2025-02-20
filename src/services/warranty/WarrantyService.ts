import { Observable, from, map } from 'rxjs';

import { axiosInstance } from '@config';
import { Warranty, WarrantyRequest } from '@interfaces';

export class WarrantyService {
  private static readonly apiEndpoint = '/warranties';

  static getAllWarranties(homeId: number): Observable<Warranty[]> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.get<Warranty[]>(this.apiEndpoint, { params }),
    ).pipe(map((response) => response.data));
  }

  static getWarrantyById(id: number, homeId: number): Observable<Warranty> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.get<Warranty>(`${this.apiEndpoint}/${id}`, { params }),
    ).pipe(map((response) => response.data));
  }

  static createWarranty(
    warranty: WarrantyRequest,
    homeId: number,
  ): Observable<void> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.post<void>(this.apiEndpoint, warranty, { params }),
    ).pipe(map((response) => response.data));
  }

  static updateWarranty(
    id: number,
    warranty: WarrantyRequest,
    homeId: number,
  ): Observable<void> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.put<void>(`${this.apiEndpoint}/${id}`, warranty, {
        params,
      }),
    ).pipe(map((response) => response.data));
  }

  static deleteWarranty(id: number, homeId: number): Observable<void> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.delete<void>(`${this.apiEndpoint}/${id}`, { params }),
    ).pipe(map((response) => response.data));
  }

  static deleteMultipleWarranties(
    ids: number[],
    homeId: number,
  ): Observable<void> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.delete<void>(this.apiEndpoint, {
        data: {
          ids: ids.join(','),
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params,
      }),
    ).pipe(map((response) => response.data));
  }
}
