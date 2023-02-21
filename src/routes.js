import { Navigate, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

// layouts
import DashboardLayout from './layouts/dashboard';
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

// ----------------------------------------------------------------------

export default function Router() {
  const user = useSelector((state) => state.user);
  console.log('user', user.loading);

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
        <Route
          path="/user-profile"
          element={
            <ProtectedRoute isAuthenticated={user.isAuthenticated}>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={user.isAuthenticated}>
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
        <Route element={<SimpleLayout />}>
          <Route element={<Navigate to="/404" replace />} index="true" />
          <Route path="404" element={<Page404 />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </>
  );
}
