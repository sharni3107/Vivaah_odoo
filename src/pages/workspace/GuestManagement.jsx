import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useData } from '../../context/DataContext';

export default function GuestManagement() {
  const {
    weddings,
    selectedWeddingId,
    setSelectedWeddingId,
    selectedWedding,
    guests,
    addGuest,
    updateGuest,
    deleteGuest,
    checkInGuest,
    undoCheckInGuest
  } = useData();

  const [searchGuest, setSearchGuest] = useState('');
  const [selectedRsvpFilter, setSelectedRsvpFilter] = useState('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [qrInputScan, setQrInputScan] = useState('');
  const [checkInResult, setCheckInResult] = useState(null);
  const [viewingQrGuest, setViewingQrGuest] = useState(null);
  const [editingGuest, setEditingGuest] = useState(null);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [showManualCheckInModal, setShowManualCheckInModal] = useState(false);
  const [checkInMode, setCheckInMode] = useState('qr'); // 'qr' | 'manual'
  const [selectedManualGuestId, setSelectedManualGuestId] = useState('');
  const [modalSearchQuery, setModalSearchQuery] = useState('');

  const [newGuestData, setNewGuestData] = useState({
    name: '',
    phone: '',
    family_group: 'Groom Immediate Family',
    plus_ones: 0,
    invitation_category: 'VIP Royal Patron',
    table_assigned: 'Table 1',
    rsvp_status: 'Pending'
  });

  const weddingGuests = guests.filter(g => g.wedding_id === selectedWeddingId);

  // Attendance metrics
  const totalInvited = selectedWedding?.expected_guests || 400;
  const actualCheckins = weddingGuests.filter(g => g.checked_in).reduce((sum, g) => sum + 1 + (g.plus_ones || 0), 0);
  const confirmedRsvps = weddingGuests.filter(g => g.rsvp_status === 'Attending').length;
  const pendingRsvps = weddingGuests.filter(g => g.rsvp_status === 'Pending').length;

  const filteredGuests = weddingGuests.filter(g => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchGuest.toLowerCase()) ||
      g.family_group.toLowerCase().includes(searchGuest.toLowerCase()) ||
      (g.qr_code && g.qr_code.toLowerCase().includes(searchGuest.toLowerCase()));
    const matchesRsvp = selectedRsvpFilter === 'All' || g.rsvp_status === selectedRsvpFilter;
    const matchesCat = selectedCategoryFilter === 'All' || g.invitation_category === selectedCategoryFilter;
    return matchesSearch && matchesRsvp && matchesCat;
  });

  const modalFilteredGuests = weddingGuests.filter(g =>
    g.name.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
    g.family_group.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
    (g.phone && g.phone.includes(modalSearchQuery)) ||
    (g.table_assigned && g.table_assigned.toLowerCase().includes(modalSearchQuery.toLowerCase()))
  );

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

  const handleUndoCheckIn = async (guestId) => {
    if (undoCheckInGuest) {
      try {
        const res = await undoCheckInGuest(guestId);
        setCheckInResult(res);
      } catch (err) {
        setCheckInResult({ success: false, message: `Undo check-in error: ${err.message}` });
      }
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
        table_assigned: 'Table 1',
        rsvp_status: 'Pending'
      });
      setShowAddGuestModal(false);
    } catch (err) {
      alert(`Error creating guest: ${err.message}`);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingGuest) return;
    try {
      await updateGuest(editingGuest.id, {
        name: editingGuest.name,
        phone: editingGuest.phone,
        family_group: editingGuest.family_group,
        plus_ones: parseInt(editingGuest.plus_ones, 10) || 0,
        invitation_category: editingGuest.invitation_category,
        table_assigned: editingGuest.table_assigned,
        rsvp_status: editingGuest.rsvp_status
      });
      setEditingGuest(null);
    } catch (err) {
      alert(`Error updating guest: ${err.message}`);
    }
  };

  const handleDelete = async (guestId, guestName) => {
    if (window.confirm(`Are you sure you want to remove ${guestName} from the guest list?`)) {
      try {
        await deleteGuest(guestId);
      } catch (err) {
        alert(`Error removing guest: ${err.message}`);
      }
    }
  };

  const selectedGuestForManual = weddingGuests.find(g => g.id === selectedManualGuestId);

  return (
    <div className="p-8 space-y-6 max-w-[1720px] mx-auto w-full font-inter text-[#241820]">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#B99A72]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#B99A72] font-semibold">
              Guest Operations
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B99A72]" />
            <span className="text-[11px] uppercase tracking-wider text-[#343A35]/70">
              {weddingGuests.length} Guests Registered
            </span>
          </div>
          <h1 className="text-3xl text-[#241820] font-bold tracking-tight mt-1">
            Guest Management
          </h1>
          <p className="text-xs text-[#343A35]/80 max-w-2xl mt-0.5 leading-relaxed">
            Manage your wedding guest list, RSVPs, seating tables, digital QR passes, and check-in arrivals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Dedicated Manual Check-in Button */}
          <button
            onClick={() => setShowManualCheckInModal(true)}
            className="px-4 py-2 bg-[#FAF7F2] text-[#241820] border border-[#B99A72]/40 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#F5EFE7] transition-colors flex items-center gap-1.5 shadow-xs"
            title="Open quick manual guest check-in registry"
          >
            <span className="material-symbols-outlined text-[16px] text-[#B99A72]">how_to_reg</span>
            <span>Manual Check-in</span>
          </button>

          <button
            onClick={() => setShowAddGuestModal(true)}
            className="px-4 py-2 bg-[#241820] text-[#F5EFE7] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#34242e] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            <span>Add New Guest</span>
          </button>
        </div>
      </div>

      {/* 2. Top Attendance Overview Rail */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-white rounded-xl border border-[#B99A72]/20 shadow-xs space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[#343A35]/70 block font-semibold">
            Expected Guests
          </span>
          <div className="text-2xl font-bold text-[#241820]">
            {totalInvited}
          </div>
          <span className="text-[11px] text-[#343A35]/70">Based on wedding booking</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#B99A72]/20 shadow-xs space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[#343A35]/70 block font-semibold">
            Confirmed RSVPs
          </span>
          <div className="text-2xl font-bold text-[#B99A72]">
            {confirmedRsvps}
          </div>
          <span className="text-[11px] text-[#343A35]/70">{pendingRsvps} pending confirmation</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#B99A72]/20 shadow-xs space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[#343A35]/70 block font-semibold">
            Checked In (Actual)
          </span>
          <div className="text-2xl font-bold text-[#241820]">
            {actualCheckins}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Verified at venue entrance</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#B99A72]/20 shadow-xs space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[#343A35]/70 block font-semibold">
            QR Passes Issued
          </span>
          <div className="text-2xl font-bold text-[#241820]">
            {weddingGuests.length}
          </div>
          <span className="text-[11px] text-[#343A35]/70">100% passes generated</span>
        </div>
      </div>

      {/* 3. Fast Arrival Desk: QR Scanner + Manual Check-in Options */}
      <div className="p-5 bg-white rounded-xl border border-[#B99A72]/25 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#B99A72]/15 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#241820]">
              Guest Arrival Desk &amp; Anti-Duplicate Entry
            </h3>
            <p className="text-[11px] text-[#343A35]/70">
              Validate arrival via digital QR pass scan or through manual guest name registry.
            </p>
          </div>

          {/* Mode Switcher: QR Pass vs Manual Check-in */}
          <div className="flex items-center bg-[#FAF7F2] p-1 rounded-lg border border-[#B99A72]/25 text-xs self-start">
            <button
              onClick={() => {
                setCheckInMode('qr');
                setCheckInResult(null);
              }}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                checkInMode === 'qr'
                  ? 'bg-[#241820] text-[#F5EFE7] shadow-xs'
                  : 'text-[#343A35] hover:text-[#241820]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">qr_code_scanner</span>
              <span>QR Scanner</span>
            </button>
            <button
              onClick={() => {
                setCheckInMode('manual');
                setCheckInResult(null);
              }}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                checkInMode === 'manual'
                  ? 'bg-[#241820] text-[#F5EFE7] shadow-xs'
                  : 'text-[#343A35] hover:text-[#241820]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">how_to_reg</span>
              <span>Manual Check-in</span>
            </button>
          </div>
        </div>

        {/* Option A: QR Code Scanner Form */}
        {checkInMode === 'qr' && (
          <form onSubmit={handleSimulateQrScan} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#343A35]/50 text-[18px]">
                qr_code_scanner
              </span>
              <input
                type="text"
                placeholder="Scan or paste QR Pass Code (e.g. VIVAAH-W01-G001-SINGHANIA)..."
                value={qrInputScan}
                onChange={(e) => setQrInputScan(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#FAF7F2] border border-[#B99A72]/30 text-xs text-[#241820] focus:outline-none focus:border-[#241820]"
              />
            </div>
            <button
              type="submit"
              className="h-10 px-5 bg-[#241820] text-[#F5EFE7] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#34242e] transition-colors"
            >
              Process Scan
            </button>
          </form>
        )}

        {/* Option B: Manual Registry Check-in Controls */}
        {checkInMode === 'manual' && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#343A35]/50 text-[18px]">
                  person_search
                </span>
                <select
                  value={selectedManualGuestId}
                  onChange={(e) => {
                    setSelectedManualGuestId(e.target.value);
                    setCheckInResult(null);
                  }}
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#FAF7F2] border border-[#B99A72]/30 text-xs text-[#241820] focus:outline-none focus:border-[#241820]"
                >
                  <option value="">-- Choose guest from registry for manual check-in --</option>
                  {weddingGuests.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.family_group}) — {g.table_assigned} {g.checked_in ? '✓ Already Checked In' : '• Pending'}
                    </option>
                  ))}
                </select>
              </div>

              {selectedGuestForManual && (
                <div className="flex items-center gap-2">
                  {!selectedGuestForManual.checked_in ? (
                    <button
                      type="button"
                      onClick={() => handleManualCheckIn(selectedGuestForManual.id)}
                      className="h-10 px-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>Confirm Check-in</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUndoCheckIn(selectedGuestForManual.id)}
                      className="h-10 px-4 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">undo</span>
                      <span>Undo Check-in</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {selectedGuestForManual && (
              <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#B99A72]/20 flex flex-wrap items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[10px] text-[#343A35]/60 uppercase block font-semibold">Guest Name</span>
                    <span className="font-semibold text-[#241820] text-sm">{selectedGuestForManual.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#343A35]/60 uppercase block font-semibold">Family / Group</span>
                    <span className="text-[#343A35]">{selectedGuestForManual.family_group}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#343A35]/60 uppercase block font-semibold">Table Assigned</span>
                    <span className="font-semibold text-[#241820]">{selectedGuestForManual.table_assigned}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#343A35]/60 uppercase block font-semibold">Party Size</span>
                    <span className="text-[#343A35]">1 + {selectedGuestForManual.plus_ones || 0} guests</span>
                  </div>
                </div>

                <div>
                  {selectedGuestForManual.checked_in ? (
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-300">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      <span>Checked In ({new Date(selectedGuestForManual.checked_in_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                      Pending Arrival
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live Notification Feedback */}
        {checkInResult && (
          <div
            className={`p-3 rounded-lg border text-xs flex items-center justify-between animate-fadeIn ${
              checkInResult.duplicate
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : checkInResult.success
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                {checkInResult.duplicate ? 'warning' : checkInResult.success ? 'check_circle' : 'error'}
              </span>
              <span>{checkInResult.message}</span>
            </div>
            <button
              onClick={() => setCheckInResult(null)}
              className="text-[11px] font-semibold underline ml-4 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* 4. Controls & Filters */}
      <div className="p-4 rounded-xl bg-white border border-[#B99A72]/25 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold">Wedding:</span>
            <select
              value={selectedWeddingId}
              onChange={(e) => setSelectedWeddingId(e.target.value)}
              className="p-2 bg-[#FAF7F2] border border-[#B99A72]/30 font-medium text-xs text-[#241820] rounded-lg focus:outline-none"
            >
              {weddings.map((w) => (
                <option key={w.id} value={w.id}>{w.couple_names}</option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#343A35]/50 text-[16px]">search</span>
            <input
              type="text"
              placeholder="Search guest name, family, QR..."
              value={searchGuest}
              onChange={(e) => setSearchGuest(e.target.value)}
              className="w-full h-8 pl-8 pr-3 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none focus:border-[#241820]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold">RSVP:</span>
          {['All', 'Attending', 'Pending', 'Declined'].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRsvpFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedRsvpFilter === r
                  ? 'bg-[#241820] text-[#F5EFE7]'
                  : 'bg-[#FAF7F2] text-[#343A35] hover:bg-[#F5EFE7]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Guests Table */}
      <div className="bg-white rounded-xl border border-[#B99A72]/25 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] text-[#343A35] h-10 border-b border-[#B99A72]/20">
                <th className="px-4 py-2 uppercase tracking-wider font-semibold">Guest Name</th>
                <th className="px-4 py-2 uppercase tracking-wider font-semibold">Family / Group</th>
                <th className="px-4 py-2 uppercase tracking-wider font-semibold">Category</th>
                <th className="px-4 py-2 uppercase tracking-wider font-semibold">Table</th>
                <th className="px-4 py-2 uppercase tracking-wider font-semibold">RSVP</th>
                <th className="px-4 py-2 uppercase tracking-wider font-semibold">Arrival Status</th>
                <th className="px-4 py-2 uppercase tracking-wider font-semibold">QR Pass</th>
                <th className="px-4 py-2 uppercase tracking-wider font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B99A72]/15">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-[#343A35]/60">
                    No guests match your criteria. Click "Add New Guest" to create one.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((g) => (
                  <tr key={g.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#241820]">
                      <div>{g.name}</div>
                      {g.plus_ones > 0 && (
                        <span className="text-[10px] text-[#B99A72] font-medium">+{g.plus_ones} Accompanying</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#343A35]">{g.family_group}</td>
                    <td className="px-4 py-3 text-[#343A35]">{g.invitation_category}</td>
                    <td className="px-4 py-3 font-medium text-[#241820]">{g.table_assigned}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          g.rsvp_status === 'Attending'
                            ? 'bg-emerald-100 text-emerald-800'
                            : g.rsvp_status === 'Declined'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {g.rsvp_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {g.checked_in ? (
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                            <span className="material-symbols-outlined text-[12px]">check</span>
                            <span>Checked In</span>
                          </span>
                          <button
                            onClick={() => handleUndoCheckIn(g.id)}
                            title="Undo check-in"
                            className="text-[10px] text-[#343A35]/50 hover:text-red-700 underline"
                          >
                            Undo
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleManualCheckIn(g.id)}
                          className="px-2.5 py-1 rounded text-[10px] font-semibold bg-[#FAF7F2] text-[#241820] border border-[#B99A72]/30 hover:bg-[#241820] hover:text-[#F5EFE7] transition-colors flex items-center gap-1 shadow-2xs"
                          title="Manually check in this guest"
                        >
                          <span className="material-symbols-outlined text-[12px] text-[#B99A72]">how_to_reg</span>
                          <span>Check In Now</span>
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setViewingQrGuest(g)}
                        className="px-2 py-1 bg-[#FAF7F2] border border-[#B99A72]/30 text-[#241820] rounded hover:bg-[#F5EFE7] flex items-center gap-1 font-mono text-[10px]"
                      >
                        <span className="material-symbols-outlined text-[13px] text-[#B99A72]">qr_code</span>
                        <span>Pass</span>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingGuest(g)}
                          title="Edit Guest"
                          className="p-1 text-[#343A35] hover:text-[#241820] rounded hover:bg-[#FAF7F2]"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(g.id, g.name)}
                          title="Delete Guest"
                          className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
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

      {/* 6. DEDICATED MANUAL CHECK-IN POPUP MODAL */}
      {showManualCheckInModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-2xl border border-[#B99A72]/30 shadow-2xl flex flex-col overflow-hidden text-xs">
            {/* Modal Header */}
            <div className="p-5 bg-[#FAF7F2] border-b border-[#B99A72]/20 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#B99A72] text-[18px]">how_to_reg</span>
                  <h3 className="text-base font-bold text-[#241820]">Manual Guest Registry &amp; Check-in</h3>
                </div>
                <p className="text-[11px] text-[#343A35]/70 mt-0.5">
                  Rapidly admit guests arriving without digital QR passes.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowManualCheckInModal(false);
                  setModalSearchQuery('');
                }}
                className="w-8 h-8 rounded-full bg-white border border-[#B99A72]/20 flex items-center justify-center text-[#343A35] hover:text-[#241820]"
              >
                ✕
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="p-4 border-b border-[#B99A72]/15 bg-white">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#343A35]/50 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Type guest name, table, or phone number to check in..."
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full h-10 pl-10 pr-3 rounded-lg bg-[#FAF7F2] border border-[#B99A72]/30 text-xs text-[#241820] focus:outline-none focus:border-[#241820]"
                />
              </div>
            </div>

            {/* Modal Guest List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {modalFilteredGuests.length === 0 ? (
                <div className="text-center py-8 text-[#343A35]/60">
                  No registered guests match "{modalSearchQuery}".
                </div>
              ) : (
                modalFilteredGuests.map((g) => (
                  <div
                    key={g.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                      g.checked_in
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-[#FAF7F2]/60 border-[#B99A72]/20 hover:border-[#B99A72]/40'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#241820] text-sm">{g.name}</span>
                        {g.plus_ones > 0 && (
                          <span className="px-1.5 py-0.2 rounded bg-[#B99A72]/15 text-[#241820] text-[10px] font-semibold">
                            +{g.plus_ones} Guests
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-[#343A35]/80">
                        <span>{g.family_group}</span>
                        <span>•</span>
                        <span>{g.table_assigned}</span>
                        {g.phone && (
                          <>
                            <span>•</span>
                            <span className="font-mono">{g.phone}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      {g.checked_in ? (
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">check</span>
                            <span>Admitted</span>
                          </span>
                          <button
                            onClick={() => handleUndoCheckIn(g.id)}
                            className="text-[11px] text-[#343A35]/60 hover:text-red-700 underline"
                          >
                            Undo
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleManualCheckIn(g.id)}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[14px]">how_to_reg</span>
                          <span>Check In</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#FAF7F2] border-t border-[#B99A72]/20 flex justify-between items-center text-[11px] text-[#343A35]/70">
              <span>Showing {modalFilteredGuests.length} guests in project</span>
              <button
                onClick={() => {
                  setShowManualCheckInModal(false);
                  setModalSearchQuery('');
                }}
                className="px-4 py-1.5 bg-[#241820] text-[#F5EFE7] rounded-lg text-xs font-semibold uppercase"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. ADD GUEST MODAL */}
      {showAddGuestModal && (
        <div className="fixed inset-0 z-50 bg-[#241820]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 rounded-2xl border border-[#B99A72]/30 shadow-2xl space-y-4 text-xs animate-scaleUp">
            <div className="flex justify-between items-center border-b border-[#B99A72]/20 pb-2">
              <h3 className="text-lg text-[#241820] font-bold">Add New Wedding Guest</h3>
              <button onClick={() => setShowAddGuestModal(false)} className="text-base text-[#343A35]/70 hover:text-[#241820]">✕</button>
            </div>

            <form onSubmit={handleCreateGuest} className="space-y-3.5 pt-1">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                  Guest Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Yashvardhan Singhania"
                  value={newGuestData.name}
                  onChange={(e) => setNewGuestData({ ...newGuestData, name: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none focus:border-[#241820]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                    Family / Group
                  </label>
                  <select
                    value={newGuestData.family_group}
                    onChange={(e) => setNewGuestData({ ...newGuestData, family_group: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                  >
                    <option value="Groom Immediate Family">Groom Immediate Family</option>
                    <option value="Bride Immediate Family">Bride Immediate Family</option>
                    <option value="Royal Extended Clan">Royal Extended Clan</option>
                    <option value="Distinguished VIPs">Distinguished VIPs</option>
                    <option value="Corporate Associates">Corporate Associates</option>
                    <option value="Close Friends">Close Friends</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                    Category
                  </label>
                  <select
                    value={newGuestData.invitation_category}
                    onChange={(e) => setNewGuestData({ ...newGuestData, invitation_category: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                  >
                    <option value="VIP Royal Patron">VIP Royal Patron</option>
                    <option value="VVIP Sovereign">VVIP Sovereign</option>
                    <option value="General Guest">General Guest</option>
                    <option value="Special Invite">Special Invite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98200 44556"
                    value={newGuestData.phone}
                    onChange={(e) => setNewGuestData({ ...newGuestData, phone: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                    Plus Ones (Accompanying)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={newGuestData.plus_ones}
                    onChange={(e) => setNewGuestData({ ...newGuestData, plus_ones: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                    Initial RSVP Status
                  </label>
                  <select
                    value={newGuestData.rsvp_status}
                    onChange={(e) => setNewGuestData({ ...newGuestData, rsvp_status: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Attending">Attending</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                    Table Assigned
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Table 4 - Lake Pavilion"
                    value={newGuestData.table_assigned}
                    onChange={(e) => setNewGuestData({ ...newGuestData, table_assigned: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#B99A72]/20 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddGuestModal(false)}
                  className="px-4 py-2 bg-[#FAF7F2] text-[#343A35] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#F5EFE7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#241820] text-[#F5EFE7] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#34242e]"
                >
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. EDIT GUEST MODAL */}
      {editingGuest && (
        <div className="fixed inset-0 z-50 bg-[#241820]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 rounded-2xl border border-[#B99A72]/30 shadow-2xl space-y-4 text-xs animate-scaleUp">
            <div className="flex justify-between items-center border-b border-[#B99A72]/20 pb-2">
              <h3 className="text-lg text-[#241820] font-bold">Edit Guest Details</h3>
              <button onClick={() => setEditingGuest(null)} className="text-base text-[#343A35]/70 hover:text-[#241820]">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 pt-1">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                  Guest Name
                </label>
                <input
                  required
                  type="text"
                  value={editingGuest.name}
                  onChange={(e) => setEditingGuest({ ...editingGuest, name: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                    Family / Group
                  </label>
                  <input
                    type="text"
                    value={editingGuest.family_group}
                    onChange={(e) => setEditingGuest({ ...editingGuest, family_group: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                    Category
                  </label>
                  <select
                    value={editingGuest.invitation_category}
                    onChange={(e) => setEditingGuest({ ...editingGuest, invitation_category: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                  >
                    <option value="VIP Royal Patron">VIP Royal Patron</option>
                    <option value="VVIP Sovereign">VVIP Sovereign</option>
                    <option value="General Guest">General Guest</option>
                    <option value="Special Invite">Special Invite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editingGuest.phone || ''}
                    onChange={(e) => setEditingGuest({ ...editingGuest, phone: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                    Plus Ones
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={editingGuest.plus_ones}
                    onChange={(e) => setEditingGuest({ ...editingGuest, plus_ones: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                    RSVP Status
                  </label>
                  <select
                    value={editingGuest.rsvp_status}
                    onChange={(e) => setEditingGuest({ ...editingGuest, rsvp_status: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                  >
                    <option value="Attending">Attending</option>
                    <option value="Pending">Pending</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                    Table Assigned
                  </label>
                  <input
                    type="text"
                    value={editingGuest.table_assigned}
                    onChange={(e) => setEditingGuest({ ...editingGuest, table_assigned: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#B99A72]/20 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingGuest(null)}
                  className="px-4 py-2 bg-[#FAF7F2] text-[#343A35] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#F5EFE7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#241820] text-[#F5EFE7] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#34242e]"
                >
                  Update Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. QR Code Pass Modal */}
      {viewingQrGuest && (
        <div className="fixed inset-0 z-50 bg-[#241820]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-2xl border border-[#B99A72]/30 text-center space-y-4 animate-scaleUp">
            <div className="flex justify-between items-center border-b border-[#B99A72]/20 pb-2">
              <span className="text-[11px] uppercase tracking-wider text-[#B99A72] font-semibold">Digital Wedding Pass</span>
              <button
                onClick={() => setViewingQrGuest(null)}
                className="text-[#343A35] hover:text-[#241820] font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#241820]">{viewingQrGuest.name}</h3>
              <p className="text-xs text-[#343A35]">{viewingQrGuest.family_group} • {viewingQrGuest.invitation_category}</p>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#B99A72]/30 inline-block mx-auto shadow-inner">
              <QRCodeSVG
                value={viewingQrGuest.qr_code || `VIVAAH-${viewingQrGuest.id}`}
                size={180}
                bgColor="#FAF7F2"
                fgColor="#241820"
                level="M"
              />
            </div>

            <div className="bg-[#FAF7F2] p-2.5 rounded-lg border border-[#B99A72]/20 text-xs font-mono text-[#B99A72] font-semibold">
              {viewingQrGuest.qr_code}
            </div>

            <p className="text-[11px] text-[#343A35]/70">
              Assigned Table: <span className="font-semibold text-[#241820]">{viewingQrGuest.table_assigned}</span>
              {viewingQrGuest.plus_ones > 0 && ` • Plus Ones: ${viewingQrGuest.plus_ones}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
