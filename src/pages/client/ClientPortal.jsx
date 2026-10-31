import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

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

  const handleApprove = (quoteId) => {
    clientApproveQuotation(quoteId, "Approved by Aarav & Meera. Proceed with tasting and agreement lock.");
    setActionSuccessMsg("Proposal Approved! Status has been updated in the Agency Workspace.");
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleReject = (e) => {
    e.preventDefault();
    if (!selectedProposalForFeedback) return;
    clientRejectQuotation(selectedProposalForFeedback.id, feedbackInput || "Requesting adjustments to menu courses.");
    setSelectedProposalForFeedback(null);
    setFeedbackInput('');
    setActionSuccessMsg("Revisions requested. Your Lead Planner Priya Sharma has been notified.");
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  return (
    <div className="w-full min-h-screen bg-surface text-on-surface">
      {/* 1. Client Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-md border-b border-secondary/20 h-20 flex items-center justify-between px-6 lg:px-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-container text-secondary flex items-center justify-center border border-secondary/30">
            <span className="material-symbols-outlined text-[18px]">favorite</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-lg tracking-wider uppercase text-primary font-serif font-medium leading-none">
              VIVAAH
            </span>
            <span className="font-label-caps text-[9px] uppercase tracking-widest text-secondary mt-0.5">
              Client Portal
            </span>
          </div>
        </Link>

        {/* Client Profile & Sign Out */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded text-xs border border-secondary/20">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span className="font-medium text-primary">Aarav Singhania &amp; Meera Kapoor</span>
          </span>

          <button
            onClick={() => {
              logout();
              navigate('/client/login');
            }}
            className="px-3.5 py-1.5 bg-surface-container hover:bg-surface-container-high rounded text-xs text-primary font-semibold border border-secondary/20 flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* 2. Client Hero Welcome Card */}
      <main className="pt-28 pb-16 px-6 lg:px-12 max-w-6xl mx-auto space-y-8">
        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-secondary/30 bg-primary-container text-surface p-8 sm:p-12">
          <div className="absolute inset-0 opacity-20">
            <img src={coupleWedding.cover_image} alt="Jaipur Palace" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-container via-primary-container/95 to-primary-container/80" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-label-caps uppercase text-secondary-fixed tracking-[0.2em] text-xs font-semibold">
                Private Wedding Suite
              </span>
              <span className="px-3 py-1 rounded bg-secondary-container/20 text-secondary-fixed text-xs border border-secondary-fixed/30 font-tabular-nums">
                {coupleWedding.dates} · {coupleWedding.destination}
              </span>
            </div>

            <div>
              <h1 className="font-display-lg text-3xl sm:text-5xl text-surface-bright font-serif">
                Welcome, Aarav &amp; Meera
              </h1>
              <p className="font-body-lg text-surface-container text-sm sm:text-base max-w-xl font-light mt-1">
                Your private wedding dossier is currently 74% finalized. Here you can review proposals shared by your planner Priya Sharma, approve vendor menus, view event itineraries, and manage guests.
              </p>
            </div>

            {/* Quick Contact Planner Strip */}
            <div className="pt-4 border-t border-surface/15 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-container text-primary font-bold flex items-center justify-center text-xs">
                  PS
                </div>
                <div>
                  <span className="text-secondary-fixed text-[10px] uppercase font-label-caps block">Your Lead Architect</span>
                  <span className="font-semibold text-surface">{coupleWedding.assigned_planner} (Senior Director)</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-secondary-fixed font-medium">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">call</span> +91 98200 44123
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">mail</span> priya@vivaahateliers.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {actionSuccessMsg && (
          <div className="p-4 bg-secondary-container/40 border border-secondary text-primary rounded-lg flex items-center gap-2 text-xs font-medium animate-bounce shadow-sm">
            <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* 3. Client Navigation Tabs */}
        <div className="border-b border-secondary/20 flex gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActivePortalTab('proposals')}
            className={`px-5 py-2.5 font-title-md uppercase tracking-wider text-xs border-b-2 transition-all flex items-center gap-1.5 ${
              activePortalTab === 'proposals'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span>Shared Proposals ({sharedProposals.length})</span>
          </button>

          <button
            onClick={() => setActivePortalTab('itinerary')}
            className={`px-5 py-2.5 font-title-md uppercase tracking-wider text-xs border-b-2 transition-all flex items-center gap-1.5 ${
              activePortalTab === 'itinerary'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            <span>Celebration Schedule</span>
          </button>

          <button
            onClick={() => setActivePortalTab('finances')}
            className={`px-5 py-2.5 font-title-md uppercase tracking-wider text-xs border-b-2 transition-all flex items-center gap-1.5 ${
              activePortalTab === 'finances'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">payments</span>
            <span>Escrow &amp; Invoices</span>
          </button>

          <button
            onClick={() => setActivePortalTab('guests')}
            className={`px-5 py-2.5 font-title-md uppercase tracking-wider text-xs border-b-2 transition-all flex items-center gap-1.5 ${
              activePortalTab === 'guests'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">groups</span>
            <span>Guest Roster &amp; RSVPs</span>
          </button>

          <button
            onClick={() => setActivePortalTab('documents')}
            className={`px-5 py-2.5 font-title-md uppercase tracking-wider text-xs border-b-2 transition-all flex items-center gap-1.5 ${
              activePortalTab === 'documents'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">description</span>
            <span>Agreements &amp; Receipts</span>
          </button>
        </div>

        {/* 4. TAB 1: SHARED VENDOR PROPOSALS (CRITICAL WORKFLOW E) */}
        {activePortalTab === 'proposals' && (
          <div className="space-y-6">
            <div className="p-4 bg-surface-container-low rounded border border-secondary/20 flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">
                Below are the proposals vetted and curated specifically for you by Priya Sharma. Approved selections are directly locked into your master production schedule.
              </span>
              <span className="font-label-caps uppercase text-[10px] text-secondary font-semibold shrink-0">
                Discretion Protocol Protected
              </span>
            </div>

            {sharedProposals.length === 0 ? (
              <div className="p-12 text-center bg-surface-container-lowest border border-secondary/20 rounded-lg space-y-2">
                <span className="material-symbols-outlined text-[36px] text-secondary">hourglass_empty</span>
                <h3 className="font-headline-sm text-lg text-primary">No proposals pending review</h3>
                <p className="text-xs text-on-surface-variant">Your planner is currently vetting proposals from guild artisans.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sharedProposals.map((quote) => (
                  <div
                    key={quote.id}
                    className="p-6 bg-surface-container-lowest rounded-xl border border-secondary/30 shadow-md space-y-5 text-xs flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-label-caps uppercase text-secondary font-semibold">
                            Recommended Catering Partner
                          </span>
                          <h3 className="font-headline-sm text-2xl text-primary font-serif font-bold mt-0.5">
                            {quote.vendor_name}
                          </h3>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          quote.status === 'Client Approved' || quote.status === 'Confirmed'
                            ? 'bg-secondary-container text-on-secondary-container'
                            : quote.status === 'Client Rejected'
                            ? 'bg-error-container text-on-error-container'
                            : 'bg-primary-container text-on-primary'
                        }`}>
                          {quote.status}
                        </span>
                      </div>

                      <div className="p-4 bg-surface-container-low rounded border border-secondary/15 space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[10px] font-label-caps uppercase text-on-surface-variant font-semibold">
                            Full 3-Day Banquet Package
                          </span>
                          <span className="text-2xl font-bold font-serif text-primary font-tabular-nums">
                            ₹{quote.total_quoted_amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className="text-[11px] text-on-surface-variant block font-tabular-nums">
                          ₹{quote.price_per_plate_or_service} per guest · All banquets included
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <span className="font-semibold text-primary block">Included Experience Highlights:</span>
                        <p className="text-on-surface-variant leading-relaxed text-[11px]">
                          {quote.service_inclusions}
                        </p>
                      </div>

                      {quote.client_feedback && (
                        <div className="p-3 bg-surface-container rounded border border-secondary/20 space-y-0.5 text-[11px]">
                          <span className="font-semibold text-primary">Your Stored Decision:</span>
                          <p className="text-on-surface-variant italic">{quote.client_feedback}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-secondary/20 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-on-surface-variant text-[11px]">Includes Chef Ranveer live oversight</span>
                        <a
                          href={quote.proposal_pdf_url}
                          onClick={(e) => { e.preventDefault(); alert(`Opening PDF Proposal for ${quote.vendor_name}`); }}
                          className="text-primary hover:underline font-semibold flex items-center gap-1"
                        >
                          <span>Review Full PDF Menu</span>
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        </a>
                      </div>

                      {quote.status !== 'Client Approved' && quote.status !== 'Confirmed' ? (
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <button
                            onClick={() => setSelectedProposalForFeedback(quote)}
                            className="py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-primary rounded font-label-caps uppercase text-xs font-semibold transition-colors"
                          >
                            Request Revisions
                          </button>
                          <button
                            onClick={() => handleApprove(quote.id)}
                            className="py-2.5 bg-primary text-surface hover:bg-secondary-dark rounded font-label-caps uppercase text-xs font-semibold transition-colors shadow-md flex items-center justify-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                            <span>Approve Proposal</span>
                          </button>
                        </div>
                      ) : (
                        <div className="p-2.5 bg-secondary-container/40 border border-secondary rounded text-center text-xs font-semibold text-primary flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                          <span>Proposal Approved by You — Locked in Atelier Production!</span>
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
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-secondary/20 shadow-sm space-y-6">
            <div>
              <h3 className="font-headline-sm text-2xl text-primary font-serif">
                Three-Day Royal Celebration Run-of-Show
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Detailed itinerary for you and your family across City Palace and Rambagh Palace.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {coupleEvents.map((evt, idx) => (
                <div key={evt.id} className="p-4 bg-surface-container-low rounded-lg border border-secondary/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-label-caps uppercase text-secondary font-semibold">
                      Ritual 0{idx + 1} · {evt.date}
                    </span>
                    <h4 className="font-headline-sm text-lg text-primary font-semibold">{evt.event_name}</h4>
                    <p className="text-on-surface-variant text-[11px] max-w-xl">{evt.description}</p>
                    <div className="flex gap-4 text-[11px] text-secondary font-medium pt-1">
                      <span>Venue: {evt.location}</span>
                      <span>•</span>
                      <span>Suggested Attire: {evt.dress_code}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 font-tabular-nums text-xs">
                    <span className="font-bold text-primary block">{evt.start_time} – {evt.end_time}</span>
                    <span className="text-[10px] text-on-surface-variant">Personal shadow assigned</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. TAB 3: FINANCES & ESCROW */}
        {activePortalTab === 'finances' && (
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-secondary/20 shadow-sm space-y-6 text-xs">
            <div>
              <h3 className="font-headline-sm text-2xl text-primary font-serif">Escrow Schedule &amp; Invoices</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Transparent milestone schedule protected under legal escrow</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant h-9 border-b border-secondary/15">
                    <th className="px-4 py-2 font-label-sm uppercase font-semibold">Milestone</th>
                    <th className="px-4 py-2 font-label-sm uppercase font-semibold">Scheduled Amount</th>
                    <th className="px-4 py-2 font-label-sm uppercase font-semibold">Due Date</th>
                    <th className="px-4 py-2 font-label-sm uppercase font-semibold">Status</th>
                    <th className="px-4 py-2 font-label-sm uppercase font-semibold">Official Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/10">
                  {couplePayments.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-3 font-semibold text-primary">{p.milestone_name}</td>
                      <td className="px-4 py-3 font-bold text-primary font-tabular-nums">₹{p.amount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 font-tabular-nums text-on-surface">{p.due_date}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          p.status === 'Received' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.status === 'Received' ? (
                          <span className="font-mono text-[10px] text-secondary font-medium">Receipt #{p.reference_no}</span>
                        ) : (
                          <span className="text-on-surface-variant text-[10px]">Awaiting Settlement</span>
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
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-secondary/20 shadow-sm space-y-6 text-xs">
            <div>
              <h3 className="font-headline-sm text-2xl text-primary font-serif">Invited Guest Directory ({coupleGuests.length})</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Your family seating plan and digital RSVP status</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant h-9 border-b border-secondary/15">
                    <th className="px-4 py-2 font-label-sm uppercase font-semibold">Guest</th>
                    <th className="px-4 py-2 font-label-sm uppercase font-semibold">Family Delegation</th>
                    <th className="px-4 py-2 font-label-sm uppercase font-semibold">Table Seating</th>
                    <th className="px-4 py-2 font-label-sm uppercase font-semibold">RSVP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/10">
                  {coupleGuests.slice(0, 10).map((g) => (
                    <tr key={g.id}>
                      <td className="px-4 py-2.5 font-semibold text-primary">{g.name} (+{g.plus_ones})</td>
                      <td className="px-4 py-2.5 text-on-surface-variant">{g.family_group}</td>
                      <td className="px-4 py-2.5 text-on-surface">{g.table_assigned}</td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-secondary-container/40 text-on-secondary-container font-semibold">
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
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-secondary/20 shadow-sm space-y-6 text-xs">
            <div>
              <h3 className="font-headline-sm text-2xl text-primary font-serif">Shared Contracts &amp; Blueprints</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Official executed contracts available for download</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coupleDocs.map((doc) => (
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
      </main>

      {/* REQUEST REVISIONS MODAL */}
      {selectedProposalForFeedback && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-md w-full p-6 rounded-lg border border-secondary/30 shadow-2xl space-y-4 text-xs">
            <h3 className="font-headline-sm text-lg text-primary font-serif">
              Request Changes for {selectedProposalForFeedback.vendor_name}
            </h3>
            <form onSubmit={handleReject} className="space-y-3">
              <textarea
                rows={3}
                required
                placeholder="Share your feedback, dietary preferences, or menu adjustments..."
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                className="w-full p-2.5 bg-surface-container-low border border-secondary/20 rounded text-xs focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProposalForFeedback(null)}
                  className="px-3 py-1.5 bg-surface-container text-on-surface-variant font-label-caps uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary text-surface rounded font-label-caps uppercase text-xs font-semibold hover:bg-secondary-dark"
                >
                  Send to Planner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
