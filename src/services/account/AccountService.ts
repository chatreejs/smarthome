import { from, map, Observable } from 'rxjs';

import { axiosInstance } from '@config';
import { Account, AccountRequest } from '@interfaces';

export class AccountService {
  private static apiEndpoint = '/accounts';

  static getUserInfo(): Observable<Account> {
    return from(
      axiosInstance.get<Account>(`${this.apiEndpoint}/userinfo`),
    ).pipe(map((response) => response.data));
  }

  static createAccount(account: AccountRequest): Observable<void> {
    return from(axiosInstance.post<void>(this.apiEndpoint, account)).pipe(
      map((response) => response.data),
    );
  }
}
