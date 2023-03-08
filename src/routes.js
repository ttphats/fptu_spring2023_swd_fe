import { Navigate, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

// layouts
import DashboardLayout from './layouts/dashboard/DashboardLayout';
import HomeLayout from './layouts/dashboard/HomeLayout';

import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import VoucherPage from './pages/VoucherPage';
import DashboardAppPage from './pages/DashboardAppPage';
import RegisterPage from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';
import ProtectedRoute from './utils/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import OTPAuthenticationPage from './pages/OTPAuthenticationPage';

// ----------------------------------------------------------------------

export default function Router() {
  const loginInfo = useSelector((state) => state.auth.loginInfo);
  console.log('loginInfo', loginInfo);

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/otpauthentication" element={<OTPAuthenticationPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
        <Route
          path="/user-profile"
          element={
            <ProtectedRoute loginInfo={loginInfo}>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute loginInfo={loginInfo}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route element={<Navigate to="/dashboard/app" replace />} index="true" />
          <Route path="app" element={<DashboardAppPage />} />
          <Route path="user" element={<UserPage />} />
          <Route path="voucher" element={<VoucherPage />} />
          <Route path="blog" element={<BlogPage />} />
        </Route>
        <Route
          path="/home"
          element={
            <ProtectedRoute loginInfo={loginInfo}>
              <HomeLayout />
            </ProtectedRoute>
          }
        >
          <Route element={<Navigate to="/home/blog" replace />} index="true" />
          <Route path="voucher" element={<VoucherPage />} />
          <Route path="blog" element={<BlogPage />} />
        </Route>
        <Route element={<SimpleLayout />}>
          <Route element={<Navigate to="/home" replace />} index="true" />
          <Route path="404" element={<Page404 />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </>
  );
}
