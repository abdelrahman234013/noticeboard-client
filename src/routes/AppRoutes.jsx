import { Navigate, Route, Routes } from 'react-router-dom';

import AdminRoute from '../components/common/AdminRoute.jsx';
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';
import AdminNoticesPage from '../pages/admin/AdminNoticesPage.jsx';
import AnalyticsPage from '../pages/admin/AnalyticsPage.jsx';
import CategoriesPage from '../pages/admin/CategoriesPage.jsx';
import CreateNoticePage from '../pages/admin/CreateNoticePage.jsx';
import DashboardPage from '../pages/admin/DashboardPage.jsx';
import EditNoticePage from '../pages/admin/EditNoticePage.jsx';
import UserDetailsPage from '../pages/admin/UserDetailsPage.jsx';
import UsersManagementPage from '../pages/admin/UsersManagementPage.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import NotificationPreferencesPage from '../pages/NotificationPreferencesPage.jsx';
import HomePage from '../pages/public/HomePage.jsx';
import NoticeDetailsPage from '../pages/public/NoticeDetailsPage.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/notices/:id" element={<NoticeDetailsPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/settings/notifications" element={<NotificationPreferencesPage />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <DashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/notices"
          element={
            <AdminRoute>
              <AdminNoticesPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/notices/create"
          element={
            <AdminRoute>
              <CreateNoticePage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/notices/:id/edit"
          element={
            <AdminRoute>
              <EditNoticePage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <CategoriesPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <AdminRoute>
              <AnalyticsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UsersManagementPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <AdminRoute>
              <UserDetailsPage />
            </AdminRoute>
          }
        />
      </Route>

      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
