import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import loginApi from '../../api/loginApi';

export const getMe = createAsyncThunk('user/getMe', async () => {
  const currentUser = await loginApi.getUser();
  return currentUser.data;
});

const initialState = {
  current: {},
  loading: false,
  error: '',
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMe.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getMe.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.isAuthenticated = false;
    });
    builder.addCase(getMe.fulfilled, (state, action) => {
      state.loading = false;
      state.current = action.payload;
      state.isAuthenticated = true;
    });
  },
});

const { reducer: userReducer } = userSlice;


export default userReducer;
