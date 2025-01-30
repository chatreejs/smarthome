import { from, map, Observable } from 'rxjs';

import { axiosInstance } from '@config';
import { AirQuality, Weather } from '@interfaces';

export class WeatherService {
  static getCurrentAirQuality(
    apiEndpoint: string,
    probeId: string,
  ): Observable<AirQuality> {
    return from(
      axiosInstance.get<AirQuality>(
        `${apiEndpoint}/air-quality/current/${probeId}`,
      ),
    ).pipe(map((response) => response.data));
  }

  static getRealtimeAirQuality(
    apiEndpoint: string,
    probeId: string,
  ): Observable<AirQuality> {
    return from(
      axiosInstance.get<AirQuality>(
        `${apiEndpoint}/air-quality/realtime/${probeId}`,
      ),
    ).pipe(map((response) => response.data));
  }

  static getCurrentWeather(apiEndpoint: string): Observable<Weather> {
    return from(
      axiosInstance.get<Weather>(`${apiEndpoint}/weather/current`),
    ).pipe(map((response) => response.data));
  }

  static getRealtimeWeather(apiEndpoint: string): Observable<Weather> {
    return from(
      axiosInstance.get<Weather>(`${apiEndpoint}/weather/realtime`),
    ).pipe(map((response) => response.data));
  }
}
