import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function VendorLoginPage() {
  const navigate = useNavigate();
  const { users, loginAs } = useAuth();
  const vendorUser = users.find(u => u.role === 'vendor') || {
    id: 'user-vendor-catering',
    name: 'Chef Ranveer Brar',
    email: 'proposals@royalfeastcatering.com'
  };

  const [email, setEmail] = useState(vendorUser.email);
  const [password, setPassword] = useState('vivaah2026');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your vendor email.');
      return;
    }
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched && matched.role === 'vendor') {
      loginAs(matched.id);
      navigate('/vendor');
    } else {
      setError('Invalid vendor credentials. Please check your partner registration email.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#241820] flex flex-col justify-between p-6 sm:p-12 text-[#F5EFE7]">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#34242e] text-[#B99A72] flex items-center justify-center border border-[#B99A72]/40">
            <span className="material-symbols-outlined text-[18px]">storefront</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl tracking-wider uppercase font-serif text-[#F5EFE7] font-medium leading-none">
              VIVAAH
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#B99A72] mt-0.5">
              Vendor Partner Portal
            </span>
          </div>
        </Link>
        <Link to="/" className="text-xs uppercase text-[#F5EFE7]/70 hover:text-[#B99A72] tracking-wider transition-colors">
          ← Return to Website
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-8 bg-[#2d1f28] p-8 sm:p-10 rounded-xl border border-[#B99A72]/30 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B99A72] font-semibold block">
            Vendor Partner Access
          </span>
          <h1 className="text-2xl text-[#F5EFE7] font-serif">
            Vendor Quotations &amp; Schedules
          </h1>
          <p className="text-xs text-[#F5EFE7]/70">
            Submit bids, track client approvals, and coordinate arrival times for confirmed weddings.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs rounded">
            {error}
          </div>
        )}

        {/* Demo Vendor Quick Fill */}
        <div className="p-3 bg-[#241820] border border-[#B99A72]/20 rounded space-y-1.5 text-xs">
          <span className="text-[10px] uppercase tracking-wider text-[#B99A72] font-semibold block">
            Demo Vendor Account:
          </span>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={vendorUser.avatar} alt="Chef Ranveer Brar" className="w-8 h-8 rounded-full object-cover border border-[#B99A72]/30" />
              <div>
                <p className="font-semibold text-[#F5EFE7]">{vendorUser.name}</p>
                <p className="text-[10px] text-[#B99A72]">Royal Feast Catering</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail(vendorUser.email);
                setPassword('vivaah2026');
              }}
              className="px-2 py-1 bg-[#B99A72]/20 border border-[#B99A72]/40 text-[#B99A72] rounded text-[10px] uppercase tracking-wider hover:bg-[#B99A72]/30"
            >
              Fill Credentials
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 pt-2 border-t border-[#B99A72]/20 text-xs">
          <div>
            <label className="text-[10px] uppercase text-[#B99A72] font-semibold block mb-1">
              Registered Vendor Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2.5 bg-[#241820] border border-[#B99A72]/30 rounded text-xs text-[#F5EFE7] focus:outline-none focus:border-[#B99A72]"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-[#B99A72] font-semibold block mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2.5 bg-[#241820] border border-[#B99A72]/30 rounded text-xs text-[#F5EFE7] focus:outline-none focus:border-[#B99A72]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#B99A72] text-[#241820] rounded text-xs font-semibold uppercase tracking-wider hover:bg-[#cbb08d] transition-colors shadow-md mt-2 flex items-center justify-center gap-2"
          >
            <span>Open Vendor Portal</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-[#F5EFE7]/50">
        Vendor Partner Network · Confidential RFPs &amp; Event Schedules
      </div>
    </div>
  );
}
