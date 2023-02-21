import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../sections/auth/login/authSlice';
import userReducer from './Slice/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer
  },
});

export default store;
