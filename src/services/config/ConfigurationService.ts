import { Observable, from, map } from 'rxjs';

import { axiosInstance } from '@config';

export class ConfigurationService {
  private static apiEndpoint = '/config';

  static getMenuItems(): Observable<void> {
    return from(axiosInstance.get<void>(`${this.apiEndpoint}/menu-item`)).pipe(
      map((response) => response.data),
    );
  }
}
