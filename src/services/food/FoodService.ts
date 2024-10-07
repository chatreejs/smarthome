import { Observable, from, map } from 'rxjs';

import { axiosInstance } from '@config';
import { Food, FoodRequest } from '@interfaces';

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

  static createFood(food: FoodRequest, homeId: number): Observable<void> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.post<void>(this.apiEndpoint, food, { params }),
    ).pipe(map((response) => response.data));
  }

  static updateFood(
    id: number,
    food: FoodRequest,
    homeId: number,
  ): Observable<void> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.put<void>(`${this.apiEndpoint}/${id}`, food, {
        params,
      }),
    ).pipe(map((response) => response.data));
  }

  static deleteFood(id: number, homeId: number): Observable<void> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.delete<void>(`${this.apiEndpoint}/${id}`, { params }),
    ).pipe(map((response) => response.data));
  }

  static deleteMultipleFoods(ids: number[], homeId: number): Observable<void> {
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
