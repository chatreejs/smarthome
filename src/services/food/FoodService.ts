import { Observable, from, map } from 'rxjs';

import { axiosInstance } from '@config';
import { Food } from '@models';

export class FoodService {
  private static apiEndpoint = '/foods';

  static getAllFoods(homeId: number): Observable<Food[]> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(axiosInstance.get<Food[]>(this.apiEndpoint, { params })).pipe(
      map((response) => response.data),
    );
  }

  static getFoodById(id: number, homeId: number): Observable<Food> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.get<Food>(`${this.apiEndpoint}/${id}`, { params }),
    ).pipe(map((response) => response.data));
  }

  static createFood(food: Food, homeId: number): Observable<any> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.post<any>(this.apiEndpoint, food, { params }),
    ).pipe(map((response) => response.data));
  }

  static updateFood(id: number, food: Food, homeId: number): Observable<any> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.put<any>(`${this.apiEndpoint}/${id}`, food, { params }),
    ).pipe(map((response) => response.data));
  }

  static deleteFood(id: number, homeId: number): Observable<any> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.delete<any>(`${this.apiEndpoint}/${id}`, { params }),
    ).pipe(map((response) => response.data));
  }

  static deleteMultipleFoods(ids: number[], homeId: number): Observable<any> {
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
