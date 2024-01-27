// redux
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    userData: null,
    didTryAutoLogin: false,
  },
  reducers: {
    authenticate: (state, action) => {
      state.token = action.payload.token;
      state.userData = action.payload.userData;
      state.didTryAutoLogin = true;
    },
    setDidTryAutoLogin: (state, action) => {
      state.didTryAutoLogin = true;
    },
    logout: (state, action) => {
      state.token = null;
      state.userData = null;
      state.didTryAutoLogin = false;
    },
    updateLoggedInUserData: (state, action) => {
      state.userData = { ...state.userData, ...action.payload.newData };
    },
  },
});

export const authenticate = authSlice.actions.authenticate;
export const setDidTryAutoLogin = authSlice.actions.setDidTryAutoLogin;
export const logout = authSlice.actions.logout;
export const updateLoggedInUserData = authSlice.actions.updateLoggedInUserData;
export default authSlice.reducer;
