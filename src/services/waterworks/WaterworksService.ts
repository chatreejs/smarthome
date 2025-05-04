import { axiosInstance } from '@config';
import { Waterworks } from '@interfaces';
import { from, map, Observable } from 'rxjs';

export class WaterworksService {
  private static readonly apiEndpoint = '/waterworks';

  static getAllWaterworks(homeId: number): Observable<Waterworks[]> {
    const params = new URLSearchParams();
    params.append('homeId', homeId.toString());
    return from(
      axiosInstance.get<Waterworks[]>(this.apiEndpoint, { params }),
    ).pipe(map((response) => response.data));
  }
}
