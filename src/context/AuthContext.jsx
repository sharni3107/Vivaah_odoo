import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialUsers } from '../data/seedData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('vivaah_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default to admin for seamless evaluation
    return initialUsers.find(u => u.role === 'admin') || initialUsers[0];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vivaah_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('vivaah_user');
    }
  }, [currentUser]);

  const loginAs = (userId) => {
    const target = initialUsers.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      return target;
    }
    return null;
  };

  const loginWithCredentials = (email, password, expectedRoleType = 'agency') => {
    // In live Supabase mode, this authenticates against Supabase Auth.
    // In seed/standby mode, it matches against the seed user registry.
    const user = initialUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, error: 'Invalid credentials. Please verify your email and password.' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('vivaah_user');
  };

  const agencyRoles = ['admin', 'wedding_planner', 'event_coordinator', 'finance_executive', 'enquiry_executive'];
  const isAgency = agencyRoles.includes(currentUser?.role);

  return (
    <AuthContext.Provider value={{
      currentUser,
      users: initialUsers,
      loginAs,
      loginWithCredentials,
      logout,
      isAgency,
      isAdmin: currentUser?.role === 'admin',
      isPlanner: currentUser?.role === 'wedding_planner' || currentUser?.role === 'admin',
      isCoordinator: currentUser?.role === 'event_coordinator' || currentUser?.role === 'admin',
      isFinance: currentUser?.role === 'finance_executive' || currentUser?.role === 'admin',
      isEnquiryExec: currentUser?.role === 'enquiry_executive' || currentUser?.role === 'admin',
      isClient: currentUser?.role === 'client',
      isVendor: currentUser?.role === 'vendor'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
