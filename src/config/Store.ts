import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { accountReducer, homeReducer } from '@slices';

const rootReducer = combineReducers({
  home: homeReducer,
  account: accountReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

// Type definitions for the root state and dispatch function
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
