import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { HomeState } from '@interfaces';

const initialState: HomeState = {
  id: -1,
  name: '',
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setHomeId: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
    },
    setHomeName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
});

export default homeSlice.reducer;
export const { setHomeId, setHomeName } = homeSlice.actions;
