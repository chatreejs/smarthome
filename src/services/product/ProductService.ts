import { Observable, from, map } from 'rxjs';

import { axiosInstance } from '@config';
import { ProductType } from '@enums';
import { Product } from '@interfaces';

export class ProductService {
  private static readonly apiEndpoint = '/products';

  static searchProducts(type: ProductType, q: string): Observable<Product[]> {
    return from(
      axiosInstance.get<Product[]>(this.apiEndpoint, { params: { type, q } }),
    ).pipe(map((response) => response.data));
  }
}
