import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

export default function EventManagement() {
  const {
    weddings,
    selectedWeddingId,
    setSelectedWeddingId,
    selectedWedding,
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    vendorArrivals,
    updateArrivalStatus
  } = useData();

  const [searchEvent, setSearchEvent] = useState('');
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' | 'vendor_arrivals'

  const [newEventData, setNewEventData] = useState({
    event_name: '',
    date: selectedWedding?.start_date || '2026-12-18',
    start_time: '18:00',
    end_time: '23:00',
    location: selectedWedding?.venue || 'City Palace Courtyard',
    dress_code: 'Royal Traditional / Formal Attire',
    description: ''
  });

  const weddingEvents = events.filter(e => e.wedding_id === selectedWeddingId);
  const weddingArrivals = vendorArrivals.filter(a => a.wedding_id === selectedWeddingId);

  const filteredEvents = weddingEvents.filter(e =>
    e.event_name.toLowerCase().includes(searchEvent.toLowerCase()) ||
    e.location.toLowerCase().includes(searchEvent.toLowerCase()) ||
    e.description.toLowerCase().includes(searchEvent.toLowerCase())
  );

  const [eventActionError, setEventActionError] = useState(null);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEventData.event_name.trim()) return;
    setEventActionError(null);
    try {
      await addEvent({
        ...newEventData,
        wedding_id: selectedWeddingId
      });
      setNewEventData({
        event_name: '',
        date: selectedWedding?.start_date || '2026-12-18',
        start_time: '18:00',
        end_time: '23:00',
        location: selectedWedding?.venue || 'City Palace Courtyard',
        dress_code: 'Royal Traditional / Formal Attire',
        description: ''
      });
      setShowAddEventModal(false);
    } catch (err) {
      setEventActionError(err.message);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;
    setEventActionError(null);
    try {
      await updateEvent(editingEvent.id, {
        event_name: editingEvent.event_name,
        date: editingEvent.date,
        start_time: editingEvent.start_time,
        end_time: editingEvent.end_time,
        location: editingEvent.location,
        dress_code: editingEvent.dress_code,
        description: editingEvent.description
      });
      setEditingEvent(null);
    } catch (err) {
      setEventActionError(err.message);
    }
  };

  const handleDeleteEvent = async (eventId, eventName) => {
    if (window.confirm(`Are you sure you want to delete the event "${eventName}"?`)) {
      setEventActionError(null);
      try {
        await deleteEvent(eventId);
      } catch (err) {
        setEventActionError(err.message);
      }
    }
  };

  const handleUpdateArrival = async (arrId, status) => {
    setEventActionError(null);
    try {
      await updateArrivalStatus(arrId, status);
    } catch (err) {
      setEventActionError(err.message);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-[1720px] mx-auto w-full font-inter text-[#241820]">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#B99A72]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#B99A72] font-semibold">
              Run of Show &amp; Itinerary
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B99A72]" />
            <span className="text-[11px] uppercase tracking-wider text-[#343A35]/70">
              {weddingEvents.length} Functions Scheduled
            </span>
          </div>
          <h1 className="text-3xl text-[#241820] font-bold tracking-tight mt-1">
            Event Management
          </h1>
          <p className="text-xs text-[#343A35]/80 max-w-2xl mt-0.5 leading-relaxed">
            Manage your wedding celebration schedule, ceremony timelines, dress codes, venue locations, and vendor arrival run-sheets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#FAF7F2] p-1 rounded-lg border border-[#B99A72]/20 text-xs">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'schedule' ? 'bg-white text-[#241820] font-semibold shadow-xs' : 'text-[#343A35]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              <span>Event Schedule</span>
            </button>
            <button
              onClick={() => setActiveTab('vendor_arrivals')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'vendor_arrivals' ? 'bg-white text-[#241820] font-semibold shadow-xs' : 'text-[#343A35]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">local_shipping</span>
              <span>Vendor Arrivals</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddEventModal(true)}
            className="px-4 py-2 bg-[#241820] text-[#F5EFE7] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#34242e] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* 2. Controls & Context Filter */}
      <div className="p-4 rounded-xl bg-white border border-[#B99A72]/25 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4 flex-1">
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

          <div className="relative flex-1 max-w-xs">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#343A35]/50 text-[16px]">search</span>
            <input
              type="text"
              placeholder="Search events, venues, descriptions..."
              value={searchEvent}
              onChange={(e) => setSearchEvent(e.target.value)}
              className="w-full h-8 pl-8 pr-3 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none focus:border-[#241820]"
            />
          </div>
        </div>

        <div className="text-[11px] text-[#343A35]/80 font-medium">
          Wedding Dates: <span className="font-semibold text-[#241820]">{selectedWedding?.dates}</span>
        </div>
      </div>

      {/* 3. Event Schedule Subtab */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((evt, idx) => (
              <div
                key={evt.id}
                className="p-5 bg-white rounded-xl border border-[#B99A72]/25 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 relative"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-[#FAF7F2] text-[#B99A72] border border-[#B99A72]/30">
                      Function #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingEvent(evt)}
                        className="p-1 text-[#343A35] hover:text-[#241820] rounded hover:bg-[#FAF7F2]"
                        title="Edit Event"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(evt.id, evt.event_name)}
                        className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                        title="Delete Event"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#241820] leading-snug">
                    {evt.event_name}
                  </h3>

                  <p className="text-xs text-[#343A35] leading-relaxed line-clamp-3">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#B99A72]/15 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[#343A35]">
                    <span className="flex items-center gap-1.5 text-[#B99A72]">
                      <span className="material-symbols-outlined text-[15px]">calendar_month</span>
                      <span>Date</span>
                    </span>
                    <span className="font-semibold text-[#241820]">{evt.date}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#343A35]">
                    <span className="flex items-center gap-1.5 text-[#B99A72]">
                      <span className="material-symbols-outlined text-[15px]">schedule</span>
                      <span>Time</span>
                    </span>
                    <span className="font-semibold text-[#241820]">{evt.start_time} – {evt.end_time}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#343A35]">
                    <span className="flex items-center gap-1.5 text-[#B99A72]">
                      <span className="material-symbols-outlined text-[15px]">location_on</span>
                      <span>Venue</span>
                    </span>
                    <span className="font-medium text-[#241820] truncate max-w-[160px] text-right">{evt.location}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#343A35]">
                    <span className="flex items-center gap-1.5 text-[#B99A72]">
                      <span className="material-symbols-outlined text-[15px]">checkroom</span>
                      <span>Dress Code</span>
                    </span>
                    <span className="font-medium text-[#241820] truncate max-w-[160px] text-right">{evt.dress_code}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Vendor Arrivals Subtab */}
      {activeTab === 'vendor_arrivals' && (
        <div className="bg-white rounded-xl border border-[#B99A72]/25 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#B99A72]/20 flex items-center justify-between bg-[#FAF7F2]/50">
            <div>
              <h3 className="text-sm font-bold text-[#241820]">Vendor Setup &amp; Delivery Timeline</h3>
              <p className="text-[11px] text-[#343A35]/70">Track vendor arrival and staging schedule at the venue.</p>
            </div>
            <span className="text-xs font-semibold text-[#B99A72]">{weddingArrivals.length} Arrivals Tracked</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAF7F2] text-[#343A35] h-10 border-b border-[#B99A72]/20">
                  <th className="px-4 py-2 uppercase tracking-wider font-semibold">Vendor Partner</th>
                  <th className="px-4 py-2 uppercase tracking-wider font-semibold">Category</th>
                  <th className="px-4 py-2 uppercase tracking-wider font-semibold">Target Time</th>
                  <th className="px-4 py-2 uppercase tracking-wider font-semibold">Actual Time</th>
                  <th className="px-4 py-2 uppercase tracking-wider font-semibold">Status</th>
                  <th className="px-4 py-2 uppercase tracking-wider font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B99A72]/15">
                {weddingArrivals.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-[#343A35]/60">
                      No vendor arrivals registered for this wedding project.
                    </td>
                  </tr>
                ) : (
                  weddingArrivals.map((arr) => (
                    <tr key={arr.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="px-4 py-3 font-semibold text-[#241820]">{arr.vendor_name}</td>
                      <td className="px-4 py-3 text-[#343A35]">{arr.category}</td>
                      <td className="px-4 py-3 font-semibold text-[#241820]">{arr.expected_arrival_time}</td>
                      <td className="px-4 py-3 text-[#343A35]">{arr.actual_arrival_time || '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            arr.arrival_status === 'Arrived'
                              ? 'bg-emerald-100 text-emerald-800'
                              : arr.arrival_status === 'Delayed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {arr.arrival_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {arr.arrival_status !== 'Arrived' ? (
                          <button
                            onClick={() => handleUpdateArrival(arr.id, 'Arrived')}
                            className="px-2.5 py-1 bg-[#241820] text-[#F5EFE7] rounded text-[10px] font-semibold uppercase hover:bg-[#34242e] transition-colors"
                          >
                            Mark Arrived
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">check_circle</span> Verified
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 bg-[#241820]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl border border-[#B99A72]/30 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#B99A72]/20 pb-3">
              <h3 className="text-base font-bold text-[#241820]">Add New Wedding Function</h3>
              <button
                onClick={() => setShowAddEventModal(false)}
                className="text-[#343A35] hover:text-[#241820] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                  Function Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Royal Sangeet Gala & Musical Night"
                  value={newEventData.event_name}
                  onChange={(e) => setNewEventData({ ...newEventData, event_name: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                    Event Date *
                  </label>
                  <input
                    required
                    type="date"
                    value={newEventData.date}
                    onChange={(e) => setNewEventData({ ...newEventData, date: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                    Start Time *
                  </label>
                  <input
                    required
                    type="time"
                    value={newEventData.start_time}
                    onChange={(e) => setNewEventData({ ...newEventData, start_time: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                    End Time *
                  </label>
                  <input
                    required
                    type="time"
                    value={newEventData.end_time}
                    onChange={(e) => setNewEventData({ ...newEventData, end_time: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                    Venue / Location *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Zenana Courtyard, City Palace"
                    value={newEventData.location}
                    onChange={(e) => setNewEventData({ ...newEventData, location: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                    Dress Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Heritage Velvet & Gold"
                    value={newEventData.dress_code}
                    onChange={(e) => setNewEventData({ ...newEventData, dress_code: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                  Description &amp; Highlights
                </label>
                <textarea
                  rows="3"
                  placeholder="Details about ceremony rituals, special performances, dinner service..."
                  value={newEventData.description}
                  onChange={(e) => setNewEventData({ ...newEventData, description: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#B99A72]/20 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 bg-[#FAF7F2] text-[#343A35] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#F5EFE7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#241820] text-[#F5EFE7] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#34242e]"
                >
                  Save Function
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-[#241820]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl border border-[#B99A72]/30 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#B99A72]/20 pb-3">
              <h3 className="text-base font-bold text-[#241820]">Edit Wedding Function</h3>
              <button
                onClick={() => setEditingEvent(null)}
                className="text-[#343A35] hover:text-[#241820] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                  Function Name *
                </label>
                <input
                  required
                  type="text"
                  value={editingEvent.event_name}
                  onChange={(e) => setEditingEvent({ ...editingEvent, event_name: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                    Event Date
                  </label>
                  <input
                    required
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                    Start Time
                  </label>
                  <input
                    required
                    type="time"
                    value={editingEvent.start_time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, start_time: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                    End Time
                  </label>
                  <input
                    required
                    type="time"
                    value={editingEvent.end_time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, end_time: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                    Venue / Location
                  </label>
                  <input
                    required
                    type="text"
                    value={editingEvent.location}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                    Dress Code
                  </label>
                  <input
                    type="text"
                    value={editingEvent.dress_code}
                    onChange={(e) => setEditingEvent({ ...editingEvent, dress_code: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#343A35] font-semibold block mb-1">
                  Description &amp; Highlights
                </label>
                <textarea
                  rows="3"
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#B99A72]/30 rounded-lg text-xs text-[#241820] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#B99A72]/20 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 bg-[#FAF7F2] text-[#343A35] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#F5EFE7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#241820] text-[#F5EFE7] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#34242e]"
                >
                  Update Function
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
