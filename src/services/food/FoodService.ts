import { Observable, from, map } from 'rxjs';

import { axiosInstance } from '@config';
import { Food, FoodRequest } from '@interfaces';

export class FoodService {
  private static apiEndpoint(homeId: number): string {
    return `/homes/${homeId}/foods`;
  }

  static getAllFoods(homeId: number): Observable<Food[]> {
    return from(axiosInstance.get<Food[]>(this.apiEndpoint(homeId))).pipe(
      map((response) => response.data),
    );
  }

  static getFoodById(id: number, homeId: number): Observable<Food> {
    return from(
      axiosInstance.get<Food>(`${this.apiEndpoint(homeId)}/${id}`),
    ).pipe(map((response) => response.data));
  }

  static createFood(food: FoodRequest, homeId: number): Observable<void> {
    return from(axiosInstance.post<void>(this.apiEndpoint(homeId), food)).pipe(
      map((response) => response.data),
    );
  }

  static updateFood(
    id: number,
    food: FoodRequest,
    homeId: number,
  ): Observable<void> {
    return from(
      axiosInstance.put<void>(`${this.apiEndpoint(homeId)}/${id}`, food),
    ).pipe(map((response) => response.data));
  }

  static deleteFood(id: number, homeId: number): Observable<void> {
    return from(
      axiosInstance.delete<void>(`${this.apiEndpoint(homeId)}/${id}`),
    ).pipe(map((response) => response.data));
  }

  static deleteMultipleFoods(ids: number[], homeId: number): Observable<void> {
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
