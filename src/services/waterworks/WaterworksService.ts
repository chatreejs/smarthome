import { axiosInstance } from '@config';
import { Waterworks } from '@interfaces';
import { from, map, Observable } from 'rxjs';

export class WaterworksService {
  private static apiEndpoint(homeId: number): string {
    return `/homes/${homeId}/waterworks`;
  }

  static getAllWaterworks(homeId: number): Observable<Waterworks[]> {
    return from(axiosInstance.get<Waterworks[]>(this.apiEndpoint(homeId))).pipe(
      map((response) => response.data),
    );
  }
}
