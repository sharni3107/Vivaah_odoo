import React from 'react';
import { useData } from '../../context/DataContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function ReportsAnalytics() {
  const { weddings, vendors, clientPayments, vendorPayments, expenses, financials } = useData();

  // Agency level totals
  const totalWeddings = weddings.length;
  const totalContractRevenue = weddings.reduce((sum, w) => sum + w.contract_amount, 0);
  const totalClientReceived = clientPayments.filter(p => p.status === 'Received').reduce((sum, p) => sum + p.amount, 0);
  const totalClientOutstanding = clientPayments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
  const totalVendorAgreed = vendorPayments.reduce((sum, v) => sum + v.agreed_amount + v.additional_charges, 0);
  const totalVendorPaid = vendorPayments.reduce((sum, v) => sum + v.amount_paid, 0);
  const totalVendorBalancesDue = vendorPayments.reduce((sum, v) => sum + v.balance_due, 0);
  const totalExpenses = totalVendorAgreed + expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalEstimatedProfit = totalContractRevenue - totalExpenses;

  // Chart Data 1: Revenue vs Expenses by Wedding
  const revenueExpensesData = weddings.map((w) => {
    const wExpenses = expenses.filter(e => e.wedding_id === w.id).reduce((sum, e) => sum + e.amount, 0);
    const wVendorCost = vendorPayments.filter(v => v.wedding_id === w.id).reduce((sum, v) => sum + v.agreed_amount, 0);
    const estExp = wVendorCost + wExpenses || w.contract_amount * 0.65;
    return {
      name: w.couple_names.split('&')[0].trim(),
      Revenue: Math.round(w.contract_amount / 100000), // in Lakhs
      Expenses: Math.round(estExp / 100000),
      Profit: Math.round((w.contract_amount - estExp) / 100000)
    };
  });

  // Chart Data 2: Wedding Count by Package
  const packageCounts = weddings.reduce((acc, w) => {
    acc[w.package_tier] = (acc[w.package_tier] || 0) + 1;
    return acc;
  }, {});

  const packagePieData = Object.keys(packageCounts).map((pkg) => ({
    name: pkg,
    value: packageCounts[pkg]
  }));

  const COLORS = ['#241820', '#B99A72', '#A77D83', '#343A35'];

  return (
    <div className="p-8 space-y-8 max-w-[1720px] mx-auto w-full">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-secondary/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary font-semibold">
              Executive Agency Intelligence
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
              Founder &amp; CFO Dashboard
            </span>
          </div>
          <h1 className="font-headline-lg text-3xl text-primary font-serif tracking-tight mt-1">
            Reports &amp; Financial Analytics
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant max-w-2xl mt-0.5">
            Consolidated portfolio metrics, escrow collections, vendor liability ledgers, and operational margins.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting Consolidated PDF Financial Statement...')}
          className="px-4 py-2 bg-primary text-surface rounded text-xs font-label-caps uppercase hover:bg-secondary-dark transition-colors flex items-center gap-1.5 shadow-sm font-semibold"
        >
          <span className="material-symbols-outlined text-[16px]">print</span>
          <span>Print Executive Summary</span>
        </button>
      </div>

      {/* 2. Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-3 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm space-y-0.5">
          <span className="text-[10px] uppercase font-label-caps text-on-surface-variant font-semibold block">Weddings</span>
          <div className="text-xl font-bold font-serif text-primary font-tabular-nums">{totalWeddings}</div>
          <span className="text-[10px] text-on-surface-variant">Active accounts</span>
        </div>

        <div className="p-3 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm space-y-0.5">
          <span className="text-[10px] uppercase font-label-caps text-on-surface-variant font-semibold block">Total Revenue</span>
          <div className="text-xl font-bold font-serif text-primary font-tabular-nums">
            ₹{(totalContractRevenue / 10000000).toFixed(2)} Cr
          </div>
          <span className="text-[10px] text-on-surface-variant">Signed contracts</span>
        </div>

        <div className="p-3 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm space-y-0.5">
          <span className="text-[10px] uppercase font-label-caps text-on-surface-variant font-semibold block">Inbound Settled</span>
          <div className="text-xl font-bold font-serif text-secondary font-tabular-nums">
            ₹{(totalClientReceived / 100000).toFixed(1)} L
          </div>
          <span className="text-[10px] text-secondary">In bank escrow</span>
        </div>

        <div className="p-3 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm space-y-0.5">
          <span className="text-[10px] uppercase font-label-caps text-on-surface-variant font-semibold block">Client Due</span>
          <div className="text-xl font-bold font-serif text-primary font-tabular-nums">
            ₹{(totalClientOutstanding / 100000).toFixed(1)} L
          </div>
          <span className="text-[10px] text-on-surface-variant">Upcoming milestones</span>
        </div>

        <div className="p-3 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm space-y-0.5">
          <span className="text-[10px] uppercase font-label-caps text-on-surface-variant font-semibold block">Total Expenses</span>
          <div className="text-xl font-bold font-serif text-primary font-tabular-nums">
            ₹{(totalExpenses / 100000).toFixed(1)} L
          </div>
          <span className="text-[10px] text-on-surface-variant">Vendor &amp; extras</span>
        </div>

        <div className="p-3 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm space-y-0.5">
          <span className="text-[10px] uppercase font-label-caps text-on-surface-variant font-semibold block">Vendor Due</span>
          <div className="text-xl font-bold font-serif text-error font-tabular-nums">
            ₹{(totalVendorBalancesDue / 100000).toFixed(1)} L
          </div>
          <span className="text-[10px] text-error">Contract balances</span>
        </div>

        <div className="p-3 bg-secondary-container/20 rounded-lg border border-secondary shadow-sm space-y-0.5">
          <span className="text-[10px] uppercase font-label-caps text-secondary font-bold block">Estimated Profit</span>
          <div className="text-xl font-bold font-serif text-primary font-tabular-nums">
            ₹{(totalEstimatedProfit / 100000).toFixed(1)} L
          </div>
          <span className="text-[10px] text-secondary font-bold">~38.5% Margin</span>
        </div>
      </div>

      {/* 3. Simple Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Revenue vs Expenses by Wedding (8 cols) */}
        <div className="lg:col-span-8 p-6 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-secondary/15 pb-3">
            <div>
              <h3 className="font-headline-sm text-lg text-primary font-serif">Revenue vs. Operational Outlay (in Lakhs)</h3>
              <p className="text-xs text-on-surface-variant">Comparison across ongoing wedding accounts</p>
            </div>
            <span className="text-xs text-secondary font-semibold font-tabular-nums">INR Values</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueExpensesData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3ede5" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#4c4549' }} />
                <YAxis tick={{ fontSize: 11, fill: '#4c4549' }} />
                <Tooltip
                  formatter={(val) => `₹${val} Lakhs`}
                  contentStyle={{ backgroundColor: '#fff8f0', borderColor: '#B99A72', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Revenue" fill="#241820" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Expenses" fill="#B99A72" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Profit" fill="#A77D83" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Wedding Count by Package (4 cols) */}
        <div className="lg:col-span-4 p-6 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="border-b border-secondary/15 pb-3">
            <h3 className="font-headline-sm text-lg text-primary font-serif">Package Mix Breakdown</h3>
            <p className="text-xs text-on-surface-variant">Portfolio allocation across service tiers</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={packagePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {packagePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff8f0', borderColor: '#B99A72', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-secondary/15 text-xs">
            {packagePieData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-on-surface">{item.name}</span>
                </div>
                <span className="font-semibold text-primary font-tabular-nums">{item.value} Accounts</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Guild Vendor Performance Matrix */}
      <div className="p-6 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-secondary/15 pb-3">
          <div>
            <h3 className="font-headline-sm text-lg text-primary font-serif">Artisan &amp; Vendor Performance Matrix</h3>
            <p className="text-xs text-on-surface-variant">Quality ratings, assignments, and on-time reliability</p>
          </div>
          <span className="text-xs text-secondary font-medium">Audited Post-Run</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant h-9 border-b border-secondary/15">
                <th className="px-4 py-2 font-label-sm uppercase font-semibold">Vendor Partner</th>
                <th className="px-4 py-2 font-label-sm uppercase font-semibold">Guild Category</th>
                <th className="px-4 py-2 font-label-sm uppercase font-semibold">Client Satisfaction Rating</th>
                <th className="px-4 py-2 font-label-sm uppercase font-semibold">Active Assignments</th>
                <th className="px-4 py-2 font-label-sm uppercase font-semibold">On-Time Reliability</th>
                <th className="px-4 py-2 font-label-sm uppercase font-semibold">Discretion Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10">
              {vendors.map((v) => (
                <tr key={v.id} className="hover:bg-surface-container-low/50">
                  <td className="px-4 py-3 font-semibold text-primary">{v.name}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{v.category}</td>
                  <td className="px-4 py-3 font-tabular-nums font-bold text-secondary">★ {v.rating} / 5.0</td>
                  <td className="px-4 py-3 text-on-surface">
                    {v.confirmed_assignments?.length > 0 ? (
                      <span className="font-medium text-primary">{v.confirmed_assignments[0]}</span>
                    ) : (
                      <span className="text-on-surface-variant italic">Open for Tender</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-tabular-nums text-on-surface">99.4% On-Schedule</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-secondary-container/40 text-on-secondary-container font-semibold">
                      Full NDA Signed
                    </span>
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
