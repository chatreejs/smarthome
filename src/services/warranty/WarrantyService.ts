import { Observable, from, map } from 'rxjs';

import { axiosInstance } from '@config';
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

  static createWarranty(warranty: Warranty): Observable<any> {
    return from(axiosInstance.post<any>(this.apiEndpoint, warranty)).pipe(
      map((response) => response.data),
    );
  }

  static updateWarranty(id: number, warranty: Warranty): Observable<any> {
    return from(
      axiosInstance.put<any>(`${this.apiEndpoint}/${id}`, warranty),
    ).pipe(map((response) => response.data));
  }

  static deleteWarranty(id: number): Observable<any> {
    return from(axiosInstance.delete<any>(`${this.apiEndpoint}/${id}`)).pipe(
      map((response) => response.data),
    );
  }

  static deleteMultipleWarranties(ids: number[]): Observable<any> {
    return from(
      axiosInstance.delete<any>(this.apiEndpoint, {
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
