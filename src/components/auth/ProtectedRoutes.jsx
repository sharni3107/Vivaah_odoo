import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function LoadingScreen() {
  return (
    <div className="w-full min-h-screen bg-[#F5EFE7] flex flex-col items-center justify-center p-6 text-[#241820]">
      <div className="w-12 h-12 rounded-full border-2 border-[#B99A72] border-t-transparent animate-spin mb-4" />
      <p className="font-serif text-lg tracking-wider uppercase text-[#241820]">VIVAAH</p>
      <p className="text-xs text-[#B99A72] tracking-widest uppercase mt-1">Verifying Credentials...</p>
    </div>
  );
}

export function AgencyRoute() {
  const { currentUser, isAgency, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (currentUser.role === 'client') {
    return <Navigate to="/client" replace />;
  }

  if (currentUser.role === 'vendor') {
    return <Navigate to="/vendor" replace />;
  }

  if (!isAgency) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function ClientRoute() {
  const { currentUser, isClient, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
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
  const { currentUser, isVendor, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isVendor && !isAdmin) {
    if (currentUser.role === 'client') {
      return <Navigate to="/client" replace />;
    }
    return <Navigate to="/workspace" replace />;
  }

  return <Outlet />;
}
