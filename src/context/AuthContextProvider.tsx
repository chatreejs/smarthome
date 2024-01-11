import Keycloak, {
  KeycloakConfig,
  KeycloakInitOptions,
  KeycloakProfile,
} from 'keycloak-js';
import { createContext, useEffect, useState } from 'react';

import { axiosInstance } from '@config';

/**
 * KeycloakConfig configures the connection to the Keycloak server.
 */
const keycloakConfig: KeycloakConfig = {
  url: `${process.env.VITE_APP_KC_URL}`,
  realm: `${process.env.VITE_APP_KC_REALM}`,
  clientId: `${process.env.VITE_APP_KC_CLIENT_ID}`,
};

/**
 * KeycloakInitOptions configures the Keycloak client.
 */
const keycloakInitOptions: KeycloakInitOptions = {
  // Configure that Keycloak will check if a user is already authenticated (when opening the app or reloading the page). If not authenticated the user will be send to the login form. If already authenticated the webapp will open.
  onLoad: 'login-required',
};

// Create the Keycloak client instance
const keycloak = new Keycloak(keycloakConfig);

/**
 * AuthContextValues defines the structure for the default values of the {@link AuthContext}.
 */
interface AuthContextValues {
  /**
   * Whether the user is authenticated or not.
   */
  isAuthenticated: boolean;
  /**
   * Function to logout the user.
   */
  logout: () => void;
  /**
   * The user profile of the current user.
   */
  userProfile: KeycloakProfile;
  /**
   * Function to check if the user has a specific role.
   */
  hasRole: (role: string) => boolean;
}

/**
 * defaultAuthContextValues defines the default values for the {@link AuthContext}
 */
const defaultAuthContextValues: AuthContextValues = {
  isAuthenticated: false,
  logout: () => {},
  userProfile: {} as KeycloakProfile,
  hasRole: () => false,
};

/**
 * AuthContext is the context exposed by the {@link AuthContextProvider}.
 */
export const AuthContext = createContext<AuthContextValues>(
  defaultAuthContextValues,
);

/**
 * The props that must be passed to create the {@link AuthContextProvider}.
 */
interface AuthContextProviderProps {
  /**
   * The elements wrapped by the auth context.
   */
  children: JSX.Element;
}

/**
 * AuthContextProvider is responsible for managing the authentication state of the current user.
 *
 * @param props
 */
const AuthContextProvider = (props: AuthContextProviderProps) => {
  // Creating the local state to keep track of the authentication
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  const [userProfile, serUserProfile] = useState<KeycloakProfile>({});

  useEffect(() => {
    // Initialize the Keycloak client
    async function initKeycloak() {
      try {
        const authenticated = await keycloak.init(keycloakInitOptions);
        if (!authenticated) {
          // If the user is not authenticated we force a login
          keycloak.login();
        }
        // Set the authentication state
        setAuthenticated(authenticated);
      } catch (error) {
        console.error('Failed to initialize Keycloak.', error);
        setAuthenticated(false);
      }
    }

    initKeycloak();
  }, []);

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const profile = await keycloak.loadUserProfile();
        if (profile) {
          serUserProfile(profile);
        }
      } catch (error) {
        console.error('Failed to load user profile.', error);
      }
    }

    if (isAuthenticated) {
      loadUserProfile();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    axiosInstance.interceptors.request.use(
      (config) => {
        if (isAuthenticated) {
          config.headers.Authorization = `Bearer ${keycloak.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  });

  useEffect(() => {
    // Deal with all responses containing a 401 error to try to refresh the access token if possible
    axiosInstance.interceptors.response.use(
      // No special handling of responses needed. We return it as it comes in.
      (response) => {
        return response;
      },
      // This object is not null if an error occurred
      async (error) => {
        if (error.response === undefined) {
          throw error;
        }
        // Check if it is a 401 Unauthorized error
        if (error.response.status === 401) {
          try {
            // Try to refresh the access token
            const result = await keycloak.updateToken(5);
            // Was refreshing the access token successfull?
            if (result === true) {
              // Repeat the request
              return await axiosInstance({ ...error.config });
            } else {
              // If the access token could not be refreshed we reject the promise and the code responsible for the request has to handle it.
              throw new Error('Unauthorized');
            }
          } catch (error) {
            keycloak.logout();
            throw error;
          }
        }
        // No special treatment of any other error
        throw error;
      },
    );
  });

  const hasRole = (role: string) => {
    return keycloak.hasRealmRole(role);
  };

  const logout = () => {
    keycloak.redirectUri = `${process.env.VITE_APP_BASE_URL}`;
    keycloak.logout();
  };

  return (
    // Creating the provider and passing the state into it. Whenever the state changes the components using this context will be re-rendered.
    <AuthContext.Provider
      value={{ isAuthenticated, logout, userProfile, hasRole }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
