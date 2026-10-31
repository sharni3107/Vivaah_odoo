import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';

export default function EnquiriesClients() {
  const navigate = useNavigate();
  const { enquiries, updateEnquiryStatus, addEnquiryNote, convertEnquiryToWedding } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [conversionSuccessMsg, setConversionSuccessMsg] = useState(null);

  const statuses = ['All', 'New', 'Contacted', 'Follow-up', 'Consultation Scheduled', 'Confirmed', 'Lost'];

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.client_names.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatusFilter === 'All' || e.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedEnquiry) return;
    addEnquiryNote(selectedEnquiry.id, newNoteText);
    // Refresh selected enquiry from updated state
    setSelectedEnquiry((prev) => ({
      ...prev,
      notes: [
        ...(prev.notes || []),
        { date: new Date().toISOString().split('T')[0], author: 'Desk Executive', text: newNoteText }
      ]
    }));
    setNewNoteText('');
  };

  const handleConvertToWedding = (enquiryId) => {
    const newWedding = convertEnquiryToWedding(enquiryId);
    if (newWedding) {
      setConversionSuccessMsg(`Successfully converted to Wedding Project "${newWedding.title}"! Generated 27 tasks.`);
      setTimeout(() => {
        setConversionSuccessMsg(null);
        setSelectedEnquiry(null);
        navigate('/workspace/weddings');
      }, 1800);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1720px] mx-auto w-full relative">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-secondary/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary font-semibold">
              Patron Relationship Management
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
              Inquiry Pipeline
            </span>
          </div>
          <h1 className="font-headline-lg text-3xl text-primary font-serif tracking-tight mt-1">
            Enquiries &amp; Client CRM
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant max-w-2xl mt-0.5">
            Manage incoming high-net-worth inquiries, consultation notes, follow-up timelines, and 1-click wedding project conversion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/enquire"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-primary-container text-on-primary font-title-md text-xs rounded shadow-sm hover:bg-secondary-dark transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>Open Public Enquiry Form</span>
          </a>
        </div>
      </div>

      {conversionSuccessMsg && (
        <div className="p-4 bg-secondary-container/40 border border-secondary text-primary rounded flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-secondary text-[24px]">verified</span>
          <span className="font-medium text-xs">{conversionSuccessMsg}</span>
        </div>
      )}

      {/* 2. Pipeline Summary Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statuses.filter(s => s !== 'All').map((st) => {
          const count = enquiries.filter(e => e.status === st).length;
          return (
            <div
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`p-3 rounded border transition-all cursor-pointer ${
                selectedStatusFilter === st
                  ? 'bg-surface-container-lowest border-primary shadow-sm ring-1 ring-primary'
                  : 'bg-surface-container-low border-secondary/15 hover:bg-surface-container-lowest'
              }`}
            >
              <span className="text-[10px] font-label-caps uppercase tracking-wider text-on-surface-variant block font-semibold">
                {st}
              </span>
              <div className="text-xl font-bold font-serif text-primary mt-1 font-tabular-nums">
                {count}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="p-4 rounded-lg bg-surface-container-lowest border border-secondary/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex items-center flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[16px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search by client name, destination, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded bg-surface-container-low text-xs text-on-surface placeholder:text-on-surface-variant border border-outline-variant/30 focus:outline-none focus:bg-surface-container-lowest"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="font-label-caps uppercase text-[10px] text-secondary font-semibold mr-1">Filter:</span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-3 py-1 rounded transition-colors whitespace-nowrap text-xs ${
                selectedStatusFilter === st
                  ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-primary'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Enquiries Register Table */}
      <div className="bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant h-9 border-b border-secondary/15">
                <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold">Client / Couple</th>
                <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold">Destination</th>
                <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold">Wedding Date</th>
                <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold">Guests</th>
                <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold">Est. Budget</th>
                <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold">Package Type</th>
                <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold">Status</th>
                <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold">Representative</th>
                <th className="px-4 py-2 font-label-sm uppercase tracking-wider font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10">
              {filteredEnquiries.map((enq) => {
                const isConverted = Boolean(enq.converted_wedding_id);
                return (
                  <tr
                    key={enq.id}
                    className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedEnquiry(enq)}
                  >
                    <td className="px-4 py-3 font-semibold text-primary">
                      {enq.client_names}
                      <span className="block text-[11px] text-on-surface-variant font-normal">{enq.email}</span>
                    </td>
                    <td className="px-4 py-3 text-on-surface">{enq.destination}</td>
                    <td className="px-4 py-3 font-tabular-nums text-on-surface">{enq.wedding_date}</td>
                    <td className="px-4 py-3 font-tabular-nums text-on-surface">{enq.expected_guests} pax</td>
                    <td className="px-4 py-3 font-tabular-nums font-semibold text-primary">
                      ₹{(enq.estimated_budget / 10000000).toFixed(2)} Cr
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-surface-container text-on-surface">
                        {enq.package_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          enq.status === 'Confirmed'
                            ? 'bg-secondary-container text-on-secondary-container'
                            : enq.status === 'New'
                            ? 'bg-error-container text-on-error-container'
                            : enq.status === 'Consultation Scheduled'
                            ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                            : 'bg-surface-container-high text-on-surface'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant text-[11px]">{enq.represented_by}</td>
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      {isConverted ? (
                        <span className="px-2.5 py-1 bg-surface-container text-secondary text-[10px] rounded font-medium border border-secondary/20">
                          ✓ Project Active
                        </span>
                      ) : (
                        <button
                          onClick={() => handleConvertToWedding(enq.id)}
                          className="px-2.5 py-1 bg-primary text-surface rounded text-[10px] uppercase tracking-wider font-semibold hover:bg-secondary-dark transition-colors shadow-sm"
                        >
                          Convert →
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. SLIDE-OUT DOSSIER DETAIL DRAWER */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl h-full bg-surface-container-lowest shadow-2xl border-l border-secondary/20 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-6 border-b border-secondary/20 flex items-start justify-between bg-surface-container-low/50">
              <div>
                <span className="font-label-caps text-[10px] uppercase tracking-wider text-secondary font-semibold">
                  Client Dossier #{selectedEnquiry.id}
                </span>
                <h2 className="font-headline-sm text-2xl text-primary font-serif mt-1">
                  {selectedEnquiry.client_names}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-xs text-on-surface-variant">
                  <span>{selectedEnquiry.email}</span>
                  <span>•</span>
                  <span>{selectedEnquiry.phone}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1 text-xs">
              {/* Quick Status Control */}
              <div className="p-4 bg-surface-container-low rounded border border-secondary/20 flex items-center justify-between">
                <div>
                  <label className="font-label-caps uppercase text-[10px] text-secondary font-semibold block">
                    Current Pipeline Status
                  </label>
                  <span className="font-semibold text-primary text-sm mt-0.5 block">{selectedEnquiry.status}</span>
                </div>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    updateEnquiryStatus(selectedEnquiry.id, newStatus);
                    setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
                  }}
                  className="bg-surface-container-lowest p-2 border border-secondary/30 text-xs text-primary font-medium"
                >
                  {statuses.filter(s => s !== 'All').map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Celebration Specs Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-surface-container-low rounded border border-secondary/15">
                  <span className="text-[10px] uppercase text-on-surface-variant font-label-caps block">Destination</span>
                  <span className="font-semibold text-primary text-xs mt-0.5 block">{selectedEnquiry.destination}</span>
                </div>
                <div className="p-3 bg-surface-container-low rounded border border-secondary/15">
                  <span className="text-[10px] uppercase text-on-surface-variant font-label-caps block">Wedding Date</span>
                  <span className="font-semibold text-primary text-xs mt-0.5 block">{selectedEnquiry.wedding_date}</span>
                </div>
                <div className="p-3 bg-surface-container-low rounded border border-secondary/15">
                  <span className="text-[10px] uppercase text-on-surface-variant font-label-caps block">Expected Guests</span>
                  <span className="font-semibold text-primary text-xs mt-0.5 block">{selectedEnquiry.expected_guests} Guests</span>
                </div>
                <div className="p-3 bg-surface-container-low rounded border border-secondary/15">
                  <span className="text-[10px] uppercase text-on-surface-variant font-label-caps block">Estimated Budget</span>
                  <span className="font-semibold text-primary text-xs mt-0.5 block font-tabular-nums">
                    ₹{(selectedEnquiry.estimated_budget / 10000000).toFixed(2)} Cr
                  </span>
                </div>
              </div>

              {/* Theme & Additional Requirements */}
              <div className="space-y-3">
                <div className="p-3 bg-surface-container-low rounded border border-secondary/15">
                  <span className="text-[10px] uppercase text-secondary font-label-caps font-semibold block">
                    Preferred Theme &amp; Moodboard
                  </span>
                  <p className="mt-1 text-on-surface text-xs leading-relaxed">
                    {selectedEnquiry.preferred_theme || 'Traditional Royal Grandeur'}
                  </p>
                </div>

                <div className="p-3 bg-surface-container-low rounded border border-secondary/15">
                  <span className="text-[10px] uppercase text-secondary font-label-caps font-semibold block">
                    Special Inclusions &amp; Requirements
                  </span>
                  <p className="mt-1 text-on-surface text-xs leading-relaxed">
                    {selectedEnquiry.additional_requirements || 'Standard high-touch hospitality.'}
                  </p>
                </div>
              </div>

              {/* Call Notes History */}
              <div className="space-y-3">
                <h4 className="font-label-caps uppercase text-[10px] text-secondary font-semibold">
                  Consultation Call Notes ({selectedEnquiry.notes?.length || 0})
                </h4>

                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {selectedEnquiry.notes && selectedEnquiry.notes.length > 0 ? (
                    selectedEnquiry.notes.map((n, idx) => (
                      <div key={idx} className="p-2.5 bg-surface-container-low border border-secondary/15 rounded text-xs space-y-0.5">
                        <div className="flex justify-between text-[10px] text-on-surface-variant">
                          <span className="font-semibold text-primary">{n.author}</span>
                          <span className="font-tabular-nums">{n.date}</span>
                        </div>
                        <p className="text-on-surface">{n.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-on-surface-variant italic">No call notes recorded yet.</p>
                  )}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Record conversation outcome or next action..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 p-2 bg-surface-container-low border border-secondary/20 text-xs focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-secondary text-primary font-label-caps uppercase text-[10px] hover:bg-secondary-fixed transition-colors font-semibold"
                  >
                    Add Note
                  </button>
                </form>
              </div>
            </div>

            {/* Drawer Footer with Conversion Action */}
            <div className="p-6 border-t border-secondary/20 bg-surface-container-low/50 flex items-center justify-between">
              {selectedEnquiry.converted_wedding_id ? (
                <div className="flex items-center gap-2 text-secondary text-xs font-semibold">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Active Project: {selectedEnquiry.converted_wedding_id}</span>
                </div>
              ) : (
                <div className="text-xs text-on-surface-variant">
                  <span>Reuses all client details &amp; auto-creates 27 tasks.</span>
                </div>
              )}

              {selectedEnquiry.converted_wedding_id ? (
                <button
                  onClick={() => {
                    navigate('/workspace/weddings');
                  }}
                  className="px-5 py-2.5 bg-primary text-surface font-label-caps uppercase text-xs hover:bg-secondary-dark transition-colors shadow-sm"
                >
                  Open Wedding Workspace →
                </button>
              ) : (
                <button
                  onClick={() => handleConvertToWedding(selectedEnquiry.id)}
                  className="px-5 py-2.5 bg-primary text-surface font-label-caps uppercase text-xs hover:bg-secondary-dark transition-colors shadow-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary">auto_awesome</span>
                  <span>Convert to Wedding Project</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
