import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ClientLoginPage() {
  const navigate = useNavigate();
  const { users, loginAs } = useAuth();
  const clientUser = users.find(u => u.role === 'client') || {
    id: 'user-client',
    name: 'Aarav & Meera',
    email: 'aarav.meera@client.vivaah.com',
    avatar: 'https://images.unsplash.com/photo-1621801306168-c61a5b820a9a?auto=format&fit=crop&w=200&q=80'
  };

  const [email, setEmail] = useState(clientUser.email);
  const [password, setPassword] = useState('vivaah2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your client email.');
      return;
    }
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched && matched.role === 'client') {
      loginAs(matched.id);
      navigate('/client');
    } else {
      setError('Invalid couple credentials. Please verify your registered email address.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F5EFE7] flex flex-col justify-between p-6 sm:p-12 text-[#241820] font-sans antialiased">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#241820] text-[#B99A72] flex items-center justify-center border border-[#B99A72]/40 shadow-sm transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined text-[20px]">favorite</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl tracking-[0.16em] uppercase font-serif text-[#241820] font-medium leading-none">
              VIVAAH
            </span>
            <span className="text-[9.5px] uppercase tracking-widest text-[#B99A72] mt-1 font-semibold">
              Client Portal
            </span>
          </div>
        </Link>
        <Link to="/" className="text-xs uppercase text-[#241820]/70 hover:text-[#241820] tracking-wider font-medium transition-colors">
          ← Return to Website
        </Link>
      </div>

      {/* Main Login Card (Light Theme) */}
      <div className="max-w-md mx-auto w-full my-8 bg-white p-8 sm:p-10 rounded-2xl border border-[#B99A72]/30 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B99A72] font-bold block">
            Couple Access
          </span>
          <h1 className="text-2xl sm:text-3xl text-[#241820] font-serif font-normal">
            Your Wedding Suite
          </h1>
          <p className="text-xs text-[#343A35]/80 leading-relaxed">
            Review shared vendor proposals, approve tasting menus, track your event schedule, and manage guest RSVPs.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Demo Couple Quick Fill */}
        <div className="p-3.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-xl space-y-2 text-xs">
          <span className="text-[10px] uppercase tracking-wider text-[#343A35] font-semibold block">
            Demo Couple Account:
          </span>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img src={clientUser.avatar} alt="Aarav & Meera" className="w-9 h-9 rounded-full object-cover shrink-0 border border-[#B99A72]/40" />
              <div className="truncate">
                <p className="font-semibold text-[#241820] truncate">{clientUser.name}</p>
                <p className="text-[10px] text-[#B99A72] truncate font-medium">{clientUser.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail(clientUser.email);
                setPassword('vivaah2026');
                setError('');
              }}
              className="px-2.5 py-1 bg-white border border-[#B99A72]/50 text-[#241820] rounded text-[10px] uppercase tracking-wider font-semibold hover:bg-[#B99A72] hover:text-white transition-colors shrink-0 shadow-xs"
            >
              Fill Demo
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 pt-2 border-t border-[#B99A72]/20 text-xs">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
              Registered Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] font-medium focus:outline-none focus:border-[#241820] focus:bg-white transition-colors"
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
              required
              className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none focus:border-[#241820] focus:bg-white transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#241820] text-[#F5EFE7] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#34242e] transition-colors shadow-md mt-2 flex items-center justify-center gap-2 group"
          >
            <span>Open Wedding Portal</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-[#343A35]/60">
        Private Portal · Encrypted access reserved exclusively for the couple
      </div>
    </div>
  );
}
