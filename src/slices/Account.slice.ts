import { AccountState } from '@interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: AccountState = {
  isHasHome: false,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setIsHasHome: (state, action: PayloadAction<boolean>) => {
      state.isHasHome = action.payload;
    },
  },
});

export default accountSlice.reducer;
export const { setIsHasHome } = accountSlice.actions;
