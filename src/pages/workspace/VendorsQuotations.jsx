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
    confirmVendorQuotation,
    addVendor,
    updateVendor,
    deleteVendor
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState('quotations'); // 'quotations' | 'directory'
  const [showRfpModal, setShowRfpModal] = useState(false);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  // Directory search & filter
  const [vendorSearch, setVendorSearch] = useState('');
  const [vendorCategoryFilter, setVendorCategoryFilter] = useState('All');

  const [newRfp, setNewRfp] = useState({
    title: '',
    category: 'Catering & Banqueting',
    description: ''
  });

  const [vendorForm, setVendorForm] = useState({
    name: '',
    category: 'Catering',
    contact_person: '',
    phone: '',
    email: '',
    services: '',
    location: '',
    status: 'Active',
    rating: '4.8'
  });

  const weddingQuotations = quotations.filter(q => q.wedding_id === selectedWeddingId);
  const weddingRfps = quotationRequests.filter(r => r.wedding_id === selectedWeddingId);

  const vendorCategories = [
    'All',
    'Catering',
    'Decoration & Scenography',
    'Photography & Cinema',
    'Artist & Entertainment',
    'Production & Lighting',
    'Transport & Logistics'
  ];

  const filteredVendors = vendors.filter(v => {
    const matchesCategory = vendorCategoryFilter === 'All' || v.category.toLowerCase().includes(vendorCategoryFilter.toLowerCase().split(' ')[0]);
    const matchesSearch =
      v.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.contact_person.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.location.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.category.toLowerCase().includes(vendorSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const [actionError, setActionError] = useState(null);

  const handleCreateRfp = async (e) => {
    e.preventDefault();
    setActionError(null);
    try {
      await createQuotationRequest({
        ...newRfp,
        wedding_id: selectedWeddingId
      });
      setNewRfp({ title: '', category: 'Catering & Banqueting', description: '' });
      setShowRfpModal(false);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleAddVendorSubmit = async (e) => {
    e.preventDefault();
    setActionError(null);
    try {
      await addVendor(vendorForm);
      setVendorForm({
        name: '',
        category: 'Catering',
        contact_person: '',
        phone: '',
        email: '',
        services: '',
        location: '',
        status: 'Active',
        rating: '4.8'
      });
      setShowAddVendorModal(false);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleEditVendorSubmit = async (e) => {
    e.preventDefault();
    if (!editingVendor) return;
    setActionError(null);
    try {
      await updateVendor(editingVendor.id, editingVendor);
      setEditingVendor(null);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleDeleteVendor = async (vendorId, vendorName) => {
    if (window.confirm(`Are you sure you want to remove ${vendorName} from verified vendors?`)) {
      setActionError(null);
      try {
        await deleteVendor(vendorId);
      } catch (err) {
        setActionError(err.message);
      }
    }
  };

  const handleShareQuote = async (quoteId) => {
    setActionError(null);
    try {
      await shareQuotationWithClient(quoteId);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleConfirmQuote = async (quoteId) => {
    setActionError(null);
    try {
      await confirmVendorQuotation(quoteId);
    } catch (err) {
      setActionError(err.message);
    }
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
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant font-tabular-nums">
              {vendors.length} Verified Partners
            </span>
          </div>
          <h1 className="font-headline-lg text-3xl text-primary font-serif tracking-tight mt-1">
            Vendors &amp; Commercial Quotations
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant max-w-2xl mt-0.5">
            Issue RFPs, receive competitive bids, share curated proposals with the couple, and manage verified artisan partners.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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

          {activeSubTab === 'quotations' ? (
            <button
              onClick={() => setShowRfpModal(true)}
              className="px-4 py-2 bg-primary text-surface font-title-md text-xs rounded shadow-sm hover:bg-secondary-dark transition-colors flex items-center gap-1.5 font-semibold"
            >
              <span className="material-symbols-outlined text-[16px]">add_task</span>
              <span>Issue RFP</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddVendorModal(true)}
              className="px-4 py-2 bg-primary text-surface font-title-md text-xs rounded shadow-sm hover:bg-secondary-dark transition-colors flex items-center gap-1.5 font-semibold"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>Add Vendor</span>
            </button>
          )}
        </div>
      </div>

      {actionError && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded text-xs flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="font-bold ml-2">✕</button>
        </div>
      )}

      {/* 2. Wedding Focus Selector */}
      <div className="p-3 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
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
          Budget: ₹{(selectedWedding?.contract_amount / 10000000).toFixed(2)} Cr
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

            {/* 3 Side-by-Side Quotation Cards */}
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
                          Quotation Request #{quote.id}
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
                          ? 'bg-secondary/20 text-secondary'
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
                        <button
                          onClick={() => alert(`Reviewing proposal for ${quote.vendor_name}`)}
                          className="text-primary hover:underline font-semibold text-[11px]"
                        >
                          Proposal Details ↗
                        </button>
                      </div>

                      {/* Workflow Step: Share or Confirm */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {!isShared ? (
                          <button
                            onClick={() => handleShareQuote(quote.id)}
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
                              onClick={() => handleConfirmQuote(quote.id)}
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
        <div className="space-y-4">
          {/* Search & Category Filter Bar */}
          <div className="p-4 rounded-lg bg-surface-container-lowest border border-secondary/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
            <div className="relative flex-1 max-w-sm">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-on-surface-variant text-[16px]">search</span>
              <input
                type="text"
                placeholder="Search by vendor, contact, or location..."
                value={vendorSearch}
                onChange={(e) => setVendorSearch(e.target.value)}
                className="w-full h-8 pl-8 pr-3 bg-surface-container-low border border-secondary/20 rounded text-xs text-primary focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {vendorCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setVendorCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                    vendorCategoryFilter === cat
                      ? 'bg-primary text-surface font-semibold shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Vendors Directory Table */}
          <div className="bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant h-10 border-b border-secondary/15 font-semibold uppercase text-[10.5px]">
                    <th className="px-4 py-2">Vendor Name</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Contact Person</th>
                    <th className="px-4 py-2">Phone &amp; Email</th>
                    <th className="px-4 py-2">Services / Inclusions</th>
                    <th className="px-4 py-2">Base Location</th>
                    <th className="px-4 py-2">Rating</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/10">
                  {filteredVendors.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-on-surface-variant">
                        No vendor partners match the current search or category filter.
                      </td>
                    </tr>
                  ) : (
                    filteredVendors.map((ven) => (
                      <tr key={ven.id} className="hover:bg-surface-container-low/40 transition-colors">
                        <td className="px-4 py-3 font-semibold text-primary">{ven.name}</td>
                        <td className="px-4 py-3 text-on-surface-variant">{ven.category}</td>
                        <td className="px-4 py-3 text-on-surface">{ven.contact_person}</td>
                        <td className="px-4 py-3 font-tabular-nums">
                          <span className="block text-primary font-medium">{ven.phone}</span>
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
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setEditingVendor(ven)}
                              className="px-2.5 py-1 bg-surface-container-low hover:bg-surface-container text-primary rounded text-[11px] font-medium transition-colors"
                              title="Edit Vendor"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteVendor(ven.id, ven.name)}
                              className="px-2.5 py-1 bg-error-container/30 hover:bg-error-container text-error rounded text-[11px] font-medium transition-colors"
                              title="Remove Vendor"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE RFP MODAL */}
      {showRfpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg p-6 rounded-xl shadow-2xl border border-secondary/30 space-y-4">
            <div className="flex items-center justify-between border-b border-secondary/20 pb-3">
              <h3 className="font-headline-sm text-lg text-primary font-serif">Issue New Tender RFP</h3>
              <button onClick={() => setShowRfpModal(false)} className="text-on-surface-variant hover:text-primary text-xl">✕</button>
            </div>

            <form onSubmit={handleCreateRfp} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-label-caps uppercase text-secondary font-semibold block">Tender Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Sangeet Concert Sound & Lighting Trussing"
                  value={newRfp.title}
                  onChange={(e) => setNewRfp({ ...newRfp, title: e.target.value })}
                  className="w-full p-2.5 bg-surface-container-low border border-secondary/20 rounded text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-label-caps uppercase text-secondary font-semibold block">Category Specification</label>
                <select
                  value={newRfp.category}
                  onChange={(e) => setNewRfp({ ...newRfp, category: e.target.value })}
                  className="w-full p-2.5 bg-surface-container-low border border-secondary/20 rounded text-xs"
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
                <label className="font-label-caps uppercase text-secondary font-semibold block">Scope of Work &amp; Deliverables</label>
                <textarea
                  rows={3}
                  value={newRfp.description}
                  onChange={(e) => setNewRfp({ ...newRfp, description: e.target.value })}
                  placeholder="Explain requirements, expected guest volume, dates, setup windows..."
                  className="w-full p-2.5 bg-surface-container-low border border-secondary/20 rounded text-xs"
                />
              </div>

              <div className="pt-3 border-t border-secondary/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRfpModal(false)}
                  className="px-4 py-2 bg-surface-container-low text-on-surface-variant rounded font-label-caps uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-surface rounded font-label-caps uppercase text-xs font-semibold hover:bg-secondary-dark shadow-sm"
                >
                  Issue RFP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD VENDOR MODAL */}
      {showAddVendorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg p-6 rounded-xl shadow-2xl border border-secondary/30 space-y-4">
            <div className="flex items-center justify-between border-b border-secondary/20 pb-3">
              <h3 className="font-headline-sm text-lg text-primary font-serif">Add New Verified Vendor Partner</h3>
              <button onClick={() => setShowAddVendorModal(false)} className="text-on-surface-variant hover:text-primary text-xl">✕</button>
            </div>

            <form onSubmit={handleAddVendorSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-label-caps uppercase text-secondary font-semibold block mb-1">Company / Brand Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Royal Rajputana Floral Masters"
                  value={vendorForm.name}
                  onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                  className="w-full p-2.5 bg-surface-container-low border border-secondary/20 rounded text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-label-caps uppercase text-secondary font-semibold block mb-1">Category</label>
                  <select
                    value={vendorForm.category}
                    onChange={(e) => setVendorForm({ ...vendorForm, category: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-secondary/20 rounded text-xs"
                  >
                    <option value="Catering">Catering</option>
                    <option value="Decoration & Floral">Decoration &amp; Floral</option>
                    <option value="Photography & Cinema">Photography &amp; Cinema</option>
                    <option value="Artist & Entertainment">Artist &amp; Entertainment</option>
                    <option value="Sound & Light Production">Sound &amp; Light Production</option>
                    <option value="Transport & Logistics">Transport &amp; Logistics</option>
                  </select>
                </div>
                <div>
                  <label className="font-label-caps uppercase text-secondary font-semibold block mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Vikramaditya Rathore"
                    value={vendorForm.contact_person}
                    onChange={(e) => setVendorForm({ ...vendorForm, contact_person: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-secondary/20 rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-label-caps uppercase text-secondary font-semibold block mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98200 11223"
                    value={vendorForm.phone}
                    onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-secondary/20 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-label-caps uppercase text-secondary font-semibold block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="contact@artisan.com"
                    value={vendorForm.email}
                    onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-secondary/20 rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-label-caps uppercase text-secondary font-semibold block mb-1">Base Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Jaipur, Rajasthan"
                    value={vendorForm.location}
                    onChange={(e) => setVendorForm({ ...vendorForm, location: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-secondary/20 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-label-caps uppercase text-secondary font-semibold block mb-1">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={vendorForm.rating}
                    onChange={(e) => setVendorForm({ ...vendorForm, rating: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-secondary/20 rounded text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-caps uppercase text-secondary font-semibold block mb-1">Services &amp; Specialization</label>
                <textarea
                  rows={2}
                  placeholder="Key capabilities, specialties, equipment, crew capacity..."
                  value={vendorForm.services}
                  onChange={(e) => setVendorForm({ ...vendorForm, services: e.target.value })}
                  className="w-full p-2.5 bg-surface-container-low border border-secondary/20 rounded text-xs"
                />
              </div>

              <div className="pt-3 border-t border-secondary/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddVendorModal(false)}
                  className="px-4 py-2 bg-surface-container-low text-on-surface-variant rounded uppercase font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-surface rounded uppercase font-semibold text-xs hover:bg-secondary-dark shadow-sm"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT VENDOR MODAL */}
      {editingVendor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg p-6 rounded-xl shadow-2xl border border-secondary/30 space-y-4">
            <div className="flex items-center justify-between border-b border-secondary/20 pb-3">
              <h3 className="font-headline-sm text-lg text-primary font-serif">Edit Vendor Partner</h3>
              <button onClick={() => setEditingVendor(null)} className="text-on-surface-variant hover:text-primary text-xl">✕</button>
            </div>

            <form onSubmit={handleEditVendorSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-label-caps uppercase text-secondary font-semibold block mb-1">Company / Brand Name</label>
                <input
                  required
                  type="text"
                  value={editingVendor.name}
                  onChange={(e) => setEditingVendor({ ...editingVendor, name: e.target.value })}
                  className="w-full p-2.5 bg-surface-container-low border border-secondary/20 rounded text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-label-caps uppercase text-secondary font-semibold block mb-1">Category</label>
                  <input
                    type="text"
                    value={editingVendor.category}
                    onChange={(e) => setEditingVendor({ ...editingVendor, category: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-secondary/20 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-label-caps uppercase text-secondary font-semibold block mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={editingVendor.contact_person}
                    onChange={(e) => setEditingVendor({ ...editingVendor, contact_person: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-secondary/20 rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-label-caps uppercase text-secondary font-semibold block mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingVendor.phone}
                    onChange={(e) => setEditingVendor({ ...editingVendor, phone: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-secondary/20 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-label-caps uppercase text-secondary font-semibold block mb-1">Email</label>
                  <input
                    type="email"
                    value={editingVendor.email}
                    onChange={(e) => setEditingVendor({ ...editingVendor, email: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-secondary/20 rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-label-caps uppercase text-secondary font-semibold block mb-1">Base Location</label>
                  <input
                    type="text"
                    value={editingVendor.location}
                    onChange={(e) => setEditingVendor({ ...editingVendor, location: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-secondary/20 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-label-caps uppercase text-secondary font-semibold block mb-1">Status</label>
                  <select
                    value={editingVendor.status}
                    onChange={(e) => setEditingVendor({ ...editingVendor, status: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-secondary/20 rounded text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Preferred Partner">Preferred Partner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-label-caps uppercase text-secondary font-semibold block mb-1">Services</label>
                <textarea
                  rows={2}
                  value={editingVendor.services}
                  onChange={(e) => setEditingVendor({ ...editingVendor, services: e.target.value })}
                  className="w-full p-2.5 bg-surface-container-low border border-secondary/20 rounded text-xs"
                />
              </div>

              <div className="pt-3 border-t border-secondary/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingVendor(null)}
                  className="px-4 py-2 bg-surface-container-low text-on-surface-variant rounded uppercase font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-surface rounded uppercase font-semibold text-xs hover:bg-secondary-dark shadow-sm"
                >
                  Update Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
