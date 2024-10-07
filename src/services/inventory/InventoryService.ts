import { Observable, from, map } from 'rxjs';

import { axiosInstance } from '@config';
import { Inventory, InventoryRequest } from '@interfaces';

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
    inventory: InventoryRequest,
    homeId: number,
  ): Observable<void> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.post<void>(this.apiEndpoint, inventory, { params }),
    ).pipe(map((response) => response.data));
  }

  static updateInventory(
    id: number,
    homeId: number,
    inventory: InventoryRequest,
  ): Observable<void> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.put<void>(`${this.apiEndpoint}/${id}`, inventory, {
        params,
      }),
    ).pipe(map((response) => response.data));
  }

  static deleteInventory(id: number, homeId: number): Observable<void> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.delete<void>(`${this.apiEndpoint}/${id}`, { params }),
    ).pipe(map((response) => response.data));
  }

  static deleteMultipleInventories(
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
