import { Observable, from, map } from 'rxjs';

import { axiosInstance } from '@config';
import { Inventory, InventoryRequest } from '@interfaces';

export class InventoryService {
  private static apiEndpoint(homeId: number): string {
    return `/homes/${homeId}/inventories`;
  }

  static getAllInventories(homeId: number): Observable<Inventory[]> {
    return from(axiosInstance.get<Inventory[]>(this.apiEndpoint(homeId))).pipe(
      map((response) => response.data),
    );
  }

  static getInventoryById(id: number, homeId: number): Observable<Inventory> {
    return from(
      axiosInstance.get<Inventory>(`${this.apiEndpoint(homeId)}/${id}`),
    ).pipe(map((response) => response.data));
  }

  static createInventory(
    inventory: InventoryRequest,
    homeId: number,
  ): Observable<void> {
    return from(
      axiosInstance.post<void>(this.apiEndpoint(homeId), inventory),
    ).pipe(map((response) => response.data));
  }

  static updateInventory(
    id: number,
    homeId: number,
    inventory: InventoryRequest,
  ): Observable<void> {
    return from(
      axiosInstance.put<void>(`${this.apiEndpoint(homeId)}/${id}`, inventory),
    ).pipe(map((response) => response.data));
  }

  static deleteInventory(id: number, homeId: number): Observable<void> {
    return from(
      axiosInstance.delete<void>(`${this.apiEndpoint(homeId)}/${id}`),
    ).pipe(map((response) => response.data));
  }

  static deleteMultipleInventories(
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
