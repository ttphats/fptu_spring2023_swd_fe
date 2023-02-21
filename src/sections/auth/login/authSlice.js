import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import loginApi from '../../../api/loginApi';

// Actions
export const userLogin = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const actionResult = await loginApi.getLogin({ email, password });
    localStorage.setItem('access-token', actionResult.data.accessToken);
    localStorage.setItem('refesh-token', actionResult.data.refreshToken);
    return actionResult;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue(error.message);
  }
});

export const userLoginPublic = createAsyncThunk('auth/loginPublic', async (tokenId, { rejectWithValue }) => {
  try {
    const actionResult = await loginApi.getLoginPublic(tokenId);
    localStorage.setItem('access-token', actionResult.data.accessToken);
    localStorage.setItem('refesh-token', actionResult.data.refreshToken);
    return actionResult;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue(error.message);
  }
});


const userToken = localStorage.getItem('access-token') ? localStorage.getItem('access-token') : null;

const initialState = {
  loading: false,
  loginInfo: null,
  userToken,
  error: null,
  success: false,
};
// const initialState

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // login user
    builder.addCase(userLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(userLogin.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.loginInfo = payload;
      state.userToken = payload.data.accessToken;
    });
    builder.addCase(userLogin.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    // login user public
    builder.addCase(userLoginPublic.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(userLoginPublic.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.loginInfo = payload;
      state.userToken = payload.data.accessToken;
    });
    builder.addCase(userLoginPublic.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

// Reduces
const authReducer = authSlice.reducer;
export default authReducer;
