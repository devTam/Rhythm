import {PayloadAction, createSelector, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store';

export interface IUserProfile {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  avatar?: string;
  followers: number;
  followings: number;
}
interface IAuthState {
  profile: IUserProfile | null;
  loggedIn: boolean;
  loading: boolean;
}
const initialState: IAuthState = {
  profile: null,
  loggedIn: false,
  loading: false,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateProfile(authState, {payload}: PayloadAction<IUserProfile | null>) {
      authState.profile = payload;
    },
    updateLoggedInState(authState, {payload}: PayloadAction<boolean>) {
      authState.loggedIn = payload;
    },
    updateLoadingState(authState, {payload}: PayloadAction<boolean>) {
      authState.loading = payload;
    },
  },
});

export const {updateLoggedInState, updateProfile, updateLoadingState} =
  authSlice.actions;
export const getAuthState = createSelector(
  (state: RootState) => state,
  authState => authState,
);
export default authSlice.reducer;
