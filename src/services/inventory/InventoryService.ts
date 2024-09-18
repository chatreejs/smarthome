import { Observable, from, map } from 'rxjs';

import { axiosInstance } from '@config';
import { Inventory } from '@models';

export class InventoryService {
  private static apiEndpoint = '/inventories';

  static getAllInventories(homeId: number): Observable<Inventory[]> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.get<Inventory[]>(this.apiEndpoint, { params }),
    ).pipe(map((response) => response.data));
  }

  static getInventoryById(id: number, homeId: number): Observable<Inventory> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.get<Inventory>(`${this.apiEndpoint}/${id}`, { params }),
    ).pipe(map((response) => response.data));
  }

  static createInventory(
    inventory: Inventory,
    homeId: number,
  ): Observable<any> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.post<any>(this.apiEndpoint, inventory, { params }),
    ).pipe(map((response) => response.data));
  }

  static updateInventory(
    id: number,
    homeId: number,
    inventory: Inventory,
  ): Observable<any> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.put<any>(`${this.apiEndpoint}/${id}`, inventory, {
        params,
      }),
    ).pipe(map((response) => response.data));
  }

  static deleteInventory(id: number, homeId: number): Observable<any> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.delete<any>(`${this.apiEndpoint}/${id}`, { params }),
    ).pipe(map((response) => response.data));
  }

  static deleteMultipleInventories(
    ids: number[],
    homeId: number,
  ): Observable<any> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.delete<any>(this.apiEndpoint, {
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
