import { Observable, from, map } from 'rxjs';

import { axiosInstance } from '@config';
import { WarrantyRequest } from '@interfaces';
import { Warranty } from '@models';

export class WarrantyService {
  private static apiEndpoint = '/warranties';

  static getAllWarranties(): Observable<Warranty[]> {
    return from(axiosInstance.get<Warranty[]>(this.apiEndpoint)).pipe(
      map((response) => response.data),
    );
  }

  static getWarrantyById(id: number): Observable<Warranty> {
    return from(axiosInstance.get<Warranty>(`${this.apiEndpoint}/${id}`)).pipe(
      map((response) => response.data),
    );
  }

  static createWarranty(warranty: WarrantyRequest): Observable<void> {
    return from(axiosInstance.post<void>(this.apiEndpoint, warranty)).pipe(
      map((response) => response.data),
    );
  }

  static updateWarranty(
    id: number,
    warranty: WarrantyRequest,
  ): Observable<void> {
    return from(
      axiosInstance.put<void>(`${this.apiEndpoint}/${id}`, warranty),
    ).pipe(map((response) => response.data));
  }

  static deleteWarranty(id: number): Observable<void> {
    return from(axiosInstance.delete<void>(`${this.apiEndpoint}/${id}`)).pipe(
      map((response) => response.data),
    );
  }

  static deleteMultipleWarranties(ids: number[]): Observable<void> {
    return from(
      axiosInstance.delete<void>(this.apiEndpoint, {
        data: {
          ids: ids.join(','),
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    ).pipe(map((response) => response.data));
  }
}
