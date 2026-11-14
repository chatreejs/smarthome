import { Observable, from, map } from 'rxjs';

import { axiosInstance } from '@config';
import { Warranty, WarrantyRequest } from '@interfaces';

export class WarrantyService {
  private static apiEndpoint(homeId: number): string {
    return `/homes/${homeId}/warranties`;
  }

  static getAllWarranties(homeId: number): Observable<Warranty[]> {
    return from(axiosInstance.get<Warranty[]>(this.apiEndpoint(homeId))).pipe(
      map((response) => response.data),
    );
  }

  static getWarrantyById(id: number, homeId: number): Observable<Warranty> {
    return from(
      axiosInstance.get<Warranty>(`${this.apiEndpoint(homeId)}/${id}`),
    ).pipe(map((response) => response.data));
  }

  static createWarranty(
    warranty: WarrantyRequest,
    homeId: number,
  ): Observable<void> {
    return from(
      axiosInstance.post<void>(this.apiEndpoint(homeId), warranty),
    ).pipe(map((response) => response.data));
  }

  static updateWarranty(
    id: number,
    warranty: WarrantyRequest,
    homeId: number,
  ): Observable<void> {
    return from(
      axiosInstance.put<void>(`${this.apiEndpoint(homeId)}/${id}`, warranty),
    ).pipe(map((response) => response.data));
  }

  static deleteWarranty(id: number, homeId: number): Observable<void> {
    return from(
      axiosInstance.delete<void>(`${this.apiEndpoint(homeId)}/${id}`),
    ).pipe(map((response) => response.data));
  }

  static deleteMultipleWarranties(
    ids: number[],
    homeId: number,
  ): Observable<void> {
    return from(
      axiosInstance.delete<void>(this.apiEndpoint(homeId), {
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
