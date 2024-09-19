import { from, map, Observable } from 'rxjs';

import { axiosInstance } from '@config';
import { HomeRequest } from '@interfaces';
import { Home } from '@models';

export class HomeService {
  private static apiEndpoint = '/homes';

  static getAllHome(): Observable<Home[]> {
    return from(axiosInstance.get<Home[]>(this.apiEndpoint)).pipe(
      map((response) => response.data),
    );
  }

  static createHome(home: HomeRequest): Observable<Home> {
    return from(axiosInstance.post<Home>(this.apiEndpoint, home)).pipe(
      map((response) => response.data),
    );
  }
}
