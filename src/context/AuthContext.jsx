import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialUsers } from '../data/seedData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export const AGENCY_ROLES = [
  'admin',
  'wedding_planner',
  'event_coordinator',
  'finance_executive',
  'enquiry_executive'
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('vivaah_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role) return parsed;
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Sync session with Supabase and localStorage on initial mount
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('id, email, full_name, role, wedding_id, vendor_id, avatar_url')
              .eq('id', session.user.id)
              .single();

            if (!error && profile && profile.role) {
              const userObj = {
                id: profile.id,
                email: profile.email || session.user.email,
                name: profile.full_name || session.user.email,
                role: profile.role,
                wedding_id: profile.wedding_id,
                vendor_id: profile.vendor_id,
                avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
              };
              setCurrentUser(userObj);
              localStorage.setItem('vivaah_user', JSON.stringify(userObj));
              setIsLoading(false);
              return;
            }
          }
        } catch (err) {
          console.warn('AuthContext: Supabase session check error:', err);
        }
      }

      // Check localStorage for offline / demo session
      const saved = localStorage.getItem('vivaah_user');
      if (saved && isMounted) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.role) {
            setCurrentUser(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    }

    initSession();

    // Listen to live Supabase Auth lifecycle events
    let subscription = null;
    if (isSupabaseConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;

        if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          localStorage.removeItem('vivaah_user');
        } else if (event === 'SIGNED_IN' && session?.user) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('id, email, full_name, role, wedding_id, vendor_id, avatar_url')
              .eq('id', session.user.id)
              .single();

            if (profile && profile.role) {
              const userObj = {
                id: profile.id,
                email: profile.email || session.user.email,
                name: profile.full_name || session.user.email,
                role: profile.role,
                wedding_id: profile.wedding_id,
                vendor_id: profile.vendor_id,
                avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
              };
              setCurrentUser(userObj);
              localStorage.setItem('vivaah_user', JSON.stringify(userObj));
            }
          } catch (e) {
            console.error('AuthContext onAuthStateChange profile load error:', e);
          }
        }
      });
      subscription = data.subscription;
    }

    return () => {
      isMounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // Update localStorage when currentUser changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vivaah_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('vivaah_user');
    }
  }, [currentUser]);

  // Direct login for demo users
  const loginAs = (userId) => {
    const target = initialUsers.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      return target;
    }
    return null;
  };

  /**
   * Unified Login with credentials:
   * 1. Authenticates against Supabase Auth (if configured)
   * 2. Retrieves trusted role from public.profiles table (never user input)
   * 3. Falls back gracefully to verified demo registry for offline evaluation
   */
  const loginWithCredentials = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Supabase Auth
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (!authErr && authData?.user) {
          // Trusted Role from profiles table
          const { data: profile, error: profErr } = await supabase
            .from('profiles')
            .select('id, email, full_name, role, wedding_id, vendor_id, avatar_url')
            .eq('id', authData.user.id)
            .single();

          if (profErr || !profile) {
            await supabase.auth.signOut();
            return {
              success: false,
              error: 'Your account authenticated, but no assigned profile was found. Please contact your wedding coordinator.'
            };
          }

          const validRoles = [...AGENCY_ROLES, 'client', 'vendor'];
          if (!validRoles.includes(profile.role)) {
            await supabase.auth.signOut();
            return {
              success: false,
              error: `Invalid or unauthorized role (${profile.role}). Access denied.`
            };
          }

          const authenticatedUser = {
            id: profile.id,
            email: profile.email || authData.user.email,
            name: profile.full_name || authData.user.email,
            role: profile.role,
            wedding_id: profile.wedding_id,
            vendor_id: profile.vendor_id,
            avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
          };

          setCurrentUser(authenticatedUser);
          localStorage.setItem('vivaah_user', JSON.stringify(authenticatedUser));
          return { success: true, user: authenticatedUser, role: authenticatedUser.role };
        }
      } catch (err) {
        console.warn('AuthContext: Supabase signInWithPassword exception:', err);
      }
    }

    // 2. Demo User Fallback (for rapid hackathon testing without registered auth user)
    const demoUser = initialUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (demoUser) {
      setCurrentUser(demoUser);
      localStorage.setItem('vivaah_user', JSON.stringify(demoUser));
      return { success: true, user: demoUser, role: demoUser.role };
    }

    return {
      success: false,
      error: 'Invalid credentials. Please verify your registered email and password.'
    };
  };

  /**
   * Password reset request via Supabase Auth
   */
  const resetPassword = async (email) => {
    const cleanEmail = email.trim().toLowerCase();
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/login`
      });
      if (error) {
        throw new Error(error.message);
      }
      return { success: true };
    }
    // Demo fallback confirmation
    return { success: true, demo: true };
  };

  /**
   * Logout: Clears Supabase session and local application storage
   */
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('AuthContext: Supabase signOut error:', err);
      }
    }
    setCurrentUser(null);
    localStorage.removeItem('vivaah_user');
  };

  const isAgency = AGENCY_ROLES.includes(currentUser?.role);

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoading,
      users: initialUsers,
      loginAs,
      loginWithCredentials,
      resetPassword,
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
