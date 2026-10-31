import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export default function VendorPortal() {
  const navigate = useNavigate();
  const {
    quotationRequests,
    quotations,
    submitQuotation,
    vendorPayments,
    events,
    selectedWedding
  } = useData();

  const { logout, currentUser } = useAuth();

  // Vendor context: Royal Feast Catering (ven-001)
  const myVendorId = 'ven-001';
  const myVendorName = 'Royal Feast Catering';

  const myQuotations = quotations.filter(q => q.vendor_id === myVendorId);
  const myPayments = vendorPayments.filter(v => v.vendor_id === myVendorId);
  const cateringEvents = events.filter(e => e.event_name.includes('Sangeet') || e.event_name.includes('Reception') || e.event_name.includes('Mehendi'));

  const [activeVendorTab, setActiveVendorTab] = useState('tenders'); // 'tenders' | 'schedule' | 'finances'
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedRfp, setSelectedRfp] = useState(null);
  const [bidSuccessMsg, setBidSuccessMsg] = useState(null);

  const [bidForm, setBidForm] = useState({
    price_per_plate_or_service: 4200,
    total_quoted_amount: 3360000,
    service_inclusions: '7-course Royal Silver Thali banquet, live truffle pasta station, imported French patisserie bar, 60 royal attired butler staff.',
    additional_charges: 150000,
    notes: 'Chef Ranveer will personally oversee banquet execution on Sangeet & Reception nights.'
  });

  const handleSubmitBid = (e) => {
    e.preventDefault();
    submitQuotation({
      ...bidForm,
      request_id: selectedRfp?.id || 'rfp-001',
      wedding_id: selectedRfp?.wedding_id || 'wed-001',
      vendor_id: myVendorId,
      vendor_name: myVendorName,
      proposal_pdf_url: '/docs/Royal_Feast_Catering_Bespoke_Proposal.pdf'
    });
    setShowBidModal(false);
    setBidSuccessMsg("Quotation submitted successfully to Vivaah Atelier directors!");
    setTimeout(() => setBidSuccessMsg(null), 3000);
  };

  return (
    <div className="w-full min-h-screen bg-surface text-on-surface">
      {/* 1. Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-md border-b border-secondary/20 h-20 flex items-center justify-between px-6 lg:px-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-container text-secondary flex items-center justify-center border border-secondary/30">
            <span className="material-symbols-outlined text-[18px]">restaurant</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-lg tracking-wider uppercase text-primary font-serif font-medium leading-none">
              VIVAAH
            </span>
            <span className="font-label-caps text-[9px] uppercase tracking-widest text-secondary mt-0.5">
              Vendor Partner Portal · {myVendorName}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded text-xs border border-secondary/20">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span className="font-medium text-primary">Chef Ranveer Brar (Executive Director)</span>
          </span>

          <button
            onClick={() => {
              logout();
              navigate('/vendor/login');
            }}
            className="px-3.5 py-1.5 bg-surface-container hover:bg-surface-container-high rounded text-xs text-primary font-semibold border border-secondary/20 flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* 2. Main Body */}
      <main className="pt-28 pb-16 px-6 lg:px-12 max-w-6xl mx-auto space-y-8">
        {/* Vendor Banner */}
        <div className="p-8 bg-surface-container-lowest rounded-xl border border-secondary/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="font-label-caps text-[10px] uppercase tracking-widest text-secondary font-semibold">
              Verified Atelier Guild Partner
            </span>
            <h1 className="font-headline-lg text-3xl text-primary font-serif">
              Royal Feast Catering
            </h1>
            <p className="text-xs text-on-surface-variant max-w-xl">
              Partner status: Sovereign Class · Rating: ★ 4.98 · Active Contract: Aarav &amp; Meera (Jaipur Royal Wedding)
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-tabular-nums">
            <div className="p-3 bg-surface-container-low rounded border border-secondary/15 text-center">
              <span className="text-[10px] uppercase text-on-surface-variant block">Confirmed Assignments</span>
              <span className="text-lg font-bold text-primary font-serif">1 Active</span>
            </div>
            <div className="p-3 bg-surface-container-low rounded border border-secondary/15 text-center">
              <span className="text-[10px] uppercase text-on-surface-variant block">Advances Settled</span>
              <span className="text-lg font-bold text-secondary font-serif">₹10.0 L</span>
            </div>
          </div>
        </div>

        {bidSuccessMsg && (
          <div className="p-4 bg-secondary-container/40 border border-secondary text-primary rounded-lg flex items-center gap-2 text-xs font-medium animate-bounce shadow-sm">
            <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
            <span>{bidSuccessMsg}</span>
          </div>
        )}

        {/* 3. Sub Tabs */}
        <div className="border-b border-secondary/20 flex gap-2 text-xs">
          <button
            onClick={() => setActiveVendorTab('tenders')}
            className={`px-5 py-2.5 font-title-md uppercase tracking-wider text-xs border-b-2 transition-all flex items-center gap-1.5 ${
              activeVendorTab === 'tenders'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">request_quote</span>
            <span>Tender Requests &amp; My Bids ({myQuotations.length})</span>
          </button>

          <button
            onClick={() => setActiveVendorTab('schedule')}
            className={`px-5 py-2.5 font-title-md uppercase tracking-wider text-xs border-b-2 transition-all flex items-center gap-1.5 ${
              activeVendorTab === 'schedule'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>Kitchen Setup &amp; Banquet Schedule</span>
          </button>

          <button
            onClick={() => setActiveVendorTab('finances')}
            className={`px-5 py-2.5 font-title-md uppercase tracking-wider text-xs border-b-2 transition-all flex items-center gap-1.5 ${
              activeVendorTab === 'finances'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">payments</span>
            <span>Disbursement Ledger &amp; Invoices</span>
          </button>
        </div>

        {/* 4. TAB 1: TENDERS & MY BIDS */}
        {activeVendorTab === 'tenders' && (
          <div className="space-y-6 text-xs">
            {/* Open RFP Invitation */}
            <div className="p-6 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-secondary/15 pb-3">
                <div>
                  <span className="text-[10px] font-label-caps uppercase text-secondary font-semibold">
                    Assigned Tender RFP #001
                  </span>
                  <h3 className="font-headline-sm text-xl text-primary font-serif font-semibold mt-0.5">
                    Multi-Day Royal Banquet &amp; Sangeet Gala (400 Guests)
                  </h3>
                  <p className="text-on-surface-variant text-[11px] mt-0.5">
                    Client: Aarav &amp; Meera · Destination: Jaipur City Palace &amp; Rambagh Palace
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedRfp(quotationRequests[0]);
                    setShowBidModal(true);
                  }}
                  className="px-4 py-2 bg-primary text-surface rounded font-label-caps uppercase text-xs font-semibold hover:bg-secondary-dark shadow-sm shrink-0"
                >
                  Submit Updated Quotation
                </button>
              </div>

              <div className="p-3 bg-surface-container-low rounded border border-secondary/15 text-[11px] text-on-surface-variant leading-relaxed">
                Scope: Full royal service covering 3 days: Welcome High-Tea, Sangeet gourmet multi-cuisine feast, Pheras refreshments, and Durbar Hall 7-course plated reception.
              </div>
            </div>

            {/* My Stored Submissions */}
            <div className="p-6 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm space-y-4">
              <h3 className="font-headline-sm text-lg text-primary font-serif">
                Your Submitted Quotations ({myQuotations.length})
              </h3>

              <div className="space-y-3">
                {myQuotations.map((q) => (
                  <div key={q.id} className="p-4 bg-surface-container-low rounded border border-secondary/15 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold text-primary text-sm">Bid #{q.id}</span>
                        <span className="text-[11px] text-on-surface-variant block font-tabular-nums">
                          ₹{q.price_per_plate_or_service} / plate · Total: ₹{q.total_quoted_amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-secondary-container text-on-secondary-container font-semibold uppercase">
                        {q.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-on-surface-variant">{q.service_inclusions}</p>

                    <div className="pt-2 border-t border-secondary/15 flex items-center justify-between text-[11px]">
                      <span className="text-secondary font-medium font-tabular-nums">
                        Additional Setup: ₹{q.additional_charges.toLocaleString('en-IN')}
                      </span>
                      <a
                        href={q.proposal_pdf_url}
                        onClick={(e) => { e.preventDefault(); alert("Viewing proposal PDF attachment."); }}
                        className="text-primary hover:underline font-semibold"
                      >
                        Attached Proposal PDF ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. TAB 2: SCHEDULE */}
        {activeVendorTab === 'schedule' && (
          <div className="p-6 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm space-y-4 text-xs">
            <h3 className="font-headline-sm text-xl text-primary font-serif">
              Catering Setup &amp; Service Call Sheets
            </h3>
            <div className="space-y-3">
              {cateringEvents.map((evt) => (
                <div key={evt.id} className="p-4 bg-surface-container-low rounded border border-secondary/15 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-primary text-sm">{evt.event_name}</h4>
                    <p className="text-[11px] text-on-surface-variant">{evt.location}</p>
                    <span className="text-[10px] text-secondary font-medium">Plating window: 1 hour prior to guest entry</span>
                  </div>
                  <div className="text-right font-tabular-nums">
                    <span className="font-bold text-primary block">{evt.date}</span>
                    <span className="text-[11px] text-on-surface-variant">{evt.start_time} - {evt.end_time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. TAB 3: FINANCES */}
        {activeVendorTab === 'finances' && (
          <div className="p-6 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm space-y-4 text-xs">
            <h3 className="font-headline-sm text-xl text-primary font-serif">
              Payment Disbursements &amp; Balance Due
            </h3>

            <div className="space-y-3">
              {myPayments.map((p) => (
                <div key={p.id} className="p-4 bg-surface-container-low rounded border border-secondary/15 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-primary text-sm">{p.milestone_name}</h4>
                      <span className="text-[10px] text-on-surface-variant">Due Date: {p.due_date}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-secondary-container text-on-secondary-container font-semibold uppercase">
                      {p.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-secondary/15 font-tabular-nums text-xs">
                    <div>
                      <span className="text-[10px] text-on-surface-variant block">Agreed Contract</span>
                      <span className="font-bold text-primary">₹{p.agreed_amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-variant block">Advance Received</span>
                      <span className="font-bold text-secondary">₹{p.amount_paid.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-variant block">Balance Payable</span>
                      <span className="font-bold text-error">₹{p.balance_due.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* SUBMIT BID MODAL */}
      {showBidModal && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full p-6 rounded-lg border border-secondary/30 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-secondary/20 pb-2">
              <h3 className="font-headline-sm text-lg text-primary font-serif">Submit Commercial Proposal</h3>
              <button onClick={() => setShowBidModal(false)} className="text-lg">✕</button>
            </div>

            <form onSubmit={handleSubmitBid} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Rate Per Plate / Cover (INR) *</label>
                  <input
                    required
                    type="number"
                    value={bidForm.price_per_plate_or_service}
                    onChange={(e) => {
                      const p = parseFloat(e.target.value) || 0;
                      setBidForm({
                        ...bidForm,
                        price_per_plate_or_service: p,
                        total_quoted_amount: p * 800 // 400 pax * 2 major banquets
                      });
                    }}
                    className="w-full p-2 bg-surface-container-low border border-secondary/20 rounded text-xs mt-1 font-tabular-nums"
                  />
                </div>
                <div>
                  <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Total Quoted (INR) *</label>
                  <input
                    required
                    type="number"
                    value={bidForm.total_quoted_amount}
                    onChange={(e) => setBidForm({ ...bidForm, total_quoted_amount: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 bg-surface-container-low border border-secondary/20 rounded text-xs mt-1 font-tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Service Inclusions &amp; Menu Breakdown *</label>
                <textarea
                  rows={3}
                  required
                  value={bidForm.service_inclusions}
                  onChange={(e) => setBidForm({ ...bidForm, service_inclusions: e.target.value })}
                  className="w-full p-2 bg-surface-container-low border border-secondary/20 rounded text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Special Site Setup Charges</label>
                  <input
                    type="number"
                    value={bidForm.additional_charges}
                    onChange={(e) => setBidForm({ ...bidForm, additional_charges: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 bg-surface-container-low border border-secondary/20 rounded text-xs mt-1 font-tabular-nums"
                  />
                </div>
                <div>
                  <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">PDF Proposal Attachment</label>
                  <div className="p-2 bg-surface-container border border-secondary/20 rounded text-[11px] text-primary truncate mt-1">
                    Royal_Feast_Proposal.pdf
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-secondary/20">
                <button
                  type="button"
                  onClick={() => setShowBidModal(false)}
                  className="px-3 py-1.5 bg-surface-container text-on-surface-variant font-label-caps uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary text-surface rounded font-label-caps uppercase text-xs font-semibold hover:bg-secondary-dark"
                >
                  Transmit Tender Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
