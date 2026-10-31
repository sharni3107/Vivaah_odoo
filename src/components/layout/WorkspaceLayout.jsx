import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function WorkspaceLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin, isPlanner, isCoordinator, isFinance, isEnquiryExec } = useAuth();
  const { weddings, selectedWeddingId, setSelectedWeddingId, enquiries, tasks, createTask } = useData();

  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [quickTaskCategory, setQuickTaskCategory] = useState('Decoration');
  const [quickTaskPriority, setQuickTaskPriority] = useState('Medium');

  const pendingEnquiriesCount = enquiries.filter(e => e.status === 'New' || e.status === 'Contacted').length;
  const overdueTasksCount = tasks.filter(t => t.status !== 'Done' && new Date(t.due_date) < new Date()).length;

  const handleQuickCreateTask = (e) => {
    e.preventDefault();
    if (!quickTaskTitle) return;
    createTask({
      title: quickTaskTitle,
      category: quickTaskCategory,
      priority: quickTaskPriority,
      wedding_id: selectedWeddingId
    });
    setQuickTaskTitle('');
    setShowQuickCreate(false);
    navigate('/workspace/tasks');
  };

  const handleSignOut = () => {
    logout();
    navigate('/agency/login');
  };

  // Exactly 9 approved modules
  const navItems = [
    {
      label: 'Overview',
      path: '/workspace',
      icon: 'space_dashboard',
      exact: true,
      allowed: true
    },
    {
      label: 'Enquiries',
      path: '/workspace/enquiries',
      icon: 'contact_page',
      badge: pendingEnquiriesCount,
      badgeColor: 'bg-secondary-container text-on-secondary-container',
      allowed: isAdmin || isEnquiryExec || isPlanner
    },
    {
      label: 'Wedding Projects',
      path: '/workspace/weddings',
      icon: 'auto_awesome',
      allowed: isAdmin || isPlanner || isCoordinator
    },
    {
      label: 'Planning & Tasks',
      path: '/workspace/tasks',
      icon: 'checklist',
      badge: overdueTasksCount > 0 ? overdueTasksCount : null,
      badgeColor: 'bg-error-container text-on-error-container',
      allowed: isAdmin || isPlanner || isCoordinator
    },
    {
      label: 'Vendors & Quotations',
      path: '/workspace/vendors',
      icon: 'storefront',
      allowed: isAdmin || isPlanner
    },
    {
      label: 'Guests & Events',
      path: '/workspace/guests-events',
      icon: 'diversity_1',
      allowed: isAdmin || isPlanner || isCoordinator
    },
    {
      label: 'Finance & Payments',
      path: '/workspace/finance',
      icon: 'payments',
      allowed: isAdmin || isFinance || isPlanner
    },
    {
      label: 'Documents',
      path: '/workspace/documents',
      icon: 'description',
      allowed: isAdmin || isPlanner || isFinance
    },
    {
      label: 'Reports',
      path: '/workspace/reports',
      icon: 'insights',
      allowed: isAdmin || isFinance
    }
  ];

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased flex">
      {/* 1. FIXED SIDEBAR (w-72 / 288px) */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-y-auto border-r border-secondary/20">
        <div className="flex flex-col">
          {/* Logo & Brand Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-secondary/15">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-container text-secondary flex items-center justify-center border border-secondary/30">
                <span className="material-symbols-outlined text-[18px]">diamond</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-lg tracking-wider uppercase text-on-surface font-serif font-medium leading-none">
                  VIVAAH
                </span>
                <span className="font-label-sm text-[9px] uppercase tracking-widest text-secondary mt-0.5">
                  Agency Workspace
                </span>
              </div>
            </Link>
            <Link
              to="/"
              title="Visit Public Website"
              className="flex items-center justify-center w-7 h-7 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            </Link>
          </div>

          {/* Active Wedding Focus Selector */}
          <div className="px-4 pt-3 pb-1">
            <div className="p-2.5 bg-surface-container-low border border-secondary/20 rounded">
              <label className="text-[10px] font-label-caps uppercase tracking-wider text-secondary block font-semibold mb-1">
                Active Wedding Project
              </label>
              <select
                value={selectedWeddingId}
                onChange={(e) => setSelectedWeddingId(e.target.value)}
                className="w-full bg-surface-container-lowest text-xs py-1.5 px-2 border border-secondary/30 text-primary font-medium focus:outline-none"
              >
                {weddings.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.couple_names} ({w.destination.split(',')[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation Items (The 9 Core Modules) */}
          <div className="px-3 py-2">
            <div className="px-3 py-1 font-label-sm text-[10px] text-secondary uppercase tracking-widest font-semibold">
              Management Modules
            </div>
            <nav className="mt-1 flex flex-col gap-0.5">
              {navItems.filter(item => item.allowed).map((item) => {
                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3.5 py-2 rounded text-xs transition-colors ${
                      isActive
                        ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-[19px] ${isActive ? 'text-secondary-fixed' : 'text-on-surface-variant'}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-tabular-nums font-semibold ${item.badgeColor || 'bg-secondary-container text-on-secondary-container'}`}>
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom User Profile & Sign Out (No UI Role Switcher) */}
        <div className="p-3 border-t border-secondary/15 space-y-2">
          <div className="p-2.5 rounded bg-surface-container-low flex items-center justify-between border border-secondary/20">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-secondary/40"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-primary truncate leading-tight">
                  {currentUser?.name || 'Agency Member'}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-secondary truncate">
                  {currentUser?.designation || 'Staff'}
                </span>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1.5 text-on-surface-variant hover:text-error hover:bg-surface-container-high rounded transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>

          <div className="px-2 py-1 flex items-center justify-between text-[10px] text-on-surface-variant">
            <span>Vivaah Workspace v2.0</span>
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Connected
            </span>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="pl-72 flex-1 min-h-screen flex flex-col bg-surface">
        {/* Top Header */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-8 border-b border-secondary/15">
          {/* Breadcrumb & Search */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 font-label-md text-xs">
              <span className="text-on-surface-variant uppercase tracking-wider">Agency Workspace</span>
              <span className="material-symbols-outlined text-outline-variant text-[14px]">chevron_right</span>
              <span className="text-on-surface font-title-md font-semibold">
                {navItems.find(i => location.pathname === i.path || (i.path !== '/workspace' && location.pathname.startsWith(i.path)))?.label || 'Overview'}
              </span>
            </div>

            <div className="relative flex items-center hidden md:flex">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[16px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search weddings, clients, vendors, tasks..."
                className="w-80 h-9 pl-9 pr-10 rounded bg-surface-container-low text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/30 transition-colors"
              />
              <div className="absolute right-2.5 px-1.5 py-0.5 rounded bg-surface-container-highest text-[10px] text-on-surface-variant font-tabular-nums">
                ⌘K
              </div>
            </div>
          </div>

          {/* Quick Actions & Profile */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowQuickCreate(true)}
              className="h-9 px-4 rounded bg-primary-container text-on-primary font-title-md text-xs flex items-center gap-1.5 hover:bg-secondary-dark transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Quick Task</span>
            </button>

            <Link
              to="/workspace/tasks"
              title="Tasks Calendar"
              className="flex items-center justify-center w-8 h-8 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            </Link>

            <div className="h-4 w-px bg-secondary/20" />

            {/* User Profile Avatar */}
            <div className="flex items-center gap-3 pl-1">
              <div className="relative">
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="w-8 h-8 rounded-full object-cover border border-secondary/30"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface-container-lowest" />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-primary leading-tight">
                  {currentUser?.name}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-secondary">
                  {currentUser?.designation || currentUser?.role}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* 3. PAGE CONTENT WRAPPER */}
        <main className="w-full pt-16 flex-1 bg-surface">
          <Outlet />
        </main>
      </div>

      {/* QUICK CREATE TASK MODAL */}
      {showQuickCreate && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg p-6 shadow-2xl border border-secondary/30 space-y-4">
            <div className="flex items-center justify-between border-b border-secondary/20 pb-3">
              <h3 className="font-headline-sm text-lg text-primary font-serif">Quick Create Planning Task</h3>
              <button
                onClick={() => setShowQuickCreate(false)}
                className="text-on-surface-variant hover:text-primary text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickCreateTask} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-label-caps uppercase text-secondary font-semibold">Task Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Schedule floral sample mock-up inspection"
                  value={quickTaskTitle}
                  onChange={(e) => setQuickTaskTitle(e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low border border-secondary/20 focus:outline-none focus:border-primary text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-label-caps uppercase text-secondary font-semibold">Category</label>
                  <select
                    value={quickTaskCategory}
                    onChange={(e) => setQuickTaskCategory(e.target.value)}
                    className="w-full p-2 bg-surface-container-low border border-secondary/20 text-xs"
                  >
                    <option value="Initial Planning">Initial Planning</option>
                    <option value="Venue">Venue</option>
                    <option value="Decoration">Decoration</option>
                    <option value="Catering">Catering</option>
                    <option value="Photography">Photography</option>
                    <option value="Mehendi">Mehendi</option>
                    <option value="Sangeet">Sangeet</option>
                    <option value="Wedding Ceremony">Wedding Ceremony</option>
                    <option value="Reception">Reception</option>
                    <option value="Guest Coordination">Guest Coordination</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-label-caps uppercase text-secondary font-semibold">Priority</label>
                  <select
                    value={quickTaskPriority}
                    onChange={(e) => setQuickTaskPriority(e.target.value)}
                    className="w-full p-2 bg-surface-container-low border border-secondary/20 text-xs"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-secondary/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowQuickCreate(false)}
                  className="px-4 py-2 bg-surface-container text-on-surface-variant font-label-caps uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-surface font-label-caps uppercase text-xs hover:bg-secondary-dark shadow-sm"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
