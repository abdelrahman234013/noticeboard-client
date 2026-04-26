import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext.jsx';
import Loader from './Loader.jsx';

const AdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loader text="Checking admin access..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
};

export default AdminRoute;
