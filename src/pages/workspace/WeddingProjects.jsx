import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';

export default function WeddingProjects() {
  const {
    weddings,
    selectedWeddingId,
    setSelectedWeddingId,
    selectedWedding,
    tasks,
    updateTaskStatus,
    vendors,
    quotations,
    guests,
    events,
    clientPayments,
    vendorPayments,
    expenses,
    documents,
    financials
  } = useData();

  const [activeTab, setActiveTab] = useState('Overview');

  const weddingTasks = tasks.filter(t => t.wedding_id === selectedWeddingId);
  const weddingGuests = guests.filter(g => g.wedding_id === selectedWeddingId);
  const weddingEvents = events.filter(e => e.wedding_id === selectedWeddingId);
  const weddingDocuments = documents.filter(d => d.wedding_id === selectedWeddingId);
  const weddingQuotations = quotations.filter(q => q.wedding_id === selectedWeddingId);

  const completedTasksCount = weddingTasks.filter(t => t.status === 'Done').length;
  const progressPct = weddingTasks.length > 0 ? Math.round((completedTasksCount / weddingTasks.length) * 100) : selectedWedding.progress;

  const checkedInGuests = weddingGuests.filter(g => g.checked_in).length;

  return (
    <div className="p-8 space-y-8 max-w-[1720px] mx-auto w-full">
      {/* 1. Project Selector Bar (if multiple weddings) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-secondary/15 pb-4">
        <div className="flex items-center gap-3">
          <span className="font-label-caps text-[10px] uppercase text-secondary font-semibold">Active Project Focus:</span>
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

      {/* 2. Hero Dossier Header Card */}
      <div className="relative rounded-xl overflow-hidden shadow-lg border border-secondary/20 bg-primary-container text-surface">
        <div className="absolute inset-0 opacity-25">
          <img src={selectedWedding.cover_image} alt={selectedWedding.title} className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-container via-primary-container/90 to-primary-container/70" />

        <div className="relative z-10 p-8 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded bg-secondary-container/20 text-secondary-fixed text-xs font-label-caps uppercase tracking-wider border border-secondary-fixed/30 font-semibold">
                {selectedWedding.package_tier}
              </span>
              <span className="text-surface/60 text-xs font-tabular-nums">ID: {selectedWedding.id}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-secondary-fixed">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span>Status: {selectedWedding.status}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-display-lg text-3xl sm:text-5xl text-surface-bright font-serif">
              {selectedWedding.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-surface/80">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-secondary-fixed">location_on</span>
                <span>{selectedWedding.venue}, {selectedWedding.destination}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-secondary-fixed">calendar_today</span>
                <span>{selectedWedding.dates}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-secondary-fixed">payments</span>
                <span className="font-tabular-nums font-semibold">₹{(selectedWedding.contract_amount / 10000000).toFixed(2)} Crore Budget</span>
              </div>
            </div>
          </div>

          {/* Progress & Quick Stats Rail */}
          <div className="pt-4 border-t border-surface/15 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {/* Progress Bar */}
            <div className="md:col-span-2 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-label-caps uppercase text-secondary-fixed font-semibold tracking-wider">
                  Master Execution Progress
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
              <span className="text-[10px] font-label-caps uppercase text-surface/60">Guests Registered</span>
              <div className="text-xl font-bold font-tabular-nums text-surface">
                {checkedInGuests} <span className="text-sm font-normal text-surface/60">/ {selectedWedding.expected_guests}</span>
              </div>
            </div>

            {/* Assigned Lead Planner */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary font-bold text-xs border border-secondary-fixed/40">
                PS
              </div>
              <div>
                <span className="text-[10px] font-label-caps uppercase text-secondary-fixed block">Lead Wedding Architect</span>
                <span className="text-xs font-semibold text-surface">{selectedWedding.assigned_planner}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Master Workspace Section Navigation Tabs */}
      <div className="border-b border-secondary/20 flex gap-1 overflow-x-auto text-xs">
        {['Overview', 'Tasks', 'Vendors', 'Guests & Events', 'Finance', 'Documents'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 font-title-md uppercase tracking-wider text-xs border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'border-primary text-primary font-bold bg-surface-container-low/50'
                : 'border-transparent text-on-surface-variant hover:text-primary hover:border-secondary/40'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 4. Tab Content Panels */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Itinerary & Next Milestones (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-lg bg-surface-container-lowest border border-secondary/20 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-secondary/15 pb-3">
                <h3 className="font-headline-sm text-lg text-primary font-serif">Upcoming Scheduled Events</h3>
                <span className="text-xs text-secondary font-medium">{weddingEvents.length} Days of Celebration</span>
              </div>

              <div className="space-y-3">
                {weddingEvents.map((evt) => (
                  <div key={evt.id} className="p-3 bg-surface-container-low rounded border border-secondary/15 flex items-start justify-between text-xs">
                    <div className="space-y-1">
                      <span className="font-semibold text-primary text-sm">{evt.event_name}</span>
                      <p className="text-on-surface-variant">{evt.description}</p>
                      <div className="flex items-center gap-4 text-[11px] text-secondary font-medium pt-1">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">pin_drop</span> {evt.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">checkroom</span> {evt.dress_code}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 font-tabular-nums">
                      <span className="font-bold text-primary block">{evt.date}</span>
                      <span className="text-on-surface-variant text-[11px]">{evt.start_time} - {evt.end_time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Urgent Tasks */}
            <div className="p-6 rounded-lg bg-surface-container-lowest border border-secondary/20 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-secondary/15 pb-3">
                <h3 className="font-headline-sm text-lg text-primary font-serif">Immediate Phase Deliverables</h3>
                <button onClick={() => setActiveTab('Tasks')} className="text-xs text-secondary font-medium hover:underline">
                  Open Tasks Kanban →
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {weddingTasks.slice(0, 4).map((t) => (
                  <div key={t.id} className="p-2.5 bg-surface-container-low rounded border border-secondary/15 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${t.priority === 'Urgent' ? 'bg-error' : 'bg-secondary'}`} />
                      <span className="font-medium text-primary">{t.title}</span>
                    </div>
                    <span className="font-tabular-nums text-on-surface-variant text-[11px]">{t.due_date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Financial Snapshot & Confirmed Vendors (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-lg bg-surface-container-lowest border border-secondary/20 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-secondary/15 pb-3">
                <h3 className="font-headline-sm text-lg text-primary font-serif">Commercial Health</h3>
                <button onClick={() => setActiveTab('Finance')} className="text-xs text-secondary font-medium hover:underline">
                  Full Ledger →
                </button>
              </div>

              <div className="p-4 bg-surface-container-low rounded border border-secondary/15 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Contract Total:</span>
                  <span className="font-bold text-primary font-tabular-nums">₹{(selectedWedding.contract_amount / 10000000).toFixed(2)} Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Settled In Escrow:</span>
                  <span className="font-semibold text-secondary font-tabular-nums">₹{(financials.totalClientReceived / 100000).toFixed(2)} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Disbursed to Vendors:</span>
                  <span className="font-semibold text-on-surface font-tabular-nums">₹{(financials.totalVendorPaid / 100000).toFixed(2)} L</span>
                </div>
                <div className="pt-2 border-t border-secondary/20 flex justify-between text-sm">
                  <span className="font-bold text-primary font-serif">Project Net Profit:</span>
                  <span className="font-bold text-secondary font-tabular-nums">₹{(financials.estimatedProfit / 100000).toFixed(2)} L</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-surface-container-lowest border border-secondary/20 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-secondary/15 pb-3">
                <h3 className="font-headline-sm text-lg text-primary font-serif">Confirmed Guild Partners</h3>
                <button onClick={() => setActiveTab('Vendors')} className="text-xs text-secondary font-medium hover:underline">
                  Procurement →
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                {vendors.filter(v => v.confirmed_assignments?.includes(selectedWedding.title)).map((v) => (
                  <div key={v.id} className="p-2.5 bg-surface-container-low rounded border border-secondary/15 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-primary block">{v.name}</span>
                      <span className="text-[10px] text-on-surface-variant">{v.category}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-secondary-container text-on-secondary-container font-medium">
                      Confirmed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'Tasks' && (
        <div className="bg-surface-container-lowest p-6 rounded-lg border border-secondary/20 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-xl text-primary font-serif">
              Master Planning Checklist ({weddingTasks.length} Tasks)
            </h3>
            <span className="text-xs text-on-surface-variant">Linked to {selectedWedding.couple_names}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant h-9 border-b border-secondary/15">
                  <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold">Title</th>
                  <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold">Category</th>
                  <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold">Assigned Member</th>
                  <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold">Due Date</th>
                  <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold">Priority</th>
                  <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {weddingTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-surface-container-low/50">
                    <td className="px-4 py-3 font-medium text-primary">{t.title}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{t.category}</td>
                    <td className="px-4 py-3 text-on-surface">{t.assigned_member}</td>
                    <td className="px-4 py-3 font-tabular-nums text-on-surface">{t.due_date}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        t.priority === 'Urgent' ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={t.status}
                        onChange={(e) => updateTaskStatus(t.id, e.target.value)}
                        className="bg-surface-container-low p-1 border border-secondary/20 text-xs rounded"
                      >
                        <option value="To Plan">To Plan</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Review">Review</option>
                        <option value="Done">Done</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vendors Tab */}
      {activeTab === 'Vendors' && (
        <div className="bg-surface-container-lowest p-6 rounded-lg border border-secondary/20 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-xl text-primary font-serif">
              Vendor Quotations &amp; Proposals
            </h3>
            <span className="text-xs text-on-surface-variant">3 Comparative Catering Bids</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {weddingQuotations.map((q) => (
              <div key={q.id} className="p-5 rounded bg-surface-container-low border border-secondary/20 space-y-4 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-primary text-sm">{q.vendor_name}</h4>
                    <span className="text-[10px] text-on-surface-variant uppercase">Catering &amp; Banqueting</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    q.status === 'Confirmed' || q.status === 'Client Approved' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high'
                  }`}>
                    {q.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-lg font-bold font-serif text-primary font-tabular-nums">
                    ₹{q.total_quoted_amount.toLocaleString('en-IN')}
                  </div>
                  <span className="text-on-surface-variant text-[11px]">₹{q.price_per_plate_or_service}/cover</span>
                </div>

                <p className="text-on-surface-variant text-[11px] leading-relaxed">{q.service_inclusions}</p>

                <div className="pt-2 border-t border-secondary/15 flex items-center justify-between">
                  <span className="text-[10px] text-secondary">
                    {q.shared_with_client ? '✓ Shared with Couple' : 'Internal Bid Only'}
                  </span>
                  <a
                    href={q.proposal_pdf_url}
                    onClick={(e) => { e.preventDefault(); alert(`Opening proposal attachment for ${q.vendor_name}`); }}
                    className="text-primary hover:underline font-semibold"
                  >
                    View PDF ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guests & Events Tab */}
      {activeTab === 'Guests & Events' && (
        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-lg border border-secondary/20 space-y-4 shadow-sm text-xs">
            <h3 className="font-headline-sm text-xl text-primary font-serif">
              Royal RSVP Manifest ({weddingGuests.length} VIP Guests)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant h-9 border-b border-secondary/15">
                    <th className="px-4 py-2 font-label-sm uppercase">Guest Name</th>
                    <th className="px-4 py-2 font-label-sm uppercase">Family Group</th>
                    <th className="px-4 py-2 font-label-sm uppercase">Category</th>
                    <th className="px-4 py-2 font-label-sm uppercase">RSVP Status</th>
                    <th className="px-4 py-2 font-label-sm uppercase">Check-in</th>
                    <th className="px-4 py-2 font-label-sm uppercase">QR Pass Code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/10">
                  {weddingGuests.map((g) => (
                    <tr key={g.id}>
                      <td className="px-4 py-2.5 font-semibold text-primary">{g.name} (+{g.plus_ones})</td>
                      <td className="px-4 py-2.5 text-on-surface-variant">{g.family_group}</td>
                      <td className="px-4 py-2.5">{g.invitation_category}</td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-secondary-container/40 text-on-secondary-container font-medium">
                          {g.rsvp_status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${g.checked_in ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container'}`}>
                          {g.checked_in ? '✓ Checked In' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[10px] text-secondary">{g.qr_code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Finance Tab */}
      {activeTab === 'Finance' && (
        <div className="bg-surface-container-lowest p-6 rounded-lg border border-secondary/20 space-y-6 shadow-sm text-xs">
          <h3 className="font-headline-sm text-xl text-primary font-serif">
            Financial Ledger &amp; Payments Schedule
          </h3>

          <div className="space-y-4">
            <h4 className="font-label-caps uppercase text-secondary font-semibold">Client Milestones</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant h-9">
                    <th className="px-4 py-2 font-label-sm uppercase">Milestone</th>
                    <th className="px-4 py-2 font-label-sm uppercase">Amount</th>
                    <th className="px-4 py-2 font-label-sm uppercase">Due Date</th>
                    <th className="px-4 py-2 font-label-sm uppercase">Status</th>
                    <th className="px-4 py-2 font-label-sm uppercase">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/10">
                  {clientPayments.filter(p => p.wedding_id === selectedWeddingId).map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-3 font-semibold text-primary">{p.milestone_name}</td>
                      <td className="px-4 py-3 font-tabular-nums font-bold text-primary">₹{p.amount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 font-tabular-nums">{p.due_date}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${p.status === 'Received' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px] text-on-surface-variant">{p.reference_no}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'Documents' && (
        <div className="bg-surface-container-lowest p-6 rounded-lg border border-secondary/20 space-y-6 shadow-sm text-xs">
          <h3 className="font-headline-sm text-xl text-primary font-serif">
            Stored Contracts &amp; Blueprints ({weddingDocuments.length} Files)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weddingDocuments.map((doc) => (
              <div key={doc.id} className="p-4 bg-surface-container-low rounded border border-secondary/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-[24px]">picture_as_pdf</span>
                  <div>
                    <span className="font-semibold text-primary block">{doc.file_name}</span>
                    <span className="text-[10px] text-on-surface-variant">{doc.category} • {doc.file_size}</span>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Downloading ${doc.file_name}`)}
                  className="px-3 py-1 bg-surface-container-lowest text-primary rounded border border-secondary/20 hover:bg-primary hover:text-surface transition-colors"
                >
                  Download ↓
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
