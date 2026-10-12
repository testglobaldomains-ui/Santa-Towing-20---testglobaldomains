import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../lib/auth';

interface AdminProtectedRouteProps {
  children?: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const [authed, setAuthed] = useState<boolean>(() => isAuthenticated());
  const location = useLocation();

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthed(isAuthenticated());
    };

    window.addEventListener('santa_admin_auth_changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    // Also check on mount / navigation
    setAuthed(isAuthenticated());

    return () => {
      window.removeEventListener('santa_admin_auth_changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [location.pathname]);

  if (!authed) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
