import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AgencyLoginPage() {
  const navigate = useNavigate();
  const { users, loginAs } = useAuth();
  const agencyUsers = users.filter(u =>
    ['admin', 'wedding_planner', 'event_coordinator', 'finance_executive', 'enquiry_executive'].includes(u.role)
  );

  const [selectedUser, setSelectedUser] = useState(agencyUsers[0]);
  const [email, setEmail] = useState(agencyUsers[0]?.email || '');
  const [password, setPassword] = useState('vivaah2026');
  const [error, setError] = useState('');

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setEmail(user.email);
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your agency email address.');
      return;
    }
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched && ['admin', 'wedding_planner', 'event_coordinator', 'finance_executive', 'enquiry_executive'].includes(matched.role)) {
      loginAs(matched.id);
      navigate('/workspace');
    } else {
      setError('Invalid agency credentials. Please check your email.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#241820] flex flex-col justify-between p-6 sm:p-12 text-[#F5EFE7]">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#34242e] text-[#B99A72] flex items-center justify-center border border-[#B99A72]/40">
            <span className="material-symbols-outlined text-[18px]">diamond</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl tracking-wider uppercase font-serif text-[#F5EFE7] font-medium leading-none">
              VIVAAH
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#B99A72] mt-0.5">
              Agency Workspace
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
            Agency Member Access
          </span>
          <h1 className="text-2xl text-[#F5EFE7] font-serif">
            Sign In to Workspace
          </h1>
          <p className="text-xs text-[#F5EFE7]/70">
            Internal access for Vivaah wedding planners, coordinators, and directors.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs rounded">
            {error}
          </div>
        )}

        {/* Quick Member Selector */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider text-[#B99A72] font-semibold block">
            Select Member Account:
          </label>
          <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
            {agencyUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleSelectUser(u)}
                className={`p-2 rounded border text-left flex items-center gap-2.5 transition-all text-xs ${
                  selectedUser?.id === u.id
                    ? 'bg-[#B99A72]/20 border-[#B99A72] text-[#F5EFE7]'
                    : 'bg-[#241820]/60 border-[#B99A72]/15 text-[#F5EFE7]/80 hover:bg-[#34242e]'
                }`}
              >
                <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover shrink-0 border border-[#B99A72]/30" />
                <div className="truncate flex-1">
                  <span className="font-semibold block truncate leading-tight text-[#F5EFE7]">{u.name}</span>
                  <span className="text-[10px] text-[#B99A72] block truncate">{u.designation}</span>
                </div>
                {selectedUser?.id === u.id && (
                  <span className="material-symbols-outlined text-xs text-[#B99A72]">check_circle</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 pt-2 border-t border-[#B99A72]/20 text-xs">
          <div>
            <label className="text-[10px] uppercase text-[#B99A72] font-semibold block mb-1">
              Email Address
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
            <span>Enter Agency Workspace</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-[#F5EFE7]/50">
        Vivaah Wedding Management Platform · Authorised Agency Personnel Only
      </div>
    </div>
  );
}
