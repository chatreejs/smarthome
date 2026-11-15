import { App as AntApp, Button, ConfigProvider, Result } from 'antd';
import { AxiosError } from 'axios';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce';
import { useDispatch } from 'react-redux';
import { catchError, map, Observable, of, switchMap } from 'rxjs';

import { SplashSpinner } from '@components';
import { AppRoutes as Router } from '@config';
import { AccountRequest, Home } from '@interfaces';
import { AccountService, HomeService } from '@services';
import { setHomeId, setHomeName, setIsHasHome } from '@slices';

type BootstrapResult = { hasHome: false } | { hasHome: true; home: Home };

const App: React.FC = () => {
  const { token, tokenData, error, loginInProgress, logIn } =
    useContext<IAuthContext>(AuthContext);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [bootstrapFailed, setBootstrapFailed] = useState(false);

  // Each token refresh creates a new tokenData object. Reading it through a ref
  // keeps a refresh from re-running the bootstrap, which would reset the selected home.
  const tokenDataRef = useRef(tokenData);
  tokenDataRef.current = tokenData;
  const isAuthenticated = Boolean(token);

  const createAccountFromToken = (): Observable<BootstrapResult> => {
    const claims = tokenDataRef.current ?? {};
    const accountRequest: AccountRequest = {
      username: claims.preferred_username as string,
      firstName: claims.given_name as string,
      lastName: claims.family_name as string,
      email: claims.email as string,
    };
    return AccountService.createAccount(accountRequest).pipe(
      map(() => ({ hasHome: false }) as const),
    );
  };

  const bootstrap = useCallback(() => {
    setLoading(true);
    setBootstrapFailed(false);

    return AccountService.getUserInfo()
      .pipe(
        switchMap((account): Observable<BootstrapResult> => {
          if (!account.hasHome) {
            return of({ hasHome: false });
          }
          return HomeService.getAllHome().pipe(
            map(
              (homes): BootstrapResult =>
                homes.length > 0
                  ? { hasHome: true, home: homes[0] } // TODO: Implement default home selection
                  : { hasHome: false },
            ),
          );
        }),
        catchError((err: unknown) => {
          // A 404 means the account doesn't exist yet, so create it from the token claims.
          if (err instanceof AxiosError && err.response?.status === 404) {
            return createAccountFromToken();
          }
          throw err;
        }),
      )
      .subscribe({
        next: (result) => {
          dispatch(setIsHasHome(result.hasHome));
          if (result.hasHome) {
            dispatch(setHomeId(result.home.id));
            dispatch(setHomeName(result.home.name));
          }
          setLoading(false);
        },
        error: (err: unknown) => {
          // A 401 means the API rejected the token, so log in again to get a new one.
          if (err instanceof AxiosError && err.response?.status === 401) {
            logIn();
            return;
          }
          console.error('Error when bootstrapping the app', err);
          setBootstrapFailed(true);
          setLoading(false);
        },
      });
  }, [dispatch, logIn]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const subscription = bootstrap();
    return () => subscription.unsubscribe();
  }, [isAuthenticated, bootstrap]);

  // When the Keycloak login fails, show the error and a button to log in again.
  if (error && !loginInProgress) {
    return (
      <Result
        status="error"
        title="เข้าสู่ระบบไม่สำเร็จ"
        subTitle={error}
        extra={
          <Button type="primary" onClick={() => logIn()}>
            เข้าสู่ระบบอีกครั้ง
          </Button>
        }
      />
    );
  }

  if (!isAuthenticated || loading) {
    return <SplashSpinner />;
  }

  if (bootstrapFailed) {
    return (
      <Result
        status="500"
        title="ไม่สามารถโหลดข้อมูลผู้ใช้ได้"
        subTitle="กรุณาลองใหม่อีกครั้ง"
        extra={
          <Button type="primary" onClick={() => bootstrap()}>
            ลองใหม่
          </Button>
        }
      />
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#3458a8',
          colorLink: '#3458a8',
          colorLinkHover: '#000000',
          fontFamily: 'Noto Sans Thai',
        },
      }}
    >
      <AntApp>
        <Router />
      </AntApp>
    </ConfigProvider>
  );
};

export default App;
