import { axiosInstance } from '@config';
import { Waterworks, WaterworksRequest } from '@interfaces';
import { from, map, Observable } from 'rxjs';

export class WaterworksService {
  private static apiEndpoint(homeId: number): string {
    return `/homes/${homeId}/waterworks`;
  }

  static getAllWaterworks(homeId: number): Observable<Waterworks[]> {
    return from(axiosInstance.get<Waterworks[]>(this.apiEndpoint(homeId))).pipe(
      map((response) => response.data),
    );
  }

  static getWaterworksById(id: number, homeId: number): Observable<Waterworks> {
    return from(
      axiosInstance.get<Waterworks>(`${this.apiEndpoint(homeId)}/${id}`),
    ).pipe(map((response) => response.data));
  }

  static createWaterworks(
    waterworks: WaterworksRequest,
    homeId: number,
  ): Observable<void> {
    return from(
      axiosInstance.post<void>(this.apiEndpoint(homeId), waterworks),
    ).pipe(map((response) => response.data));
  }

  static updateWaterworks(
    id: number,
    waterworks: WaterworksRequest,
    homeId: number,
  ): Observable<void> {
    return from(
      axiosInstance.put<void>(`${this.apiEndpoint(homeId)}/${id}`, waterworks),
    ).pipe(map((response) => response.data));
  }

  static deleteWaterworks(id: number, homeId: number): Observable<void> {
    return from(
      axiosInstance.delete<void>(`${this.apiEndpoint(homeId)}/${id}`),
    ).pipe(map((response) => response.data));
  }

  static deleteMultipleWaterworks(
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
