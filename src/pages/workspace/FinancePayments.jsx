import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

export default function FinancePayments() {
  const {
    weddings,
    selectedWeddingId,
    setSelectedWeddingId,
    selectedWedding,
    clientPayments,
    vendorPayments,
    expenses,
    recordClientPayment,
    recordVendorPayment,
    addExpense,
    financials
  } = useData();

  const [activeFinanceTab, setActiveFinanceTab] = useState('client'); // 'client' | 'vendor' | 'expenses'
  const [showClientModal, setShowClientModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [clientForm, setClientForm] = useState({
    milestone_name: 'Third Production Milestone',
    amount: 3000000,
    due_date: new Date().toISOString().split('T')[0],
    payment_method: 'RTGS Wire Transfer',
    reference_no: `HDFC-RTGS-${Date.now().toString().slice(-6)}`,
    notes: 'Advance for catering and floral imports.'
  });

  const [vendorForm, setVendorForm] = useState({
    vendor_payment_id: '',
    amount: 500000,
    payment_method: 'RTGS Bank Transfer',
    reference_no: `VENDOR-DISB-${Date.now().toString().slice(-6)}`
  });

  const [expenseForm, setExpenseForm] = useState({
    category: 'Additional Catering Covers',
    description: 'Extra covers for Sangeet dinner gala',
    amount: 150000
  });

  const weddingClientPayments = clientPayments.filter(p => p.wedding_id === selectedWeddingId);
  const weddingVendorPayments = vendorPayments.filter(p => p.wedding_id === selectedWeddingId);
  const weddingExpenses = expenses.filter(e => e.wedding_id === selectedWeddingId);

  const handleRecordClientPayment = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      await recordClientPayment({
        ...clientForm,
        wedding_id: selectedWeddingId
      });
      setShowClientModal(false);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleRecordVendorPayment = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      await recordVendorPayment({
        vendor_payment_id: vendorForm.vendor_payment_id || weddingVendorPayments[0]?.id,
        amount: vendorForm.amount
      });
      setShowVendorModal(false);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      await addExpense({
        ...expenseForm,
        wedding_id: selectedWeddingId
      });
      setShowExpenseModal(false);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1720px] mx-auto w-full">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-secondary/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary font-semibold">
              Payments &amp; Balance Reconciliation
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
              Multi-Account Ledger
            </span>
          </div>
          <h1 className="font-headline-lg text-3xl text-primary font-serif tracking-tight mt-1">
            Finance &amp; Client Payments
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant max-w-2xl mt-0.5">
            Real-time tracking of client installment milestones, vendor contract advances, operating expenses, and live net profitability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setClientForm({
                milestone_name: 'Stage Production Milestone',
                amount: 2500000,
                due_date: new Date().toISOString().split('T')[0],
                payment_method: 'RTGS Wire Transfer',
                reference_no: `HDFC-RTGS-${Date.now().toString().slice(-6)}`,
                notes: 'Settled by family office.'
              });
              setShowClientModal(true);
            }}
            className="px-4 py-2 bg-primary-container text-on-primary font-title-md text-xs rounded shadow-sm hover:bg-secondary-dark transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">receipt</span>
            <span>Record Client Inbound</span>
          </button>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="px-4 py-2 bg-surface-container text-primary font-title-md text-xs rounded border border-secondary/30 hover:bg-surface-container-high transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>Add Operational Expense</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-error-container/40 border border-error text-error text-xs rounded flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 2. Wedding Focus Context */}
      <div className="p-3 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Wedding Account:</span>
          <select
            value={selectedWeddingId}
            onChange={(e) => setSelectedWeddingId(e.target.value)}
            className="p-1.5 bg-surface-container-low border border-secondary/20 rounded font-medium text-xs text-primary"
          >
            {weddings.map((w) => (
              <option key={w.id} value={w.id}>{w.couple_names} — {w.destination}</option>
            ))}
          </select>
        </div>
        <span className="text-secondary font-semibold font-tabular-nums">
          Contract: ₹{(((selectedWedding?.contract_amount || 0) / 10000000)).toFixed(2)} Crore
        </span>
      </div>

      {!selectedWedding ? (
        <div className="p-12 text-center bg-surface-container-lowest border border-secondary/20 rounded-xl space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-surface-container flex items-center justify-center border border-secondary/30 text-secondary">
            <span className="material-symbols-outlined text-3xl">payments</span>
          </div>
          <h2 className="text-xl font-serif text-primary">No Wedding Project Selected for Finance</h2>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
            {weddings.length === 0
              ? 'No wedding project financial ledgers were found. In demo mode, initial records will be hydrated automatically.'
              : 'Please select a wedding account from the selector above to reconcile client payments, vendor advances, and operational expenses.'}
          </p>
        </div>
      ) : (
        <>
      {/* 3. Payment Summary Cards (5 Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Contract Revenue */}
        <div className="p-4 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-label-caps text-on-surface-variant block font-semibold">
            Contract Total
          </span>
          <div className="text-xl font-bold font-serif text-primary font-tabular-nums">
            ₹{(financials.totalRevenue / 10000000).toFixed(2)} Cr
          </div>
          <span className="text-[10px] text-on-surface-variant">Approved agreement</span>
        </div>

        {/* Client Payments Received */}
        <div className="p-4 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-label-caps text-on-surface-variant block font-semibold">
            Client Inbound Settled
          </span>
          <div className="text-xl font-bold font-serif text-secondary font-tabular-nums">
            ₹{(financials.totalClientReceived / 100000).toFixed(1)} L
          </div>
          <span className="text-[10px] text-secondary font-tabular-nums">
            Pending: ₹{(financials.totalClientPending / 100000).toFixed(1)} L
          </span>
        </div>

        {/* Vendor Disbursements Paid */}
        <div className="p-4 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-label-caps text-on-surface-variant block font-semibold">
            Vendor Outbound Paid
          </span>
          <div className="text-xl font-bold font-serif text-primary font-tabular-nums">
            ₹{(financials.totalVendorPaid / 100000).toFixed(1)} L
          </div>
          <span className="text-[10px] text-error font-tabular-nums">
            Balance Due: ₹{(financials.totalVendorBalanceDue / 100000).toFixed(1)} L
          </span>
        </div>

        {/* Operational Additional Expenses */}
        <div className="p-4 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-label-caps text-on-surface-variant block font-semibold">
            Operating Extras
          </span>
          <div className="text-xl font-bold font-serif text-primary font-tabular-nums">
            ₹{(financials.totalAdditionalExpenses / 100000).toFixed(2)} L
          </div>
          <span className="text-[10px] text-on-surface-variant">{weddingExpenses.length} Logged entries</span>
        </div>

        {/* Calculated Net Profit & Margin */}
        <div className="p-4 bg-secondary-container/20 rounded-lg border border-secondary shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-label-caps text-secondary font-semibold block">
            Net Estimated Profit
          </span>
          <div className="text-xl font-bold font-serif text-primary font-tabular-nums">
            ₹{(financials.estimatedProfit / 100000).toFixed(1)} Lakhs
          </div>
          <span className="text-[10px] text-secondary font-bold font-tabular-nums">
            {financials.profitMargin}% Operating Margin
          </span>
        </div>
      </div>

      {/* 4. Sub-Tab Switcher (Client Milestones / Vendor Disbursements / Operational Expenses) */}
      <div className="border-b border-secondary/20 flex gap-2 text-xs">
        <button
          onClick={() => setActiveFinanceTab('client')}
          className={`px-4 py-2 font-title-md uppercase tracking-wider text-xs border-b-2 transition-all ${
            activeFinanceTab === 'client'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          Client Payment Milestones ({weddingClientPayments.length})
        </button>
        <button
          onClick={() => setActiveFinanceTab('vendor')}
          className={`px-4 py-2 font-title-md uppercase tracking-wider text-xs border-b-2 transition-all ${
            activeFinanceTab === 'vendor'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          Vendor Contracts &amp; Advances ({weddingVendorPayments.length})
        </button>
        <button
          onClick={() => setActiveFinanceTab('expenses')}
          className={`px-4 py-2 font-title-md uppercase tracking-wider text-xs border-b-2 transition-all ${
            activeFinanceTab === 'expenses'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          Additional Operational Outlay ({weddingExpenses.length})
        </button>
      </div>

      {/* 5. TAB 1: CLIENT PAYMENTS */}
      {activeFinanceTab === 'client' && (
        <div className="bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-secondary/15 pb-3">
            <div>
              <h3 className="font-headline-sm text-lg text-primary font-serif">Client Inbound Milestones</h3>
              <p className="text-xs text-on-surface-variant">Scheduled installments as per master service agreement</p>
            </div>
            <span className="text-xs font-tabular-nums text-on-surface-variant">
              Settled: ₹{(financials.totalClientReceived / 100000).toFixed(1)} L / ₹{(financials.totalRevenue / 100000).toFixed(1)} L
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant h-9 border-b border-secondary/15">
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Milestone Phase</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Scheduled Amount</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Due Date</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Settled Date</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Status</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Method &amp; Bank Ref</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {weddingClientPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-container-low/50">
                    <td className="px-4 py-3 font-semibold text-primary">{p.milestone_name}</td>
                    <td className="px-4 py-3 font-tabular-nums font-bold text-primary">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 font-tabular-nums text-on-surface">{p.due_date}</td>
                    <td className="px-4 py-3 font-tabular-nums text-on-surface-variant">
                      {p.paid_date || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        p.status === 'Received'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-surface-container-high text-on-surface'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-on-surface">
                      <span className="block font-medium">{p.payment_method}</span>
                      <span className="text-[10px] text-on-surface-variant">{p.reference_no}</span>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant text-[11px] max-w-xs truncate">{p.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. TAB 2: VENDOR PAYMENTS */}
      {activeFinanceTab === 'vendor' && (
        <div className="bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-secondary/15 pb-3">
            <div>
              <h3 className="font-headline-sm text-lg text-primary font-serif">Confirmed Vendor Disbursements</h3>
              <p className="text-xs text-on-surface-variant">Contract allocations, advances paid, and balances due</p>
            </div>
            <button
              onClick={() => setShowVendorModal(true)}
              className="px-3 py-1.5 bg-primary text-surface rounded text-xs font-label-caps uppercase hover:bg-secondary-dark font-semibold"
            >
              Disburse Payment
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant h-9 border-b border-secondary/15">
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Vendor &amp; Scope</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Contract Agreed</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Advances Paid</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Additional Charges</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Balance Due</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Status</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {weddingVendorPayments.map((v) => (
                  <tr key={v.id} className="hover:bg-surface-container-low/50">
                    <td className="px-4 py-3">
                      <span className="font-semibold text-primary block">{v.vendor_name}</span>
                      <span className="text-[10px] text-on-surface-variant">{v.milestone_name}</span>
                    </td>
                    <td className="px-4 py-3 font-tabular-nums font-semibold text-primary">
                      ₹{v.agreed_amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 font-tabular-nums font-semibold text-secondary">
                      ₹{v.amount_paid.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 font-tabular-nums text-on-surface-variant">
                      ₹{v.additional_charges.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 font-tabular-nums font-bold text-error">
                      ₹{v.balance_due.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        v.status === 'Paid in Full' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-tabular-nums text-on-surface">{v.due_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. TAB 3: OPERATIONAL EXPENSES */}
      {activeFinanceTab === 'expenses' && (
        <div className="bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-secondary/15 pb-3">
            <div>
              <h3 className="font-headline-sm text-lg text-primary font-serif">Additional Operational Expenses</h3>
              <p className="text-xs text-on-surface-variant">Overtime, extra covers, transport upgrades, and permits</p>
            </div>
            <button
              onClick={() => setShowExpenseModal(true)}
              className="px-3 py-1.5 bg-primary text-surface rounded text-xs font-label-caps uppercase hover:bg-secondary-dark font-semibold"
            >
              Add Expense Entry
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant h-9 border-b border-secondary/15">
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Expense Category</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Description</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Amount</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Recorded By</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Date Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {weddingExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-surface-container-low/50">
                    <td className="px-4 py-3 font-semibold text-primary">{exp.category}</td>
                    <td className="px-4 py-3 text-on-surface-variant max-w-md">{exp.description}</td>
                    <td className="px-4 py-3 font-tabular-nums font-bold text-primary">
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-on-surface">{exp.recorded_by}</td>
                    <td className="px-4 py-3 font-tabular-nums text-on-surface-variant">
                      {new Date(exp.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </>
      )}

      {/* RECORD CLIENT PAYMENT MODAL */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-md w-full p-6 rounded-lg border border-secondary/30 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-secondary/20 pb-2">
              <h3 className="font-headline-sm text-lg text-primary font-serif">Record Client Inbound Milestone</h3>
              <button onClick={() => setShowClientModal(false)} className="text-lg">✕</button>
            </div>

            <form onSubmit={handleRecordClientPayment} className="space-y-3">
              <div>
                <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Milestone Name *</label>
                <input
                  required
                  type="text"
                  value={clientForm.milestone_name}
                  onChange={(e) => setClientForm({ ...clientForm, milestone_name: e.target.value })}
                  className="w-full p-2 bg-surface-container-low border border-secondary/20 rounded text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Amount (INR) *</label>
                  <input
                    required
                    type="number"
                    value={clientForm.amount}
                    onChange={(e) => setClientForm({ ...clientForm, amount: e.target.value })}
                    className="w-full p-2 bg-surface-container-low border border-secondary/20 rounded text-xs mt-1 font-tabular-nums"
                  />
                </div>
                <div>
                  <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Settled Date</label>
                  <input
                    type="date"
                    value={clientForm.due_date}
                    onChange={(e) => setClientForm({ ...clientForm, due_date: e.target.value })}
                    className="w-full p-2 bg-surface-container-low border border-secondary/20 rounded text-xs mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Method</label>
                  <select
                    value={clientForm.payment_method}
                    onChange={(e) => setClientForm({ ...clientForm, payment_method: e.target.value })}
                    className="w-full p-2 bg-surface-container-low border border-secondary/20 rounded text-xs mt-1"
                  >
                    <option value="RTGS Wire Transfer">RTGS Wire</option>
                    <option value="Direct Wire Transfer">Wire Transfer</option>
                    <option value="Bank Draft">Bank Draft</option>
                  </select>
                </div>
                <div>
                  <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Unique Reference No *</label>
                  <input
                    required
                    type="text"
                    placeholder="TXN ID (Prevent Duplicate)"
                    value={clientForm.reference_no}
                    onChange={(e) => setClientForm({ ...clientForm, reference_no: e.target.value })}
                    className="w-full p-2 bg-surface-container-low border border-secondary/20 rounded text-xs mt-1 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Ledger Notes</label>
                <textarea
                  rows={2}
                  value={clientForm.notes}
                  onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                  className="w-full p-2 bg-surface-container-low border border-secondary/20 rounded text-xs mt-1"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-secondary/20">
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="px-3 py-1.5 bg-surface-container text-on-surface-variant font-label-caps uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary text-surface rounded font-label-caps uppercase text-xs font-semibold hover:bg-secondary-dark"
                >
                  Save Payment Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISBURSE VENDOR ADVANCE MODAL */}
      {showVendorModal && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-md w-full p-6 rounded-lg border border-secondary/30 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-secondary/20 pb-2">
              <h3 className="font-headline-sm text-lg text-primary font-serif">Disburse Vendor Payment</h3>
              <button onClick={() => setShowVendorModal(false)} className="text-lg">✕</button>
            </div>

            <form onSubmit={handleRecordVendorPayment} className="space-y-3">
              <div>
                <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Select Vendor Account *</label>
                <select
                  value={vendorForm.vendor_payment_id || weddingVendorPayments[0]?.id}
                  onChange={(e) => setVendorForm({ ...vendorForm, vendor_payment_id: e.target.value })}
                  className="w-full p-2 bg-surface-container-low border border-secondary/20 rounded text-xs mt-1"
                >
                  {weddingVendorPayments.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.vendor_name} (Balance: ₹{v.balance_due.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Disbursement Amount (INR) *</label>
                <input
                  required
                  type="number"
                  value={vendorForm.amount}
                  onChange={(e) => setVendorForm({ ...vendorForm, amount: e.target.value })}
                  className="w-full p-2 bg-surface-container-low border border-secondary/20 rounded text-xs mt-1 font-tabular-nums"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-secondary/20">
                <button
                  type="button"
                  onClick={() => setShowVendorModal(false)}
                  className="px-3 py-1.5 bg-surface-container text-on-surface-variant font-label-caps uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary text-surface rounded font-label-caps uppercase text-xs font-semibold hover:bg-secondary-dark"
                >
                  Confirm Disbursement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD EXPENSE MODAL */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-md w-full p-6 rounded-lg border border-secondary/30 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-secondary/20 pb-2">
              <h3 className="font-headline-sm text-lg text-primary font-serif">Add Operational Expense</h3>
              <button onClick={() => setShowExpenseModal(false)} className="text-lg">✕</button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="w-full p-2 bg-surface-container-low border border-secondary/20 rounded text-xs mt-1"
                >
                  <option value="Additional Catering Covers">Additional Catering Covers</option>
                  <option value="VIP Chauffeur Fleet Upgrade">VIP Chauffeur Fleet Upgrade</option>
                  <option value="Pyrotechnics & Security">Pyrotechnics &amp; Security</option>
                  <option value="Generator & Power Backups">Generator &amp; Power Backups</option>
                  <option value="Overtime Crew Logistics">Overtime Crew Logistics</option>
                </select>
              </div>

              <div>
                <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Description</label>
                <textarea
                  rows={2}
                  required
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  className="w-full p-2 bg-surface-container-low border border-secondary/20 rounded text-xs mt-1"
                />
              </div>

              <div>
                <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Amount (INR) *</label>
                <input
                  required
                  type="number"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  className="w-full p-2 bg-surface-container-low border border-secondary/20 rounded text-xs mt-1 font-tabular-nums"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-secondary/20">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-3 py-1.5 bg-surface-container text-on-surface-variant font-label-caps uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary text-surface rounded font-label-caps uppercase text-xs font-semibold hover:bg-secondary-dark"
                >
                  Log Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
