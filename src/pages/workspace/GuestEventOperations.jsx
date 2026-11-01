import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useData } from '../../context/DataContext';

export default function GuestEventOperations() {
  const {
    weddings,
    selectedWeddingId,
    setSelectedWeddingId,
    selectedWedding,
    guests,
    addGuest,
    checkInGuest,
    events,
    vendorArrivals,
    updateArrivalStatus
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState('guests'); // 'guests' | 'runofshow'
  const [searchGuest, setSearchGuest] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [qrInputScan, setQrInputScan] = useState('');
  const [checkInResult, setCheckInResult] = useState(null);
  const [viewingQrGuest, setViewingQrGuest] = useState(null);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [reportingIssueArrival, setReportingIssueArrival] = useState(null);
  const [issueText, setIssueText] = useState('');

  const [newGuestData, setNewGuestData] = useState({
    name: '',
    phone: '',
    family_group: 'Groom Immediate Family',
    plus_ones: 0,
    invitation_category: 'VIP Royal Patron',
    table_assigned: 'Table 1'
  });

  const weddingGuests = guests.filter(g => g.wedding_id === selectedWeddingId);
  const weddingEvents = events.filter(e => e.wedding_id === selectedWeddingId);
  const weddingArrivals = vendorArrivals.filter(a => a.wedding_id === selectedWeddingId);

  // Attendance metrics
  const totalInvited = selectedWedding.expected_guests || 400;
  const actualCheckins = weddingGuests.filter(g => g.checked_in).reduce((sum, g) => sum + 1 + g.plus_ones, 0);
  const confirmedRsvps = weddingGuests.filter(g => g.rsvp_status === 'Attending').length;
  const pendingRsvps = weddingGuests.filter(g => g.rsvp_status === 'Pending').length;
  const isOverAttended = actualCheckins > totalInvited;
  const extraGuestsCount = isOverAttended ? actualCheckins - totalInvited : 0;

  const filteredGuests = weddingGuests.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchGuest.toLowerCase()) ||
                          g.family_group.toLowerCase().includes(searchGuest.toLowerCase()) ||
                          g.qr_code.toLowerCase().includes(searchGuest.toLowerCase());
    const matchesCat = selectedCategory === 'All' || g.invitation_category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleSimulateQrScan = async (e) => {
    e.preventDefault();
    if (!qrInputScan.trim()) return;
    try {
      const res = await checkInGuest(qrInputScan.trim(), true);
      setCheckInResult(res);
      setQrInputScan('');
    } catch (err) {
      setCheckInResult({ success: false, message: `Check-in error: ${err.message}` });
    }
  };

  const handleManualCheckIn = async (guestId) => {
    try {
      const res = await checkInGuest(guestId, false);
      setCheckInResult(res);
    } catch (err) {
      setCheckInResult({ success: false, message: `Check-in error: ${err.message}` });
    }
  };

  const handleCreateGuest = async (e) => {
    e.preventDefault();
    if (!newGuestData.name.trim()) return;
    try {
      await addGuest({
        ...newGuestData,
        wedding_id: selectedWeddingId
      });
      setNewGuestData({
        name: '',
        phone: '',
        family_group: 'Groom Immediate Family',
        plus_ones: 0,
        invitation_category: 'VIP Royal Patron',
        table_assigned: 'Table 1'
      });
      setShowAddGuestModal(false);
    } catch (err) {
      alert(`Error creating guest: ${err.message}`);
    }
  };

  const handleReportIssue = async (e) => {
    e.preventDefault();
    if (!reportingIssueArrival) return;
    try {
      await updateArrivalStatus(reportingIssueArrival.id, 'Delayed', null, issueText);
      setReportingIssueArrival(null);
      setIssueText('');
    } catch (err) {
      alert(`Error updating arrival: ${err.message}`);
    }
  };

  const handleMarkArrived = async (arrivalId) => {
    try {
      await updateArrivalStatus(arrivalId, 'Arrived');
    } catch (err) {
      alert(`Error updating arrival: ${err.message}`);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1720px] mx-auto w-full">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-secondary/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary font-semibold">
              Event Day Operations &amp; Guest Check-in
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
              Live Check-in Desk
            </span>
          </div>
          <h1 className="font-headline-lg text-3xl text-primary font-serif tracking-tight mt-1">
            Guests &amp; Event Day Operations
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant max-w-2xl mt-0.5">
            Real-time QR arrival scanning, anti-duplicate validation, over-attendance alerts, and vendor arrival run-sheets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface-container-low p-1 rounded border border-secondary/20 text-xs">
            <button
              onClick={() => setActiveSubTab('guests')}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'guests' ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
              <span>Guest Management</span>
            </button>
            <button
              onClick={() => setActiveSubTab('runofshow')}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'runofshow' ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>Day-of Run Sheet</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddGuestModal(true)}
            className="px-4 py-2 bg-primary-container text-on-primary font-title-md text-xs rounded shadow-sm hover:bg-secondary-dark transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            <span>Add VIP Guest</span>
          </button>
        </div>
      </div>

      {/* 2. OVER-ATTENDANCE BANNER (MANDATORY REQUIREMENT) */}
      {isOverAttended && (
        <div className="p-4 rounded-lg bg-error-container/30 border border-error text-error flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px] text-error">warning</span>
            <div>
              <h4 className="font-bold text-sm">Over-Attendance Alert: +{extraGuestsCount} Additional Guests Checked In</h4>
              <p className="text-xs text-on-error-container mt-0.5">
                Expected: {totalInvited} guests. Actual registered check-ins: {actualCheckins}. Additional catering covers and seating dispatched.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded bg-error text-on-error font-label-caps uppercase text-[10px] font-bold">
            Dispatched to Kitchen
          </span>
        </div>
      )}

      {/* 3. Summary Operational Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-label-caps text-on-surface-variant block font-semibold">
              Expected Capacity
            </span>
            <div className="text-2xl font-bold font-serif text-primary font-tabular-nums mt-1">
              {totalInvited}
            </div>
            <span className="text-[10px] text-on-surface-variant">Contracted seating</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[20px]">groups</span>
          </div>
        </div>

        <div className="p-4 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-label-caps text-on-surface-variant block font-semibold">
              Actual Checked In
            </span>
            <div className={`text-2xl font-bold font-serif font-tabular-nums mt-1 ${isOverAttended ? 'text-error' : 'text-secondary'}`}>
              {actualCheckins}
            </div>
            <span className="text-[10px] text-on-surface-variant">Verified at portal</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-secondary-container/40 flex items-center justify-center text-on-secondary-container">
            <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
          </div>
        </div>

        <div className="p-4 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-label-caps text-on-surface-variant block font-semibold">
              Confirmed RSVPs
            </span>
            <div className="text-2xl font-bold font-serif text-primary font-tabular-nums mt-1">
              {confirmedRsvps}
            </div>
            <span className="text-[10px] text-on-surface-variant">Attending all rituals</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[20px]">done_all</span>
          </div>
        </div>

        <div className="p-4 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-label-caps text-on-surface-variant block font-semibold">
              Pending RSVPs
            </span>
            <div className="text-2xl font-bold font-serif text-primary font-tabular-nums mt-1">
              {pendingRsvps}
            </div>
            <span className="text-[10px] text-on-surface-variant">Awaiting response</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">pending</span>
          </div>
        </div>
      </div>

      {/* 4. SUBTAB 1: GUEST REGISTRATION & LIVE QR SCANNER */}
      {activeSubTab === 'guests' && (
        <div className="space-y-6">
          {/* Quick QR Scanner & Duplicate Prevention Testing Desk */}
          <div className="p-6 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-secondary/15 pb-3">
              <div>
                <h3 className="font-headline-sm text-lg text-primary font-serif">
                  Guest QR Scanner &amp; Anti-Duplicate Arrival Desk
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Scan guest QR code pass or enter pass ID to instantly validate arrival and prevent duplicate re-entry.
                </p>
              </div>
              <span className="text-xs text-secondary font-medium">Fast Arrival Scanner Ready</span>
            </div>

            <form onSubmit={handleSimulateQrScan} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                  qr_code_scanner
                </span>
                <input
                  type="text"
                  placeholder="Scan or paste QR Pass Code (e.g. VIVAAH-W01-G001-SINGHANIA)..."
                  value={qrInputScan}
                  onChange={(e) => setQrInputScan(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-surface-container-low border border-secondary/20 rounded text-xs focus:outline-none focus:border-primary font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-surface rounded font-label-caps uppercase text-xs hover:bg-secondary-dark transition-colors shadow-sm font-semibold shrink-0"
              >
                Simulate QR Scan
              </button>
            </form>

            {/* Check-in feedback notification */}
            {checkInResult && (
              <div className={`p-4 rounded border text-xs flex items-center justify-between ${
                checkInResult.success
                  ? 'bg-secondary-container/30 border-secondary text-primary'
                  : 'bg-error-container/30 border-error text-error'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">
                    {checkInResult.success ? 'check_circle' : 'block'}
                  </span>
                  <span className="font-semibold">{checkInResult.message}</span>
                </div>
                <button onClick={() => setCheckInResult(null)} className="text-xs font-bold">✕</button>
              </div>
            )}
          </div>

          {/* Guests Table */}
          <div className="bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[16px]">search</span>
                <input
                  type="text"
                  placeholder="Search guests by name, table, family..."
                  value={searchGuest}
                  onChange={(e) => setSearchGuest(e.target.value)}
                  className="w-full h-8 pl-9 pr-3 bg-surface-container-low border border-secondary/20 rounded text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Category:</span>
                {['All', 'VIP Royal Patron', 'VVIP Dignitary', 'Family', 'Friends & Fellows'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded text-[11px] whitespace-nowrap ${
                      selectedCategory === cat ? 'bg-primary text-surface font-semibold' : 'bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant h-9 border-b border-secondary/15">
                    <th className="px-4 py-2 font-label-sm uppercase font-semibold">Guest Name</th>
                    <th className="px-4 py-2 font-label-sm uppercase font-semibold">Family / Group</th>
                    <th className="px-4 py-2 font-label-sm uppercase font-semibold">Table Seating</th>
                    <th className="px-4 py-2 font-label-sm uppercase font-semibold">Category</th>
                    <th className="px-4 py-2 font-label-sm uppercase font-semibold">RSVP</th>
                    <th className="px-4 py-2 font-label-sm uppercase font-semibold">Check-in Status</th>
                    <th className="px-4 py-2 font-label-sm uppercase font-semibold">Digital QR</th>
                    <th className="px-4 py-2 font-label-sm uppercase font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/10">
                  {filteredGuests.map((g) => (
                    <tr key={g.id} className="hover:bg-surface-container-low/50">
                      <td className="px-4 py-3 font-semibold text-primary">
                        {g.name}
                        {g.plus_ones > 0 && <span className="text-[10px] text-secondary ml-1 font-normal">(+{g.plus_ones} guest)</span>}
                        <span className="block text-[10px] text-on-surface-variant font-normal">{g.phone}</span>
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant">{g.family_group}</td>
                      <td className="px-4 py-3 text-on-surface">{g.table_assigned}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-secondary-container/40 text-on-secondary-container font-semibold">
                          {g.invitation_category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-surface-container font-medium text-primary">
                          {g.rsvp_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          g.checked_in ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'
                        }`}>
                          {g.checked_in ? '✓ Checked In' : 'Pending Arrival'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setViewingQrGuest(g)}
                          className="flex items-center gap-1 text-primary hover:text-secondary font-mono text-[11px] underline"
                        >
                          <span className="material-symbols-outlined text-[14px]">qr_code</span>
                          <span>{g.qr_code.slice(0, 15)}...</span>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {g.checked_in ? (
                          <span className="text-[10px] text-secondary font-semibold">Done</span>
                        ) : (
                          <button
                            onClick={() => handleManualCheckIn(g.id)}
                            className="px-2.5 py-1 bg-surface-container-high hover:bg-secondary text-primary rounded text-[10px] font-semibold transition-colors"
                          >
                            Manual In
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
      )}

      {/* 5. SUBTAB 2: RUN-OF-SHOW & VENDOR ARRIVALS */}
      {activeSubTab === 'runofshow' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Event Run-Sheets (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-secondary/15 pb-3">
                <h3 className="font-headline-sm text-lg text-primary font-serif">Event Day Master Timeline</h3>
                <span className="text-xs text-secondary font-medium">Synchronized Minutes</span>
              </div>

              <div className="space-y-4">
                {weddingEvents.map((evt, idx) => (
                  <div key={evt.id} className="p-4 bg-surface-container-low rounded border border-secondary/15 space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary text-surface flex items-center justify-center font-bold text-xs font-tabular-nums">
                          0{idx + 1}
                        </span>
                        <h4 className="font-semibold text-primary text-sm">{evt.event_name}</h4>
                      </div>
                      <span className="font-tabular-nums font-semibold text-primary">{evt.date}</span>
                    </div>

                    <p className="text-on-surface-variant leading-relaxed pl-8">{evt.description}</p>

                    <div className="pl-8 flex flex-wrap gap-4 text-[11px] text-secondary font-medium pt-1">
                      <span>Time: {evt.start_time} – {evt.end_time}</span>
                      <span>•</span>
                      <span>Venue: {evt.location}</span>
                      <span>•</span>
                      <span>Attire: {evt.dress_code}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Vendor Arrivals & Issues (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-secondary/15 pb-3">
                <h3 className="font-headline-sm text-lg text-primary font-serif">Vendor Arrival Logistics Board</h3>
                <span className="text-xs text-on-surface-variant font-tabular-nums">Day-of Tracking</span>
              </div>

              <div className="space-y-3">
                {weddingArrivals.map((arr) => (
                  <div key={arr.id} className="p-4 bg-surface-container-low rounded border border-secondary/15 space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold text-primary text-sm">{arr.vendor_name}</span>
                        <span className="text-[10px] text-on-surface-variant block">{arr.category}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        arr.arrival_status === 'Arrived'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : arr.arrival_status === 'Delayed'
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-surface-container-high text-on-surface'
                      }`}>
                        {arr.arrival_status}
                      </span>
                    </div>

                    <div className="flex justify-between text-[11px] text-on-surface-variant font-tabular-nums">
                      <span>Expected: {arr.expected_time}</span>
                      {arr.actual_arrival_time && <span>Actual Arrival: {arr.actual_arrival_time}</span>}
                    </div>

                    <p className="text-[11px] text-on-surface leading-snug">{arr.coordinator_notes}</p>

                    {arr.reported_issue && (
                      <div className="p-2 bg-error-container/30 border border-error/30 rounded text-[11px] text-error">
                        <span className="font-bold">Reported Incident:</span> {arr.reported_issue}
                      </div>
                    )}

                    <div className="pt-2 border-t border-secondary/15 flex items-center justify-between text-xs">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleMarkArrived(arr.id)}
                          className="px-2 py-1 bg-surface-container text-primary rounded text-[10px] font-semibold hover:bg-secondary"
                        >
                          Mark Arrived
                        </button>
                        <button
                          onClick={() => setReportingIssueArrival(arr)}
                          className="px-2 py-1 bg-surface-container text-error rounded text-[10px] font-semibold hover:bg-error-container"
                        >
                          Report Issue
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW QR CODE MODAL */}
      {viewingQrGuest && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-sm w-full p-6 rounded-lg border border-secondary/30 shadow-2xl text-center space-y-4">
            <div className="flex justify-between items-center border-b border-secondary/20 pb-2">
              <span className="text-[10px] font-label-caps uppercase text-secondary font-semibold">
                Royal Guest Invitation Pass
              </span>
              <button onClick={() => setViewingQrGuest(null)} className="text-lg">✕</button>
            </div>

            <div className="p-4 bg-surface rounded border border-secondary/20 flex justify-center">
              <QRCodeSVG value={viewingQrGuest.qr_code} size={180} level="H" />
            </div>

            <div className="space-y-1">
              <h4 className="font-headline-sm text-lg font-serif text-primary">{viewingQrGuest.name}</h4>
              <p className="text-xs text-on-surface-variant font-mono">{viewingQrGuest.qr_code}</p>
              <p className="text-xs text-secondary font-medium">{viewingQrGuest.table_assigned}</p>
            </div>

            <button
              onClick={async () => {
                await checkInGuest(viewingQrGuest.qr_code, true);
                setViewingQrGuest(null);
              }}
              className="w-full py-2 bg-primary text-surface rounded font-label-caps uppercase text-xs font-semibold hover:bg-secondary-dark"
            >
              Simulate Scan This Pass
            </button>
          </div>
        </div>
      )}

      {/* REPORT ISSUE MODAL */}
      {reportingIssueArrival && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-md w-full p-6 rounded-lg border border-secondary/30 shadow-2xl space-y-4 text-xs">
            <h3 className="font-headline-sm text-lg text-primary font-serif">
              Report Incident / Delay for {reportingIssueArrival.vendor_name}
            </h3>
            <form onSubmit={handleReportIssue} className="space-y-3">
              <textarea
                rows={3}
                required
                placeholder="Describe logistics delay, toll checkpoint, broken equipment..."
                value={issueText}
                onChange={(e) => setIssueText(e.target.value)}
                className="w-full p-2.5 bg-surface-container-low border border-secondary/20 rounded text-xs focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReportingIssueArrival(null)}
                  className="px-3 py-1.5 bg-surface-container text-on-surface-variant font-label-caps uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-error text-surface rounded font-label-caps uppercase text-xs font-semibold"
                >
                  Log Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD VIP GUEST MODAL */}
      {showAddGuestModal && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-md w-full p-6 rounded-lg border border-secondary/30 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-secondary/20 pb-2">
              <h3 className="font-headline-sm text-lg text-primary font-serif">Add VIP Guest</h3>
              <button onClick={() => setShowAddGuestModal(false)} className="text-lg">✕</button>
            </div>

            <form onSubmit={handleCreateGuest} className="space-y-3">
              <div>
                <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Guest Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Maharani Radhika Raje"
                  value={newGuestData.name}
                  onChange={(e) => setNewGuestData({ ...newGuestData, name: e.target.value })}
                  className="w-full p-2 bg-surface-container-low border border-secondary/20 rounded text-xs focus:outline-none mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98200 00000"
                    value={newGuestData.phone}
                    onChange={(e) => setNewGuestData({ ...newGuestData, phone: e.target.value })}
                    className="w-full p-2 bg-surface-container-low border border-secondary/20 rounded text-xs focus:outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Accompanying (+)</label>
                  <input
                    type="number"
                    min="0"
                    value={newGuestData.plus_ones}
                    onChange={(e) => setNewGuestData({ ...newGuestData, plus_ones: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-surface-container-low border border-secondary/20 rounded text-xs focus:outline-none mt-1 font-tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Category</label>
                  <select
                    value={newGuestData.invitation_category}
                    onChange={(e) => setNewGuestData({ ...newGuestData, invitation_category: e.target.value })}
                    className="w-full p-2 bg-surface-container-low border border-secondary/20 rounded text-xs mt-1"
                  >
                    <option value="VIP Royal Patron">VIP Royal Patron</option>
                    <option value="VVIP Dignitary">VVIP Dignitary</option>
                    <option value="Family">Family</option>
                    <option value="Friends & Fellows">Friends &amp; Fellows</option>
                  </select>
                </div>
                <div>
                  <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Table Assigned</label>
                  <input
                    type="text"
                    value={newGuestData.table_assigned}
                    onChange={(e) => setNewGuestData({ ...newGuestData, table_assigned: e.target.value })}
                    className="w-full p-2 bg-surface-container-low border border-secondary/20 rounded text-xs mt-1"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-secondary/20">
                <button
                  type="button"
                  onClick={() => setShowAddGuestModal(false)}
                  className="px-3 py-1.5 bg-surface-container text-on-surface-variant font-label-caps uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary text-surface rounded font-label-caps uppercase text-xs font-semibold hover:bg-secondary-dark"
                >
                  Issue Digital Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
