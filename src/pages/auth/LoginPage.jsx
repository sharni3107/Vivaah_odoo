import React from 'react';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen bg-[#241820] flex flex-col justify-between p-6 sm:p-12 text-[#F5EFE7]">
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
              Secure Portals
            </span>
          </div>
        </Link>
        <Link to="/" className="text-xs uppercase text-[#F5EFE7]/70 hover:text-[#B99A72] tracking-wider transition-colors">
          ← Return to Website
        </Link>
      </div>

      <div className="max-w-md mx-auto w-full my-8 bg-[#2d1f28] p-8 sm:p-10 rounded-xl border border-[#B99A72]/30 shadow-2xl space-y-6 text-center">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B99A72] font-semibold block">
            Access Verification
          </span>
          <h1 className="text-2xl text-[#F5EFE7] font-serif">
            Select Your Dedicated Portal
          </h1>
          <p className="text-xs text-[#F5EFE7]/70">
            Each role operates within a private, encrypted environment.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <Link
            to="/agency/login"
            className="w-full p-4 bg-[#241820] border border-[#B99A72]/30 rounded-lg flex items-center justify-between text-left hover:border-[#B99A72] hover:bg-[#34242e] transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#B99A72] text-xl">admin_panel_settings</span>
              <div>
                <p className="font-semibold text-sm text-[#F5EFE7]">Agency Workspace</p>
                <p className="text-[11px] text-[#F5EFE7]/60">For Planners, Coordinators &amp; Directors</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#B99A72] text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>

          <Link
            to="/client/login"
            className="w-full p-4 bg-[#241820] border border-[#B99A72]/30 rounded-lg flex items-center justify-between text-left hover:border-[#B99A72] hover:bg-[#34242e] transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#B99A72] text-xl">favorite</span>
              <div>
                <p className="font-semibold text-sm text-[#F5EFE7]">Client Portal</p>
                <p className="text-[11px] text-[#F5EFE7]/60">For The Couple (Aarav &amp; Meera)</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#B99A72] text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>

          <Link
            to="/vendor/login"
            className="w-full p-4 bg-[#241820] border border-[#B99A72]/30 rounded-lg flex items-center justify-between text-left hover:border-[#B99A72] hover:bg-[#34242e] transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#B99A72] text-xl">storefront</span>
              <div>
                <p className="font-semibold text-sm text-[#F5EFE7]">Vendor Partner Portal</p>
                <p className="text-[11px] text-[#F5EFE7]/60">For Caterers, Decorators &amp; Partners</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#B99A72] text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
      </div>

      <div className="text-center text-[11px] text-[#F5EFE7]/50">
        Vivaah Wedding Management Platform · End-to-End Encryption
      </div>
    </div>
  );
}
