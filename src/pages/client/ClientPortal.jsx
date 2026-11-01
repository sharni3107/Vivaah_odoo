import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import PdfPreviewModal from '../../components/common/PdfPreviewModal';
import { downloadDocumentPdf } from '../../lib/pdfHelper';

export default function ClientPortal() {
  const navigate = useNavigate();
  const {
    weddings,
    quotations,
    clientApproveQuotation,
    clientRejectQuotation,
    tasks,
    events,
    guests,
    clientPayments,
    documents
  } = useData();

  const { logout, currentUser } = useAuth();

  // Aarav & Meera wedding context (wed-001)
  const coupleWedding = weddings.find(w => w.id === 'wed-001') || weddings[0];

  // Filter ONLY items shared with client!
  const sharedProposals = quotations.filter(q => q.wedding_id === coupleWedding.id && q.shared_with_client);
  const coupleEvents = events.filter(e => e.wedding_id === coupleWedding.id);
  const coupleTasks = tasks.filter(t => t.wedding_id === coupleWedding.id && (t.status === 'In Progress' || t.status === 'Done'));
  const coupleGuests = guests.filter(g => g.wedding_id === coupleWedding.id);
  const couplePayments = clientPayments.filter(p => p.wedding_id === coupleWedding.id);
  const coupleDocs = documents.filter(d => d.wedding_id === coupleWedding.id);

  const [activePortalTab, setActivePortalTab] = useState('proposals'); // 'proposals' | 'itinerary' | 'finances' | 'guests' | 'documents'
  const [feedbackInput, setFeedbackInput] = useState('');
  const [selectedProposalForFeedback, setSelectedProposalForFeedback] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);

  // State for PDF preview modal
  const [previewDoc, setPreviewDoc] = useState(null);

  const [actionErrMsg, setActionErrMsg] = useState(null);

  const handleApprove = async (quoteId) => {
    setActionErrMsg(null);
    try {
      await clientApproveQuotation(quoteId, "Approved by Aarav & Meera. Proceed with tasting and agreement lock.");
      setActionSuccessMsg("Proposal Approved! Status has been updated in the Agency Workspace.");
      setTimeout(() => setActionSuccessMsg(null), 3000);
    } catch (err) {
      setActionErrMsg(err.message);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!selectedProposalForFeedback) return;
    setActionErrMsg(null);
    try {
      await clientRejectQuotation(selectedProposalForFeedback.id, feedbackInput || "Requesting adjustments to menu courses.");
      setSelectedProposalForFeedback(null);
      setFeedbackInput('');
      setActionSuccessMsg("Revisions requested. Your Lead Planner Priya Sharma has been notified.");
      setTimeout(() => setActionSuccessMsg(null), 3000);
    } catch (err) {
      setActionErrMsg(err.message);
    }
  };

  const handleViewPdf = (title, category) => {
    setPreviewDoc({
      documentTitle: title,
      category: category,
      weddingTitle: coupleWedding.title || 'Aarav & Meera — Royal Jaipur Wedding',
      uploadedBy: 'Priya Sharma (Assigned Planner)'
    });
  };

  const handleDownloadPdf = (title, category) => {
    downloadDocumentPdf(
      title,
      category,
      coupleWedding.title || 'Aarav & Meera — Royal Jaipur Wedding',
      'Priya Sharma (Assigned Planner)'
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#F5EFE7] text-[#241820] portal-root font-inter antialiased">
      {/* 1. Client Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#B99A72]/20 h-20 flex items-center justify-between px-6 lg:px-12">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-[#241820] text-[#B99A72] flex items-center justify-center border border-[#B99A72]/30 shadow-xs transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined text-[18px]">favorite</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif text-lg tracking-[0.16em] uppercase text-[#241820] font-medium leading-none">
              VIVAAH
            </span>
            <span className="text-[9.5px] uppercase tracking-widest text-[#B99A72] mt-1 font-semibold">
              Client Portal
            </span>
          </div>
        </Link>

        {/* Client Profile & Sign Out */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-[#FAF7F2] rounded-lg text-xs border border-[#B99A72]/30 text-[#241820]">
            <span className="w-2 h-2 rounded-full bg-[#B99A72]" />
            <span className="font-semibold">Aarav Singhania &amp; Meera Kapoor</span>
          </span>

          <button
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="px-3.5 py-1.5 bg-[#FAF7F2] hover:bg-[#241820] text-[#241820] hover:text-[#F5EFE7] rounded-lg text-xs font-semibold border border-[#B99A72]/30 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* 2. Client Hero Welcome Card */}
      <main className="pt-28 pb-16 px-6 lg:px-12 max-w-6xl mx-auto space-y-8">
        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#B99A72]/30 bg-[#241820] text-[#F5EFE7] p-8 sm:p-12">
          <div className="absolute inset-0 opacity-20">
            <img src={coupleWedding.cover_image} alt="Jaipur Palace" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#241820] via-[#241820]/95 to-[#241820]/80" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-[10px] uppercase text-[#B99A72] tracking-[0.2em] font-bold">
                Private Wedding Suite
              </span>
              <span className="px-3 py-1 rounded bg-[#B99A72]/20 text-[#B99A72] text-xs border border-[#B99A72]/40 font-tabular-nums font-semibold">
                {coupleWedding.dates} · {coupleWedding.destination}
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl text-white font-serif font-normal">
                Welcome, Aarav &amp; Meera
              </h1>
              <p className="text-[#F5EFE7]/80 text-sm sm:text-base max-w-xl font-light mt-1.5 leading-relaxed">
                Your wedding celebration is currently 74% planned. Here you can review proposals shared by your assigned planner Priya Sharma, approve catering menus, view event schedules, and manage guests.
              </p>
            </div>

            {/* Quick Contact Planner Strip */}
            <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#B99A72] text-[#241820] font-bold flex items-center justify-center text-xs">
                  PS
                </div>
                <div>
                  <span className="text-[#B99A72] text-[10px] uppercase font-semibold block">Your Assigned Planner</span>
                  <span className="font-semibold text-white">{coupleWedding.assigned_planner} (Lead Planner)</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[#B99A72] font-medium">
                <span className="flex items-center gap-1 text-[#F5EFE7]">
                  <span className="material-symbols-outlined text-[16px] text-[#B99A72]">call</span> +91 98200 44123
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#F5EFE7]">
                  <span className="material-symbols-outlined text-[16px] text-[#B99A72]">mail</span> priya@vivaahweddings.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {actionSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm animate-fadeIn">
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">verified</span>
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {actionErrMsg && (
          <div className="p-4 bg-red-50 border border-red-300 text-red-800 rounded-xl flex items-center justify-between text-xs font-semibold shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600 text-[20px]">error</span>
              <span>{actionErrMsg}</span>
            </div>
            <button onClick={() => setActionErrMsg(null)} className="text-red-700 font-bold ml-2">✕</button>
          </div>
        )}

        {/* 3. Client Navigation Tabs */}
        <div className="border-b border-[#B99A72]/20 flex gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActivePortalTab('proposals')}
            className={`px-5 py-2.5 font-semibold uppercase tracking-wider text-xs border-b-2 transition-all flex items-center gap-1.5 ${
              activePortalTab === 'proposals'
                ? 'border-[#241820] text-[#241820]'
                : 'border-transparent text-[#343A35]/70 hover:text-[#241820]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span>Shared Proposals ({sharedProposals.length})</span>
          </button>

          <button
            onClick={() => setActivePortalTab('itinerary')}
            className={`px-5 py-2.5 font-semibold uppercase tracking-wider text-xs border-b-2 transition-all flex items-center gap-1.5 ${
              activePortalTab === 'itinerary'
                ? 'border-[#241820] text-[#241820]'
                : 'border-transparent text-[#343A35]/70 hover:text-[#241820]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            <span>Event Schedule</span>
          </button>

          <button
            onClick={() => setActivePortalTab('finances')}
            className={`px-5 py-2.5 font-semibold uppercase tracking-wider text-xs border-b-2 transition-all flex items-center gap-1.5 ${
              activePortalTab === 'finances'
                ? 'border-[#241820] text-[#241820]'
                : 'border-transparent text-[#343A35]/70 hover:text-[#241820]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">payments</span>
            <span>Payments &amp; Invoices</span>
          </button>

          <button
            onClick={() => setActivePortalTab('guests')}
            className={`px-5 py-2.5 font-semibold uppercase tracking-wider text-xs border-b-2 transition-all flex items-center gap-1.5 ${
              activePortalTab === 'guests'
                ? 'border-[#241820] text-[#241820]'
                : 'border-transparent text-[#343A35]/70 hover:text-[#241820]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">groups</span>
            <span>Guest List &amp; RSVPs</span>
          </button>

          <button
            onClick={() => setActivePortalTab('documents')}
            className={`px-5 py-2.5 font-semibold uppercase tracking-wider text-xs border-b-2 transition-all flex items-center gap-1.5 ${
              activePortalTab === 'documents'
                ? 'border-[#241820] text-[#241820]'
                : 'border-transparent text-[#343A35]/70 hover:text-[#241820]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">description</span>
            <span>Documents ({coupleDocs.length})</span>
          </button>
        </div>

        {/* 4. TAB 1: SHARED PROPOSALS */}
        {activePortalTab === 'proposals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl text-[#241820] font-serif font-normal">
                  Vendor Proposals for Your Review
                </h2>
                <p className="text-xs text-[#343A35]/80 mt-0.5">
                  Proposals selected and shared by your planner Priya Sharma. You can approve your selection or request revisions.
                </p>
              </div>
            </div>

            {sharedProposals.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-[#B99A72]/20">
                <span className="material-symbols-outlined text-4xl text-[#B99A72]">storefront</span>
                <h4 className="font-serif text-lg text-[#241820] mt-2">No Proposals Shared Yet</h4>
                <p className="text-xs text-[#343A35]/70">Your planner is currently vetting proposals from trusted vendors.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sharedProposals.map((quote) => (
                  <div
                    key={quote.id}
                    className={`bg-white rounded-2xl border p-6 flex flex-col justify-between space-y-6 transition-all shadow-sm ${
                      quote.status === 'Client Approved' || quote.status === 'Confirmed'
                        ? 'border-emerald-600 ring-1 ring-emerald-500'
                        : 'border-[#B99A72]/30 hover:shadow-md'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-[#B99A72] tracking-wider block">
                            Catering &amp; Banquet Bid
                          </span>
                          <h3 className="font-serif text-xl font-medium text-[#241820] mt-0.5">
                            {quote.vendor_name}
                          </h3>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold uppercase tracking-wider ${
                          quote.status === 'Client Approved' || quote.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-[#B99A72]/20 text-[#241820]'
                        }`}>
                          {quote.status}
                        </span>
                      </div>

                      <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#B99A72]/20 space-y-1">
                        <span className="text-xs text-[#343A35]/80 block">Total Quoted Package</span>
                        <div className="text-2xl font-bold font-serif text-[#241820] font-tabular-nums">
                          ₹{quote.total_quoted_amount.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[11px] text-[#B99A72] block font-medium">
                          ₹{quote.price_per_plate_or_service} per guest · All banquets included
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <span className="font-semibold text-[#241820] block">Included Highlights:</span>
                        <p className="text-[#343A35]/80 leading-relaxed text-xs">
                          {quote.service_inclusions}
                        </p>
                      </div>

                      {quote.client_feedback && (
                        <div className="p-3 bg-white rounded-lg border border-[#B99A72]/20 space-y-0.5 text-xs">
                          <span className="font-semibold text-[#241820]">Your Stored Decision:</span>
                          <p className="text-[#343A35] italic">{quote.client_feedback}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-[#B99A72]/20 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#343A35]/70 text-[11px]">Verified wedding vendor</span>
                        <button
                          onClick={() => handleViewPdf(
                            `${quote.vendor_name.replace(/\s+/g, '_')}_Quotation.pdf`,
                            'Vendor Quotation'
                          )}
                          className="text-[#241820] hover:text-[#B99A72] font-semibold flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[15px] text-[#B99A72]">picture_as_pdf</span>
                          <span>Review Full PDF Menu</span>
                        </button>
                      </div>

                      {quote.status !== 'Client Approved' && quote.status !== 'Confirmed' ? (
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <button
                            onClick={() => setSelectedProposalForFeedback(quote)}
                            className="py-2.5 bg-[#FAF7F2] hover:bg-[#F5EFE7] text-[#241820] rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors border border-[#B99A72]/30"
                          >
                            Request Revisions
                          </button>
                          <button
                            onClick={() => handleApprove(quote.id)}
                            className="py-2.5 bg-[#241820] text-[#F5EFE7] hover:bg-[#34242e] rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[16px] text-[#B99A72]">check_circle</span>
                            <span>Approve Proposal</span>
                          </button>
                        </div>
                      ) : (
                        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-center text-xs font-semibold text-emerald-800 flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                          <span>Proposal Approved by You — Confirmed in Wedding Schedule!</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. TAB 2: ITINERARY */}
        {activePortalTab === 'itinerary' && (
          <div className="bg-white p-8 rounded-2xl border border-[#B99A72]/25 shadow-sm space-y-6">
            <div>
              <h3 className="text-2xl text-[#241820] font-serif font-normal">3-Day Wedding Itinerary</h3>
              <p className="text-xs text-[#343A35]/80 mt-0.5">Run-of-show schedule for your family and guests</p>
            </div>

            <div className="space-y-4">
              {coupleEvents.map((evt) => (
                <div key={evt.id} className="p-5 bg-[#FAF7F2] rounded-xl border border-[#B99A72]/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10.5px] uppercase font-bold text-[#B99A72] tracking-wider">
                      {new Date(evt.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })} · {evt.start_time} - {evt.end_time}
                    </span>
                    <h4 className="font-serif text-xl font-medium text-[#241820]">{evt.event_name}</h4>
                    <p className="text-xs text-[#343A35] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#B99A72]">location_on</span>
                      <span>{evt.location}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-[#241820] border border-[#B99A72]/30 inline-block">
                      Dress Code: {evt.dress_code}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. TAB 3: PAYMENTS & INVOICES */}
        {activePortalTab === 'finances' && (
          <div className="bg-white p-8 rounded-2xl border border-[#B99A72]/25 shadow-sm space-y-6 text-xs">
            <div>
              <h3 className="text-2xl text-[#241820] font-serif font-normal">Payment Schedule &amp; Invoices</h3>
              <p className="text-xs text-[#343A35]/80 mt-0.5">Transparent milestone payment schedule and official receipts</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#FAF7F2] text-[#343A35] h-10 border-b border-[#B99A72]/20 font-semibold uppercase text-[10.5px] tracking-wider">
                    <th className="px-4 py-2">Milestone</th>
                    <th className="px-4 py-2">Scheduled Amount</th>
                    <th className="px-4 py-2">Due Date</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2 text-right">Official Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#B99A72]/15">
                  {couplePayments.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-3 font-semibold text-[#241820]">{p.milestone_name}</td>
                      <td className="px-4 py-3 font-bold text-[#241820] font-tabular-nums">₹{p.amount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 font-tabular-nums text-[#343A35]">{p.due_date}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          p.status === 'Paid' || p.status === 'Received'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-[#FAF7F2] text-[#343A35] border border-[#B99A72]/30'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {p.status === 'Paid' || p.status === 'Received' ? (
                          <button
                            onClick={() => handleViewPdf(`Receipt_${p.reference_no || p.id}.pdf`, 'Receipts')}
                            className="text-[#241820] hover:text-[#B99A72] font-semibold text-[11px] underline flex items-center gap-1 justify-end"
                          >
                            <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                            <span>Receipt #{p.reference_no || 'RTGS-99021'}</span>
                          </button>
                        ) : (
                          <span className="text-[#343A35]/60 text-[11px]">Scheduled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. TAB 4: GUEST ROSTER */}
        {activePortalTab === 'guests' && (
          <div className="bg-white p-8 rounded-2xl border border-[#B99A72]/25 shadow-sm space-y-6 text-xs">
            <div>
              <h3 className="text-2xl text-[#241820] font-serif font-normal">Guest Directory &amp; RSVPs ({coupleGuests.length})</h3>
              <p className="text-xs text-[#343A35]/80 mt-0.5">Family seating assignments and digital RSVP status</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#FAF7F2] text-[#343A35] h-10 border-b border-[#B99A72]/20 font-semibold uppercase text-[10.5px] tracking-wider">
                    <th className="px-4 py-2">Guest Name</th>
                    <th className="px-4 py-2">Family Group</th>
                    <th className="px-4 py-2">Table Assigned</th>
                    <th className="px-4 py-2">RSVP Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#B99A72]/15">
                  {coupleGuests.map((g) => (
                    <tr key={g.id}>
                      <td className="px-4 py-3 font-semibold text-[#241820]">{g.name} (+{g.plus_ones})</td>
                      <td className="px-4 py-3 text-[#343A35]">{g.family_group}</td>
                      <td className="px-4 py-3 text-[#343A35]">{g.table_assigned || 'Table Royal 1'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          g.rsvp_status === 'Attending'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {g.rsvp_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. TAB 5: DOCUMENTS */}
        {activePortalTab === 'documents' && (
          <div className="bg-white p-8 rounded-2xl border border-[#B99A72]/25 shadow-sm space-y-6 text-xs">
            <div>
              <h3 className="text-2xl text-[#241820] font-serif font-normal">Wedding Documents &amp; Contracts</h3>
              <p className="text-xs text-[#343A35]/80 mt-0.5">Official executed agreements and invoices available for viewing and download</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coupleDocs.map((doc) => (
                <div key={doc.id} className="p-4 bg-[#FAF7F2] rounded-xl border border-[#B99A72]/20 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="material-symbols-outlined text-[#B99A72] text-[24px] shrink-0">picture_as_pdf</span>
                    <div className="truncate">
                      <span className="font-semibold text-[#241820] block truncate">{doc.file_name}</span>
                      <span className="text-[10px] text-[#343A35]/70">{doc.category} • {doc.file_size}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleViewPdf(doc.file_name, doc.category)}
                      className="px-2.5 py-1 bg-white text-[#241820] rounded-lg border border-[#B99A72]/40 hover:bg-[#241820] hover:text-[#F5EFE7] transition-colors text-[11px] font-semibold shadow-2xs"
                    >
                      View PDF
                    </button>
                    <button
                      onClick={() => handleDownloadPdf(doc.file_name, doc.category)}
                      className="px-2.5 py-1 bg-[#241820] text-[#F5EFE7] rounded-lg hover:bg-[#34242e] transition-colors text-[11px] font-semibold shadow-2xs"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* REQUEST REVISIONS MODAL */}
      {selectedProposalForFeedback && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl border border-[#B99A72]/30 shadow-2xl space-y-4 text-xs">
            <h3 className="text-lg text-[#241820] font-serif font-normal">
              Request Changes for {selectedProposalForFeedback.vendor_name}
            </h3>
            <form onSubmit={handleReject} className="space-y-3">
              <textarea
                rows={3}
                required
                placeholder="Share your feedback, dietary preferences, or menu adjustments..."
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none focus:border-[#241820]"
              />
              <div className="flex justify-end gap-2.5 pt-2 border-t border-[#B99A72]/20">
                <button
                  type="button"
                  onClick={() => setSelectedProposalForFeedback(null)}
                  className="px-3.5 py-1.5 bg-[#FAF7F2] text-[#343A35] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#F5EFE7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#241820] text-[#F5EFE7] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#34242e]"
                >
                  Send to Planner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF PREVIEW MODAL */}
      {previewDoc && (
        <PdfPreviewModal
          isOpen={Boolean(previewDoc)}
          onClose={() => setPreviewDoc(null)}
          documentTitle={previewDoc.documentTitle}
          category={previewDoc.category}
          weddingTitle={previewDoc.weddingTitle}
          uploadedBy={previewDoc.uploadedBy}
        />
      )}
    </div>
  );
}
