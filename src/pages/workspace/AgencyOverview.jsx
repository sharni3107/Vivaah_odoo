import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { downloadFinancialReportPdf } from '../../lib/pdfHelper';

export default function AgencyOverview() {
  const navigate = useNavigate();
  const {
    weddings,
    setSelectedWeddingId,
    enquiries,
    tasks,
    clientPayments,
    vendorPayments,
    activityLogs,
    financials
  } = useData();

  const [filterType, setFilterType] = useState('All');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Compute metrics from actual data
  const activeWeddingsCount = weddings.length;
  const newEnquiriesCount = enquiries.filter(e => e.status === 'New' || e.status === 'Contacted').length;
  const upcomingWeddingsCount = weddings.filter(w => new Date(w.start_date) > new Date()).length;
  const overdueTasksCount = tasks.filter(t => t.status !== 'Done' && new Date(t.due_date) < new Date()).length;

  const filteredWeddings = weddings.filter(w => {
    if (filterType === 'All') return true;
    if (filterType === 'Full-Service') return w.package_tier.includes('Full-Service');
    if (filterType === 'Destination') return w.destination.includes('Como') || w.destination.includes('Goa') || w.destination.includes('Riviera');
    if (filterType === 'Near Execution') return w.progress > 50;
    return true;
  });

  const pendingClientAmount = clientPayments
    .filter(p => p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingVendorAmount = vendorPayments
    .reduce((sum, v) => sum + v.balance_due, 0);

  return (
    <div className="p-8 space-y-8 max-w-[1720px] mx-auto w-full">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary font-semibold">
              Autumn-Winter Executive Register
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
              Active Operations Desk
            </span>
          </div>
          <h1 className="font-headline-lg text-3xl sm:text-4xl text-on-surface font-serif tracking-tight">
            Good morning, Welcome to Vivaah.
          </h1>
          
        </div>

        {/* Action Cluster */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="h-9 px-3.5 rounded bg-surface-container-low border border-secondary/20 flex items-center gap-2 shadow-sm text-xs">
            <span className="material-symbols-outlined text-secondary text-[16px]">event_repeat</span>
            <span className="text-on-surface font-tabular-nums font-medium">Q4 2026 – Q1 2027</span>
            <span className="w-1 h-1 rounded-full bg-outline-variant" />
            <span className="font-label-sm text-[10px] text-secondary uppercase tracking-wider font-semibold">
              Peak Season
            </span>
          </div>

          <button
            onClick={() => {
              setIsGeneratingPdf(true);
              setTimeout(() => {
                downloadFinancialReportPdf(financials, weddings, clientPayments, vendorPayments);
                setIsGeneratingPdf(false);
              }, 250);
            }}
            disabled={isGeneratingPdf}
            className="h-9 px-4 rounded bg-surface-container-lowest text-on-surface font-title-md text-xs flex items-center gap-1.5 border border-secondary/20 shadow-sm hover:bg-surface-container-low transition-colors disabled:opacity-50"
            title="Download Official Financial Report PDF"
          >
            <span className="material-symbols-outlined text-secondary text-[16px]">
              {isGeneratingPdf ? 'hourglass_top' : 'file_download'}
            </span>
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'Financial Report'}</span>
          </button>

          <Link
            to="/workspace/enquiries"
            className="h-9 px-4 rounded bg-primary-container text-on-primary font-title-md text-xs flex items-center gap-1.5 shadow-md hover:bg-secondary-dark transition-colors"
          >
            <span className="material-symbols-outlined text-secondary text-[16px]">add_circle</span>
            <span>New Enquiries</span>
          </Link>
        </div>
      </div>

      {/* 2. WEDDING PROJECTS REGISTER TABLE */}
      <div className="p-6 rounded-lg bg-surface-container-lowest shadow-sm border border-secondary/20 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="font-headline-md text-xl text-primary font-serif">Active Wedding Projects</h2>
              <span className="px-2 py-0.5 rounded-full font-label-sm text-[10px] bg-surface-container text-on-surface font-tabular-nums">
                {weddings.length} Weddings
              </span>
            </div>
            
          </div>

          {/* Filter Pills */}
          <div className="flex items-center p-1 rounded bg-surface-container-low border border-secondary/20 text-xs">
            {['All', 'Full-Service', 'Destination', 'Near Execution'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-3 py-1 rounded transition-colors ${
                  filterType === f
                    ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Register Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant h-9 border-b border-secondary/15">
                <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold">Couple &amp; Destination</th>
                <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold">Event Schedule</th>
                <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold">Package Tier</th>
                <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold">Guests &amp; Check-ins</th>
                <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold">Contract Budget</th>
                <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold">Lead Planner</th>
                <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold">Progress</th>
                <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold text-right">Workspace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10">
              {filteredWeddings.map((w) => (
                <tr key={w.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={w.cover_image} alt={w.title} className="w-9 h-9 rounded object-cover border border-secondary/20" />
                      <div>
                        <span className="font-semibold text-primary block">{w.couple_names}</span>
                        <span className="text-[11px] text-on-surface-variant">{w.destination}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-tabular-nums text-on-surface">
                    {w.dates}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-secondary-container/40 text-on-secondary-container font-medium">
                      {w.package_tier}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-tabular-nums text-on-surface">
                    <span className="font-semibold text-primary">{w.actual_checkins}</span>
                    <span className="text-on-surface-variant"> / {w.expected_guests}</span>
                  </td>
                  <td className="px-4 py-3 font-tabular-nums font-semibold text-primary">
                    ₹{(w.contract_amount / 10000000).toFixed(2)} Cr
                  </td>
                  <td className="px-4 py-3 text-on-surface">
                    {w.assigned_planner}
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-24 bg-surface-container rounded-full h-1.5 overflow-hidden">
                      <div className="bg-secondary h-full rounded-full" style={{ width: `${w.progress}%` }} />
                    </div>
                    <span className="text-[10px] text-on-surface-variant font-tabular-nums mt-0.5 block">{w.progress}% Ready</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedWeddingId(w.id);
                        navigate('/workspace/weddings');
                      }}
                      className="px-3 py-1 bg-surface-container text-primary hover:bg-primary-container hover:text-on-primary rounded text-xs transition-colors border border-secondary/20 font-medium"
                    >
                      View Wedding →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. SPLIT BOTTOM SECTIONS: DEADLINES, RECENT ACTIVITY, FINANCIAL SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upcoming Deadlines (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-lg bg-surface-container-lowest shadow-sm border border-secondary/20 space-y-4">
          <div className="flex items-center justify-between border-b border-secondary/15 pb-3">
            <div className="space-y-0.5">
              <h3 className="font-headline-sm text-lg text-primary font-serif">Upcoming Deadlines</h3>
              <p className="text-xs text-on-surface-variant">Prioritized task deliverables</p>
            </div>
            <Link to="/workspace/tasks" className="text-xs text-secondary hover:underline font-medium">
              View All Tasks
            </Link>
          </div>

          <div className="space-y-3">
            {tasks.slice(0, 5).map((t) => (
              <div key={t.id} className="p-3 bg-surface-container-low border border-secondary/15 rounded flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold uppercase ${
                    t.priority === 'Urgent' ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'
                  }`}>
                    {t.priority}
                  </span>
                  <p className="font-medium text-primary leading-snug">{t.title}</p>
                  <span className="text-[10px] text-on-surface-variant block">Assigned: {t.assigned_member}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-tabular-nums text-[11px] text-on-surface font-semibold block">{t.due_date}</span>
                  <span className={`text-[10px] ${t.status === 'Done' ? 'text-secondary font-semibold' : 'text-on-surface-variant'}`}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-lg bg-surface-container-lowest shadow-sm border border-secondary/20 space-y-4">
          <div className="flex items-center justify-between border-b border-secondary/15 pb-3">
            <div className="space-y-0.5">
              <h3 className="font-headline-sm text-lg text-primary font-serif">Financial Ledger Summary</h3>
              <p className="text-xs text-on-surface-variant">Contract vs actual operational outlay</p>
            </div>
            <Link to="/workspace/finance" className="text-xs text-secondary hover:underline font-medium">
              Open Ledger
            </Link>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 bg-surface-container-low rounded border border-secondary/15 space-y-2">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Total Contract Revenue:</span>
                <span className="font-bold text-primary font-tabular-nums">₹{(financials.totalRevenue / 10000000).toFixed(2)} Cr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Total Client Advances Received:</span>
                <span className="font-semibold text-secondary font-tabular-nums">₹{(financials.totalClientReceived / 100000).toFixed(2)} Lakhs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Total Operational Expenses:</span>
                <span className="font-semibold text-on-surface font-tabular-nums">₹{(financials.totalProjectExpenses / 100000).toFixed(2)} Lakhs</span>
              </div>
              <div className="pt-2 border-t border-secondary/20 flex justify-between text-sm">
                <span className="font-bold text-primary font-serif">Estimated Net Profit:</span>
                <span className="font-bold text-secondary font-tabular-nums">₹{(financials.estimatedProfit / 100000).toFixed(2)} Lakhs ({financials.profitMargin}%)</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-label-caps text-[10px] uppercase text-secondary font-semibold block">
                Pending Disbursements
              </span>
              <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded border border-secondary/15">
                <div>
                  <span className="font-medium text-primary block">Client Payments Outstanding</span>
                  <span className="text-[10px] text-on-surface-variant">Awaiting next milestone</span>
                </div>
                <span className="font-bold text-primary font-tabular-nums">₹{(financials.totalClientPending / 100000).toFixed(2)} L</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded border border-secondary/15">
                <div>
                  <span className="font-medium text-primary block">Vendor Balances Due</span>
                  <span className="text-[10px] text-on-surface-variant">Venue, decor &amp; catering</span>
                </div>
                <span className="font-bold text-error font-tabular-nums">₹{(financials.totalVendorBalanceDue / 100000).toFixed(2)} L</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time Chronological Activity Ledger (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-lg bg-surface-container-lowest shadow-sm border border-secondary/20 space-y-4">
          <div className="flex items-center justify-between border-b border-secondary/15 pb-3">
            <div className="space-y-0.5">
              <h3 className="font-headline-sm text-lg text-primary font-serif">Recent Operations Audit</h3>
              <p className="text-xs text-on-surface-variant">Synchronized team actions</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          </div>

          <div className="space-y-3">
            {activityLogs.slice(0, 5).map((act) => (
              <div key={act.id} className="p-2.5 bg-surface-container-low rounded border border-secondary/15 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-primary">{act.action}</span>
                  <span className="text-[10px] text-on-surface-variant font-tabular-nums">
                    {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-on-surface-variant text-[11px] leading-snug">{act.details}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-secondary">
                  <span className="material-symbols-outlined text-[12px]">person</span>
                  <span>{act.actor_name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
