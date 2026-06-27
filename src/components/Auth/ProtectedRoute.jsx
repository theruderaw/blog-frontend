import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading Session</div>
    }

    if (!user) {

        return <Navigate to='/login' replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default ProtectedRoute;