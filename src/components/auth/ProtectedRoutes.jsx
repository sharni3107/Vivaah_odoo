import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function AgencyRoute() {
  const { currentUser, isAgency } = useAuth();

  if (!currentUser) {
    return <Navigate to="/agency/login" replace />;
  }

  if (currentUser.role === 'client') {
    return <Navigate to="/client" replace />;
  }

  if (currentUser.role === 'vendor') {
    return <Navigate to="/vendor" replace />;
  }

  if (!isAgency) {
    return <Navigate to="/agency/login" replace />;
  }

  return <Outlet />;
}

export function ClientRoute() {
  const { currentUser, isClient, isAdmin } = useAuth();

  if (!currentUser) {
    return <Navigate to="/client/login" replace />;
  }

  if (!isClient && !isAdmin) {
    if (currentUser.role === 'vendor') {
      return <Navigate to="/vendor" replace />;
    }
    return <Navigate to="/workspace" replace />;
  }

  return <Outlet />;
}

export function VendorRoute() {
  const { currentUser, isVendor, isAdmin } = useAuth();

  if (!currentUser) {
    return <Navigate to="/vendor/login" replace />;
  }

  if (!isVendor && !isAdmin) {
    if (currentUser.role === 'client') {
      return <Navigate to="/client" replace />;
    }
    return <Navigate to="/workspace" replace />;
  }

  return <Outlet />;
}
