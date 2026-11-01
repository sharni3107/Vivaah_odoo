import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth, AGENCY_ROLES } from '../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, loginWithCredentials, resetPassword, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Forgot password modal state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetMsg, setResetMsg] = useState(null);

  // If user is already authenticated, redirect them automatically to their assigned workspace
  useEffect(() => {
    if (!isLoading && currentUser?.role) {
      if (currentUser.role === 'client') {
        navigate('/client', { replace: true });
      } else if (currentUser.role === 'vendor') {
        navigate('/vendor', { replace: true });
      } else if (AGENCY_ROLES.includes(currentUser.role)) {
        navigate('/workspace', { replace: true });
      }
    }
  }, [currentUser, isLoading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email.trim() || !password) {
      setError('Please provide your registered email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await loginWithCredentials(email, password);

      if (!res.success) {
        setError(res.error || 'Unable to authenticate. Please check your credentials.');
        setIsSubmitting(false);
        return;
      }

      // Automatic Role-Based Redirection based on trusted database profile
      const userRole = res.role;
      if (userRole === 'client') {
        navigate('/client', { replace: true });
      } else if (userRole === 'vendor') {
        navigate('/vendor', { replace: true });
      } else if (AGENCY_ROLES.includes(userRole)) {
        navigate('/workspace', { replace: true });
      } else {
        setError(`Unrecognized account role (${userRole}). Please contact system administrator.`);
        setIsSubmitting(false);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setResetMsg({ type: 'error', text: 'Please enter your registered email address.' });
      return;
    }

    setResetSubmitting(true);
    setResetMsg(null);

    try {
      await resetPassword(resetEmail);
      setResetMsg({
        type: 'success',
        text: 'A secure password reset link has been dispatched to your email address.'
      });
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetMsg(null);
        setResetEmail('');
      }, 3500);
    } catch (err) {
      setResetMsg({ type: 'error', text: err.message || 'Failed to request password reset.' });
    } finally {
      setResetSubmitting(false);
    }
  };

  const fillDemoAccount = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('vivaah2026');
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="w-full min-h-screen bg-[#F5EFE7] flex flex-col justify-between p-6 sm:p-12 text-[#241820] font-sans antialiased">
      {/* 1. Top Header */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#241820] text-[#B99A72] flex items-center justify-center border border-[#B99A72]/40 shadow-sm transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined text-[20px]">diamond</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl tracking-[0.16em] uppercase font-serif text-[#241820] font-medium leading-none">
              VIVAAH
            </span>
            <span className="text-[9.5px] uppercase tracking-widest text-[#B99A72] mt-1 font-semibold">
              Unified Portal Access
            </span>
          </div>
        </Link>
        <Link
          to="/"
          className="text-xs uppercase text-[#241820]/70 hover:text-[#241820] tracking-wider font-medium transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Return to Website</span>
        </Link>
      </div>

      {/* 2. Main Login Card */}
      <div className="max-w-md mx-auto w-full my-8 bg-white p-8 sm:p-10 rounded-2xl border border-[#B99A72]/30 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B99A72] font-bold block">
            Single Secure Sign-In
          </span>
          <h1 className="text-2xl sm:text-3xl text-[#241820] font-serif font-normal">
            Sign In to Vivaah
          </h1>
          <p className="text-xs text-[#343A35]/80 leading-relaxed">
            Enter your credentials. You will be automatically routed to your dedicated Client Suite, Vendor Portal, or Agency Workspace.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-[16px] shrink-0">check_circle</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Standard Single Login Form (Role is NEVER selected manually) */}
        <form onSubmit={handleLogin} className="space-y-4 pt-1 text-xs">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
              Registered Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. priya@vivaahweddings.com"
              required
              disabled={isSubmitting}
              className="w-full p-3 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] font-medium focus:outline-none focus:border-[#241820] focus:bg-white transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-[#B99A72] hover:text-[#241820] font-medium flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={isSubmitting}
              className="w-full p-3 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none focus:border-[#241820] focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => {
                setResetEmail(email);
                setShowForgotPassword(true);
              }}
              className="text-[11px] text-[#B99A72] hover:text-[#241820] font-medium underline underline-offset-2"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#241820] text-[#F5EFE7] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#34242e] transition-colors shadow-md mt-2 flex items-center justify-center gap-2 group disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-[#B99A72] border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Platform</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </form>

        {/* Fast Evaluation Demo Accounts (Autofills credentials only; role resolution remains 100% database-driven) */}
        <div className="pt-4 border-t border-[#B99A72]/20 space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-[#343A35]/80 font-semibold block text-center">
            Convenience Demo Accounts:
          </span>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <button
              type="button"
              onClick={() => fillDemoAccount('priya@vivaahateliers.com')}
              className="p-2 rounded bg-[#FAF7F2] border border-[#B99A72]/30 hover:border-[#241820] hover:bg-white text-center transition-colors font-medium text-[#241820]"
            >
              <span className="block font-semibold">Agency</span>
              <span className="text-[9px] text-[#B99A72]">Priya (Planner)</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('aarav.meera@client.vivaah.com')}
              className="p-2 rounded bg-[#FAF7F2] border border-[#B99A72]/30 hover:border-[#241820] hover:bg-white text-center transition-colors font-medium text-[#241820]"
            >
              <span className="block font-semibold">Client</span>
              <span className="text-[9px] text-[#B99A72]">Aarav &amp; Meera</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('proposals@royalfeastcatering.com')}
              className="p-2 rounded bg-[#FAF7F2] border border-[#B99A72]/30 hover:border-[#241820] hover:bg-white text-center transition-colors font-medium text-[#241820]"
            >
              <span className="block font-semibold">Vendor</span>
              <span className="text-[9px] text-[#B99A72]">Chef Ranveer</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#B99A72]/40 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-[#B99A72]/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#B99A72]">lock_reset</span>
                <h3 className="font-serif text-lg text-[#241820] font-semibold">Reset Password</h3>
              </div>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-[#343A35] hover:text-[#241820] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#343A35] leading-relaxed">
              Enter your registered Vivaah account email. We will send a secure one-time link to update your password.
            </p>

            {resetMsg && (
              <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                resetMsg.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                <span className="material-symbols-outlined text-[16px]">
                  {resetMsg.type === 'success' ? 'check_circle' : 'error'}
                </span>
                <span>{resetMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                  Your Account Email
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  required
                  disabled={resetSubmitting}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none focus:border-[#241820]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="px-4 py-2 border border-[#B99A72]/30 text-[#343A35] rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetSubmitting}
                  className="px-4 py-2 bg-[#241820] text-[#F5EFE7] rounded-lg font-semibold uppercase tracking-wider hover:bg-[#34242e] transition-colors shadow-sm disabled:opacity-60 flex items-center gap-1.5"
                >
                  {resetSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Footer */}
      <div className="text-center text-[11px] text-[#343A35]/60">
        Vivaah Wedding Management Platform · End-to-End Encrypted Authentication
      </div>
    </div>
  );
}
