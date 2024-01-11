import { Observable, from, map } from 'rxjs';

import { axiosInstance } from '@config';
import { Food } from '@models';

export class FoodService {
  private static apiEndpoint = '/foods';

  static getAllFoods(): Observable<Food[]> {
    return from(axiosInstance.get<Food[]>(this.apiEndpoint)).pipe(
      map((response) => response.data),
    );
  }

  static getFoodById(id: number): Observable<Food> {
    return from(axiosInstance.get<Food>(`${this.apiEndpoint}/${id}`)).pipe(
      map((response) => response.data),
    );
  }

  static createFood(food: Food): Observable<any> {
    return from(axiosInstance.post<any>(this.apiEndpoint, food)).pipe(
      map((response) => response.data),
    );
  }

  static updateFood(id: number, food: Food): Observable<any> {
    return from(axiosInstance.put<any>(`${this.apiEndpoint}/${id}`, food)).pipe(
      map((response) => response.data),
    );
  }

  static deleteFood(id: number): Observable<any> {
    return from(axiosInstance.delete<any>(`${this.apiEndpoint}/${id}`)).pipe(
      map((response) => response.data),
    );
  }

  static deleteMultipleFoods(ids: number[]): Observable<any> {
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
