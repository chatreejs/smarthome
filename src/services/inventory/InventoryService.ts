import { Observable, from, map } from 'rxjs';

import { axiosInstance } from '@config';
import { Inventory } from '@models';

export class InventoryService {
  private static apiEndpoint = '/inventories';

  static getAllInventories(): Observable<Inventory[]> {
    return from(axiosInstance.get<Inventory[]>(this.apiEndpoint)).pipe(
      map((response) => response.data),
    );
  }

  static getInventoryById(id: number): Observable<Inventory> {
    return from(axiosInstance.get<Inventory>(`${this.apiEndpoint}/${id}`)).pipe(
      map((response) => response.data),
    );
  }

  static createInventory(inventory: Inventory): Observable<any> {
    return from(axiosInstance.post<any>(this.apiEndpoint, inventory)).pipe(
      map((response) => response.data),
    );
  }

  static updateInventory(id: number, inventory: Inventory): Observable<any> {
    return from(
      axiosInstance.put<any>(`${this.apiEndpoint}/${id}`, inventory),
    ).pipe(map((response) => response.data));
  }

  static deleteInventory(id: number): Observable<any> {
    return from(axiosInstance.delete<any>(`${this.apiEndpoint}/${id}`)).pipe(
      map((response) => response.data),
    );
  }

  static deleteMultipleInventories(ids: number[]): Observable<any> {
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
