import { axiosInstance } from '@config';
import { Electricity, ElectricityRequest } from '@interfaces';
import { from, map, Observable } from 'rxjs';

export class ElectricityService {
  private static apiEndpoint(homeId: number): string {
    return `/homes/${homeId}/electricity`;
  }

  static getAllElectricity(homeId: number): Observable<Electricity[]> {
    return from(
      axiosInstance.get<Electricity[]>(this.apiEndpoint(homeId)),
    ).pipe(map((response) => response.data));
  }

  static getElectricityById(
    id: number,
    homeId: number,
  ): Observable<Electricity> {
    return from(
      axiosInstance.get<Electricity>(`${this.apiEndpoint(homeId)}/${id}`),
    ).pipe(map((response) => response.data));
  }

  static createElectricity(
    electricity: ElectricityRequest,
    homeId: number,
  ): Observable<void> {
    return from(
      axiosInstance.post<void>(this.apiEndpoint(homeId), electricity),
    ).pipe(map((response) => response.data));
  }

  static updateElectricity(
    id: number,
    electricity: ElectricityRequest,
    homeId: number,
  ): Observable<void> {
    return from(
      axiosInstance.put<void>(`${this.apiEndpoint(homeId)}/${id}`, electricity),
    ).pipe(map((response) => response.data));
  }

  static deleteElectricity(id: number, homeId: number): Observable<void> {
    return from(
      axiosInstance.delete<void>(`${this.apiEndpoint(homeId)}/${id}`),
    ).pipe(map((response) => response.data));
  }

  static deleteMultipleElectricity(
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
