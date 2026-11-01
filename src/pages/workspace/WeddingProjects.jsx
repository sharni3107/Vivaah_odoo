import React from 'react';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';

export default function WeddingProjects() {
  const {
    weddings,
    selectedWeddingId,
    setSelectedWeddingId,
    selectedWedding,
    tasks,
    guests,
    events,
    financials
  } = useData();

  const weddingTasks = tasks.filter(t => t.wedding_id === selectedWeddingId);
  const weddingGuests = guests.filter(g => g.wedding_id === selectedWeddingId);
  const weddingEvents = events.filter(e => e.wedding_id === selectedWeddingId);

  const completedTasksCount = weddingTasks.filter(t => t.status === 'Done').length;
  const progressPct = weddingTasks.length > 0
    ? Math.round((completedTasksCount / weddingTasks.length) * 100)
    : selectedWedding?.progress || 0;

  const checkedInGuests = weddingGuests.filter(g => g.checked_in).length;

  return (
    <div className="p-8 space-y-8 max-w-[1720px] mx-auto w-full">
      {/* 1. Project Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-secondary/15 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase text-secondary font-semibold tracking-wider">Active Wedding Project:</span>
          <div className="flex items-center gap-2">
            {weddings.map((w) => (
              <button
                key={w.id}
                onClick={() => setSelectedWeddingId(w.id)}
                className={`px-3 py-1.5 rounded text-xs transition-all ${
                  selectedWeddingId === w.id
                    ? 'bg-primary text-surface font-semibold shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-primary border border-secondary/15'
                }`}
              >
                {w.couple_names}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/client"
            className="px-4 py-1.5 bg-surface-container-lowest text-primary border border-secondary/30 rounded text-xs font-semibold hover:bg-surface-container transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">open_in_new</span>
            <span>View Couple's Portal</span>
          </Link>
        </div>
      </div>

      {/* 2. Wedding Project Header Card & Details */}
      {!selectedWedding ? (
        <div className="p-12 text-center bg-surface-container-lowest border border-secondary/20 rounded-xl space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-surface-container flex items-center justify-center border border-secondary/30 text-secondary">
            <span className="material-symbols-outlined text-3xl">diamond</span>
          </div>
          <h2 className="text-xl font-serif text-primary">No Active Wedding Project Selected</h2>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
            {weddings.length === 0
              ? 'There are currently no wedding projects loaded in the workspace. In demo mode, initial records will be hydrated automatically.'
              : 'Please select a wedding project from the selector bar above to inspect wedding details, tasks, guests, and finances.'}
          </p>
          {weddings.length === 0 && (
            <div className="pt-2">
              <Link
                to="/workspace/enquiries"
                className="px-4 py-2 bg-primary text-surface rounded text-xs font-semibold hover:bg-secondary-dark transition-colors inline-flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                <span>Review Enquiries &amp; Clients</span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* 2. Wedding Project Header Card */}
          <div className="relative rounded-xl overflow-hidden shadow-lg border border-secondary/20 bg-primary-container text-surface">
            <div className="absolute inset-0 opacity-25">
              <img src={selectedWedding.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'} alt={selectedWedding.title || 'Wedding'} className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container via-primary-container/90 to-primary-container/70" />

            <div className="relative z-10 p-8 sm:p-10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded bg-secondary-container/20 text-secondary-fixed text-xs uppercase tracking-wider border border-secondary-fixed/30 font-semibold">
                    {selectedWedding.package_tier || 'Full-Service Planning'}
                  </span>
                  <span className="text-surface/60 text-xs font-tabular-nums">ID: {selectedWedding.id}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-secondary-fixed">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <span>Status: {selectedWedding.status || 'Active Planning'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl text-surface-bright font-serif">
                  {selectedWedding.title || selectedWedding.couple_names || 'Wedding Project'}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-sm text-surface/80">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-secondary-fixed">location_on</span>
                    <span>{selectedWedding.venue || 'Venue Pending'}, {selectedWedding.destination || 'Destination'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-secondary-fixed">calendar_today</span>
                    <span>{selectedWedding.dates || 'Dates Scheduled'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-secondary-fixed">payments</span>
                    <span className="font-tabular-nums font-semibold">₹{(((selectedWedding.contract_amount || 0) / 10000000)).toFixed(2)} Crore Budget</span>
                  </div>
                </div>
              </div>

              {/* Progress & Quick Stats Rail */}
              <div className="pt-4 border-t border-surface/15 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                {/* Progress Bar */}
                <div className="md:col-span-2 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="uppercase text-secondary-fixed font-semibold tracking-wider">
                      Wedding Execution Progress
                    </span>
                    <span className="font-tabular-nums text-surface font-semibold">{progressPct}% Complete</span>
                  </div>
                  <div className="w-full bg-surface/20 rounded-full h-2 overflow-hidden">
                    <div className="bg-secondary-fixed h-full rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
                  </div>
                  <p className="text-[11px] text-surface/60">{completedTasksCount} of {weddingTasks.length} tasks confirmed done</p>
                </div>

                {/* Guests Stats */}
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase text-surface/60 font-semibold tracking-wider">Guests Registered</span>
                  <div className="text-xl font-bold font-tabular-nums text-surface">
                    {checkedInGuests} <span className="text-sm font-normal text-surface/60">/ {selectedWedding.expected_guests || 0} expected</span>
                  </div>
                </div>

                {/* Assigned Lead Planner */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary font-bold text-xs border border-secondary-fixed/40">
                    PS
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-secondary-fixed block font-semibold tracking-wider">Assigned Planner</span>
                    <span className="text-xs font-semibold text-surface">{selectedWedding.assigned_planner || 'Senior Planner'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Project Details & Key Specifications */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-surface-container-lowest border border-secondary/20 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-secondary/15 pb-3">
                <span className="material-symbols-outlined text-secondary">favorite</span>
                <h3 className="text-base font-semibold text-primary">Couple Information</h3>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-on-surface-variant block">Couple Names:</span>
                  <span className="font-semibold text-primary text-sm">{selectedWedding.couple_names || '—'}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Primary Contact:</span>
                  <span className="font-medium text-primary">{selectedWedding.phone || 'Primary Contact on File'}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Email:</span>
                  <span className="font-medium text-primary">{selectedWedding.email || 'confidential@vivaah.internal'}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Special Requirements:</span>
                  <p className="text-on-surface-variant mt-1 leading-relaxed">
                    {selectedWedding.notes || 'Royal heritage theme with bespoke floral canopies, lakeside fireworks permission, and personalized royal hospitality fleet.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-surface-container-lowest border border-secondary/20 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-secondary/15 pb-3">
                <span className="material-symbols-outlined text-secondary">domain</span>
                <h3 className="text-base font-semibold text-primary">Venue &amp; Destination</h3>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-on-surface-variant block">Primary Venue:</span>
                  <span className="font-semibold text-primary text-sm">{selectedWedding.venue || 'Venue Pending'}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Destination:</span>
                  <span className="font-medium text-primary">{selectedWedding.destination || 'Destination Pending'}, India</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Celebration Schedule:</span>
                  <span className="font-medium text-primary">{selectedWedding.dates || 'Dates Pending'} ({weddingEvents.length} distinct events)</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Guest Accommodation:</span>
                  <span className="font-medium text-primary">120 Heritage Lake Suites &amp; 4 Royal Pavilions</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-surface-container-lowest border border-secondary/20 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-secondary/15 pb-3">
                <span className="material-symbols-outlined text-secondary">account_balance_wallet</span>
                <h3 className="text-base font-semibold text-primary">Financial Snapshot</h3>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Contract Total:</span>
                  <span className="font-bold text-primary font-tabular-nums text-sm">₹{(((selectedWedding.contract_amount || 0) / 10000000)).toFixed(2)} Cr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Client Payments Received:</span>
                  <span className="font-semibold text-secondary font-tabular-nums">₹{(((financials?.totalClientReceived || 0) / 100000)).toFixed(2)} L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Vendor Disbursements:</span>
                  <span className="font-semibold text-on-surface font-tabular-nums">₹{(((financials?.totalVendorPaid || 0) / 100000)).toFixed(2)} L</span>
                </div>
                <div className="pt-2 border-t border-secondary/15 flex justify-between items-center">
                  <span className="font-semibold text-primary">Estimated Agency Margin:</span>
                  <span className="font-bold text-secondary font-tabular-nums text-sm">₹{(((financials?.estimatedProfit || 0) / 100000)).toFixed(2)} L</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 4. Dedicated Module Navigation Launchpad */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-primary font-serif">Project Execution Modules</h2>
          <p className="text-xs text-on-surface-variant">Access dedicated workspace modules directly for this wedding project.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Link
            to="/workspace/tasks"
            className="p-5 rounded-lg bg-surface-container-lowest border border-secondary/20 hover:border-primary hover:shadow-md transition-all group flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-surface transition-colors">
              <span className="material-symbols-outlined text-[22px]">checklist</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-primary group-hover:text-primary-dim">Tasks &amp; Milestones</h4>
                <span className="material-symbols-outlined text-secondary text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">{weddingTasks.length} planning tasks ({completedTasksCount} completed)</p>
            </div>
          </Link>

          <Link
            to="/workspace/vendors"
            className="p-5 rounded-lg bg-surface-container-lowest border border-secondary/20 hover:border-primary hover:shadow-md transition-all group flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-surface transition-colors">
              <span className="material-symbols-outlined text-[22px]">storefront</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-primary group-hover:text-primary-dim">Vendors &amp; Quotations</h4>
                <span className="material-symbols-outlined text-secondary text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">Vendor directory, comparative quotations &amp; work orders</p>
            </div>
          </Link>

          <Link
            to="/workspace/guests"
            className="p-5 rounded-lg bg-surface-container-lowest border border-secondary/20 hover:border-primary hover:shadow-md transition-all group flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-surface transition-colors">
              <span className="material-symbols-outlined text-[22px]">group</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-primary group-hover:text-primary-dim">Guest Management</h4>
                <span className="material-symbols-outlined text-secondary text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">{weddingGuests.length} VIP guests, RSVP manifest &amp; QR scanning</p>
            </div>
          </Link>

          <Link
            to="/workspace/events"
            className="p-5 rounded-lg bg-surface-container-lowest border border-secondary/20 hover:border-primary hover:shadow-md transition-all group flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-surface transition-colors">
              <span className="material-symbols-outlined text-[22px]">calendar_month</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-primary group-hover:text-primary-dim">Event Management</h4>
                <span className="material-symbols-outlined text-secondary text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">{weddingEvents.length} ceremonies, schedule details &amp; vendor timings</p>
            </div>
          </Link>

          <Link
            to="/workspace/finance"
            className="p-5 rounded-lg bg-surface-container-lowest border border-secondary/20 hover:border-primary hover:shadow-md transition-all group flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-surface transition-colors">
              <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-primary group-hover:text-primary-dim">Financial Ledger</h4>
                <span className="material-symbols-outlined text-secondary text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">Milestone receipts, vendor disbursements &amp; expenses</p>
            </div>
          </Link>

          <Link
            to="/workspace/documents"
            className="p-5 rounded-lg bg-surface-container-lowest border border-secondary/20 hover:border-primary hover:shadow-md transition-all group flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-surface transition-colors">
              <span className="material-symbols-outlined text-[22px]">description</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-primary group-hover:text-primary-dim">Documents &amp; Agreements</h4>
                <span className="material-symbols-outlined text-secondary text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">Executed contracts, permits, floor plans &amp; uploads</p>
            </div>
          </Link>
        </div>
      </div>

      {/* 5. Agency Weddings Master Register */}
      <div className="bg-surface-container-lowest p-6 rounded-lg border border-secondary/20 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-secondary/15 pb-3">
          <div>
            <h3 className="text-base font-semibold text-primary">All Agency Wedding Projects</h3>
            <p className="text-xs text-on-surface-variant">Active master portfolio under agency management.</p>
          </div>
          <span className="text-xs px-2.5 py-1 bg-surface-container-low rounded border border-secondary/15 font-semibold text-secondary">
            {weddings.length} Active Weddings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant h-9 border-b border-secondary/15">
                <th className="px-4 py-2 font-semibold">Couple Names</th>
                <th className="px-4 py-2 font-semibold">Destination &amp; Venue</th>
                <th className="px-4 py-2 font-semibold">Dates</th>
                <th className="px-4 py-2 font-semibold">Tier</th>
                <th className="px-4 py-2 font-semibold">Budget</th>
                <th className="px-4 py-2 font-semibold">Status</th>
                <th className="px-4 py-2 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10">
              {weddings.map((w) => (
                <tr key={w.id} className={selectedWeddingId === w.id ? 'bg-surface-container-low/60' : 'hover:bg-surface-container-low/30'}>
                  <td className="px-4 py-3 font-semibold text-primary">
                    <div className="flex items-center gap-2">
                      {selectedWeddingId === w.id && (
                        <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                      )}
                      <span>{w.couple_names}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant">{w.venue}, {w.destination}</td>
                  <td className="px-4 py-3 font-tabular-nums text-on-surface">{w.dates}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-secondary-container/40 text-on-secondary-container font-medium">
                      {w.package_tier}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-tabular-nums font-semibold text-primary">
                    ₹{(w.contract_amount / 10000000).toFixed(2)} Cr
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-surface-container-high font-medium text-primary">
                      {w.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {selectedWeddingId === w.id ? (
                      <span className="text-secondary text-xs font-semibold">Currently Selected</span>
                    ) : (
                      <button
                        onClick={() => setSelectedWeddingId(w.id)}
                        className="px-3 py-1 bg-primary text-surface rounded text-xs font-medium hover:bg-primary-dim transition-colors"
                      >
                        Select Project
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
