import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

export default function VendorsQuotations() {
  const {
    weddings,
    selectedWeddingId,
    setSelectedWeddingId,
    selectedWedding,
    vendors,
    quotationRequests,
    quotations,
    createQuotationRequest,
    shareQuotationWithClient,
    confirmVendorQuotation
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState('quotations'); // 'quotations' | 'directory'
  const [showRfpModal, setShowRfpModal] = useState(false);
  const [newRfp, setNewRfp] = useState({
    title: '',
    category: 'Catering & Banqueting',
    description: ''
  });

  const weddingQuotations = quotations.filter(q => q.wedding_id === selectedWeddingId);
  const weddingRfps = quotationRequests.filter(r => r.wedding_id === selectedWeddingId);

  const handleCreateRfp = (e) => {
    e.preventDefault();
    createQuotationRequest({
      ...newRfp,
      wedding_id: selectedWeddingId
    });
    setNewRfp({ title: '', category: 'Catering & Banqueting', description: '' });
    setShowRfpModal(false);
  };

  return (
    <div className="p-8 space-y-8 max-w-[1720px] mx-auto w-full">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-secondary/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary font-semibold">
              Procurement &amp; Commercial Negotiations
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
              Guild Matrix
            </span>
          </div>
          <h1 className="font-headline-lg text-3xl text-primary font-serif tracking-tight mt-1">
            Vendors &amp; Commercial Quotations
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant max-w-2xl mt-0.5">
            Issue RFPs, receive competitive bids, share curated proposals with the couple, and lock confirmed artisan contracts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface-container-low p-1 rounded border border-secondary/20 text-xs">
            <button
              onClick={() => setActiveSubTab('quotations')}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'quotations' ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
              <span>Bids &amp; RFPs</span>
            </button>
            <button
              onClick={() => setActiveSubTab('directory')}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'directory' ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">storefront</span>
              <span>Artisan Directory</span>
            </button>
          </div>

          <button
            onClick={() => setShowRfpModal(true)}
            className="px-4 py-2 bg-primary-container text-on-primary font-title-md text-xs rounded shadow-sm hover:bg-secondary-dark transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">add_task</span>
            <span>Issue RFP</span>
          </button>
        </div>
      </div>

      {/* 2. Wedding Focus Selector */}
      <div className="p-3 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Active Wedding Context:</span>
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
        <span className="text-on-surface-variant font-tabular-nums">
          Budget: ₹{(selectedWedding.contract_amount / 10000000).toFixed(2)} Cr
        </span>
      </div>

      {/* 3. SUBTAB 1: QUOTATIONS & COMPARATIVE MATRIX */}
      {activeSubTab === 'quotations' && (
        <div className="space-y-6">
          {/* Active RFP Banner */}
          <div className="p-6 rounded-lg bg-surface-container-lowest border border-secondary/20 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-secondary/15 pb-4">
              <div>
                <span className="font-label-caps text-[10px] uppercase text-secondary font-semibold tracking-wider">
                  Active Tender RFP #001 · Catering &amp; Banqueting
                </span>
                <h3 className="font-headline-sm text-xl text-primary font-serif mt-0.5">
                  Multi-Day Royal Banquet &amp; Sangeet Gala (400 Guests)
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Full service 3-day royal dining including Welcome Mehendi tea garden, Royal Sangeet gourmet feast, Ceremony high-tea, and Durbar Hall 7-course plated banquet.
                </p>
              </div>
              <span className="px-3 py-1 rounded bg-secondary-container text-on-secondary-container text-xs font-semibold uppercase tracking-wider self-start font-tabular-nums">
                3 Competitive Bids Received
              </span>
            </div>

            {/* 3 Side-by-Side Quotation Cards (Royal Feast vs Maharaja vs Grand Platter) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {weddingQuotations.map((quote) => {
                const isConfirmed = quote.status === 'Confirmed';
                const isClientApproved = quote.status === 'Client Approved';
                const isShared = quote.shared_with_client;

                return (
                  <div
                    key={quote.id}
                    className={`rounded-lg border p-6 flex flex-col justify-between space-y-4 transition-all relative ${
                      isConfirmed
                        ? 'bg-surface-container-low border-secondary ring-2 ring-secondary shadow-md'
                        : isClientApproved
                        ? 'bg-secondary-container/20 border-secondary shadow-md'
                        : 'bg-surface-container-lowest border-secondary/20 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {/* Top Status & Badge */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-label-caps uppercase text-secondary font-semibold block">
                          Tender Bid #{quote.id}
                        </span>
                        <h4 className="font-headline-sm text-lg text-primary font-serif font-semibold mt-0.5">
                          {quote.vendor_name}
                        </h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        isConfirmed
                          ? 'bg-secondary text-primary font-bold'
                          : isClientApproved
                          ? 'bg-secondary-container text-on-secondary-container'
                          : isShared
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                          : 'bg-surface-container-high text-on-surface'
                      }`}>
                        {quote.status}
                      </span>
                    </div>

                    {/* Price Figures */}
                    <div className="p-3 bg-surface-container-low rounded border border-secondary/15 space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-label-caps uppercase text-on-surface-variant">Total Quoted</span>
                        <span className="font-display-md text-xl font-bold font-serif text-primary font-tabular-nums">
                          ₹{quote.total_quoted_amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-on-surface-variant font-tabular-nums">
                        <span>Rate Per Cover:</span>
                        <span>₹{quote.price_per_plate_or_service} / guest</span>
                      </div>
                      {quote.additional_charges > 0 && (
                        <div className="flex justify-between text-[11px] text-on-surface-variant font-tabular-nums">
                          <span>Heritage Setup:</span>
                          <span>+₹{quote.additional_charges.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>

                    {/* Inclusions & Scope */}
                    <div className="space-y-2 text-xs">
                      <span className="font-label-caps uppercase text-[10px] text-secondary font-semibold block">
                        Service Inclusions
                      </span>
                      <p className="text-on-surface-variant text-[11px] leading-relaxed">
                        {quote.service_inclusions}
                      </p>

                      <div className="pt-2 border-t border-secondary/15">
                        <span className="text-[10px] text-secondary font-semibold block">Planner Internal Notes:</span>
                        <p className="text-[11px] text-on-surface italic mt-0.5">{quote.notes}</p>
                      </div>

                      {quote.client_feedback && (
                        <div className="p-2 bg-secondary-container/30 border border-secondary/30 rounded text-[11px]">
                          <span className="font-semibold text-primary block">Couple Feedback:</span>
                          <span className="text-on-surface-variant">{quote.client_feedback}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions Cluster */}
                    <div className="pt-3 border-t border-secondary/20 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[10px] text-secondary flex items-center gap-1 font-medium">
                          {isShared ? '✓ Visible to Couple' : '🔒 Private Agency Record'}
                        </span>
                        <a
                          href={quote.proposal_pdf_url}
                          onClick={(e) => { e.preventDefault(); alert(`Previewing PDF Proposal: ${quote.vendor_name}`); }}
                          className="text-primary hover:underline font-semibold text-[11px]"
                        >
                          Proposal PDF ↗
                        </a>
                      </div>

                      {/* Workflow Step: Share or Confirm */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {!isShared ? (
                          <button
                            onClick={() => shareQuotationWithClient(quote.id)}
                            className="w-full py-2 bg-surface-container-high hover:bg-surface-container-highest text-primary rounded font-label-caps uppercase text-[10px] font-semibold transition-colors col-span-2"
                          >
                            Share with Couple
                          </button>
                        ) : !isConfirmed ? (
                          <>
                            <button
                              disabled
                              className="w-full py-2 bg-surface-container text-on-surface-variant rounded font-label-caps uppercase text-[10px] font-semibold"
                            >
                              Shared
                            </button>
                            <button
                              onClick={() => confirmVendorQuotation(quote.id)}
                              className="w-full py-2 bg-primary text-surface hover:bg-secondary-dark rounded font-label-caps uppercase text-[10px] font-semibold transition-colors shadow-sm"
                            >
                              Confirm Vendor ✓
                            </button>
                          </>
                        ) : (
                          <div className="w-full py-2 bg-secondary/20 text-secondary border border-secondary text-center rounded font-label-caps uppercase text-[10px] font-bold col-span-2">
                            ✓ Confirmed &amp; Disbursed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. SUBTAB 2: ARTISAN VENDOR DIRECTORY */}
      {activeSubTab === 'directory' && (
        <div className="bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-secondary/15 pb-3">
            <div>
              <h3 className="font-headline-sm text-xl text-primary font-serif">Master Artisan &amp; Vendor Directory</h3>
              <p className="text-xs text-on-surface-variant">Vetted guild partners across India, Italy, and Europe</p>
            </div>
            <span className="text-xs text-on-surface-variant font-tabular-nums">{vendors.length} Verified Partners</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant h-9 border-b border-secondary/15">
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Vendor Name</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Category</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Contact Person</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Phone &amp; Email</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Services</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Base Location</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Rating</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {vendors.map((ven) => (
                  <tr key={ven.id} className="hover:bg-surface-container-low/50">
                    <td className="px-4 py-3 font-semibold text-primary">{ven.name}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{ven.category}</td>
                    <td className="px-4 py-3 text-on-surface">{ven.contact_person}</td>
                    <td className="px-4 py-3 font-tabular-nums">
                      <span className="block text-primary">{ven.phone}</span>
                      <span className="text-[10px] text-on-surface-variant">{ven.email}</span>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant max-w-xs truncate">{ven.services}</td>
                    <td className="px-4 py-3 text-on-surface">{ven.location}</td>
                    <td className="px-4 py-3 font-tabular-nums font-semibold text-secondary">★ {ven.rating}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-secondary-container/40 text-on-secondary-container font-semibold">
                        {ven.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE RFP MODAL */}
      {showRfpModal && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg p-6 shadow-2xl border border-secondary/30 space-y-4">
            <div className="flex items-center justify-between border-b border-secondary/20 pb-3">
              <h3 className="font-headline-sm text-lg text-primary font-serif">Issue New Tender RFP</h3>
              <button onClick={() => setShowRfpModal(false)} className="text-on-surface-variant hover:text-primary text-xl">✕</button>
            </div>

            <form onSubmit={handleCreateRfp} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-label-caps uppercase text-secondary font-semibold">Tender Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Sangeet Concert Sound & Lighting Trussing"
                  value={newRfp.title}
                  onChange={(e) => setNewRfp({ ...newRfp, title: e.target.value })}
                  className="w-full p-2.5 bg-surface-container-low border border-secondary/20 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-label-caps uppercase text-secondary font-semibold">Category Specification</label>
                <select
                  value={newRfp.category}
                  onChange={(e) => setNewRfp({ ...newRfp, category: e.target.value })}
                  className="w-full p-2 bg-surface-container-low border border-secondary/20 text-xs"
                >
                  <option value="Catering & Banqueting">Catering &amp; Banqueting</option>
                  <option value="Decoration & Floral">Decoration &amp; Floral</option>
                  <option value="Photography & Cinema">Photography &amp; Cinema</option>
                  <option value="Sound & Light Production">Sound &amp; Light Production</option>
                  <option value="Artist & Entertainment">Artist &amp; Entertainment</option>
                  <option value="Chauffeur & Fleet Logistics">Chauffeur &amp; Fleet Logistics</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-label-caps uppercase text-secondary font-semibold">Scope of Work &amp; Deliverables</label>
                <textarea
                  rows={3}
                  value={newRfp.description}
                  onChange={(e) => setNewRfp({ ...newRfp, description: e.target.value })}
                  placeholder="Explain requirements, expected guest volume, dates, setup windows..."
                  className="w-full p-2 bg-surface-container-low border border-secondary/20 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-secondary/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRfpModal(false)}
                  className="px-4 py-2 bg-surface-container text-on-surface-variant font-label-caps uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-surface font-label-caps uppercase text-xs hover:bg-secondary-dark shadow-sm"
                >
                  Issue RFP to Guild
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
