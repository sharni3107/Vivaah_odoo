import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

export default function TasksCalendar() {
  const { tasks, weddings, selectedWeddingId, setSelectedWeddingId, createTask, updateTaskStatus } = useData();

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban', 'list', 'calendar'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    category: 'Decoration',
    assigned_member: 'Priya Sharma',
    due_date: new Date().toISOString().split('T')[0],
    priority: 'Medium',
    status: 'To Plan',
    notes: ''
  });

  const categories = [
    'All',
    'Initial Planning',
    'Venue',
    'Decoration',
    'Catering',
    'Photography',
    'Mehendi',
    'Sangeet',
    'Wedding Ceremony',
    'Reception',
    'Guest Coordination',
    'Final Reconciliation'
  ];

  const statuses = ['To Plan', 'In Progress', 'Review', 'Done'];

  const filteredTasks = tasks.filter((t) => {
    const matchesWedding = !selectedWeddingId || t.wedding_id === selectedWeddingId;
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.assigned_member.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesWedding && matchesCategory && matchesSearch;
  });

  const handleCreateTask = (e) => {
    e.preventDefault();
    createTask({
      ...newTask,
      wedding_id: selectedWeddingId
    });
    setNewTask({
      title: '',
      category: 'Decoration',
      assigned_member: 'Priya Sharma',
      due_date: new Date().toISOString().split('T')[0],
      priority: 'Medium',
      status: 'To Plan',
      notes: ''
    });
    setShowAddModal(false);
  };

  return (
    <div className="p-8 space-y-8 max-w-[1720px] mx-auto w-full">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-secondary/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary font-semibold">
              Logistical Blueprint &amp; Run-Sheets
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant font-tabular-nums">
              {filteredTasks.length} Active Work Streams
            </span>
          </div>
          <h1 className="font-headline-lg text-3xl text-primary font-serif tracking-tight mt-1">
            Planning Tasks &amp; Timeline Calendar
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant max-w-2xl mt-0.5">
            Phase-by-phase execution from initial spatial 3D mandap renders to day-of wedding ceremony cueing and post-event audit.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface-container-low p-1 rounded border border-secondary/20 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 rounded transition-colors flex items-center gap-1 ${
                viewMode === 'kanban' ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">view_kanban</span>
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded transition-colors flex items-center gap-1 ${
                viewMode === 'list' ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">table_rows</span>
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded transition-colors flex items-center gap-1 ${
                viewMode === 'calendar' ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              <span>Calendar</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary-container text-on-primary font-title-md text-xs rounded shadow-sm hover:bg-secondary-dark transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Create New Task</span>
          </button>
        </div>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div className="p-4 rounded-lg bg-surface-container-lowest border border-secondary/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4 flex-1">
          {/* Wedding Selector */}
          <div className="flex items-center gap-2">
            <span className="font-label-caps uppercase text-[10px] text-secondary font-semibold">Wedding:</span>
            <select
              value={selectedWeddingId}
              onChange={(e) => setSelectedWeddingId(e.target.value)}
              className="p-1.5 bg-surface-container-low border border-secondary/20 font-medium text-xs text-primary"
            >
              {weddings.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.couple_names}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <span className="material-symbols-outlined absolute left-2.5 text-on-surface-variant text-[14px]">search</span>
            <input
              type="text"
              placeholder="Search tasks or assignees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 bg-surface-container-low border border-secondary/20 rounded text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto">
          <span className="font-label-caps uppercase text-[10px] text-secondary font-semibold mr-1">Phase:</span>
          {categories.slice(0, 6).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded whitespace-nowrap text-[11px] ${
                categoryFilter === cat
                  ? 'bg-primary text-surface font-semibold'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. VIEW 1: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {statuses.map((status) => {
            const columnTasks = filteredTasks.filter(t => t.status === status);
            return (
              <div key={status} className="bg-surface-container-low/70 p-4 rounded-lg border border-secondary/20 flex flex-col space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-secondary/20">
                  <div className="flex items-center gap-2">
                    <span className="font-title-md font-semibold text-primary text-xs uppercase tracking-wider font-serif">
                      {status}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-surface-container-highest text-on-surface-variant font-tabular-nums">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[640px] pr-1">
                  {columnTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3.5 bg-surface-container-lowest rounded border border-secondary/20 shadow-sm space-y-2 hover:shadow-md transition-shadow text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase ${
                          t.priority === 'Urgent'
                            ? 'bg-error-container text-on-error-container'
                            : t.priority === 'High'
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}>
                          {t.priority}
                        </span>
                        <span className="text-[10px] text-on-surface-variant font-tabular-nums">{t.due_date}</span>
                      </div>

                      <h4 className="font-semibold text-primary text-xs leading-snug">{t.title}</h4>
                      <p className="text-[11px] text-on-surface-variant line-clamp-2">{t.notes || t.category}</p>

                      <div className="pt-2 border-t border-secondary/15 flex items-center justify-between text-[10px]">
                        <span className="text-secondary font-medium">{t.assigned_member}</span>
                        <select
                          value={t.status}
                          onChange={(e) => updateTaskStatus(t.id, e.target.value)}
                          className="bg-surface-container-low p-0.5 border border-secondary/20 rounded text-[10px]"
                        >
                          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. VIEW 2: LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-surface-container-lowest rounded-lg border border-secondary/20 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant h-9 border-b border-secondary/15">
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Deliverable Title</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Category Phase</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Assigned Architect</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Due Date</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Priority</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold">Status</th>
                  <th className="px-4 py-2 font-label-sm uppercase font-semibold text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-surface-container-low/50">
                    <td className="px-4 py-3 font-medium text-primary">
                      {t.title}
                      {t.notes && <span className="block text-[11px] text-on-surface-variant font-normal">{t.notes}</span>}
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">{t.category}</td>
                    <td className="px-4 py-3 text-on-surface">{t.assigned_member}</td>
                    <td className="px-4 py-3 font-tabular-nums text-on-surface">{t.due_date}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        t.priority === 'Urgent' ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={t.status}
                        onChange={(e) => updateTaskStatus(t.id, e.target.value)}
                        className="bg-surface-container-low p-1 border border-secondary/20 rounded text-xs font-medium"
                      >
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {t.status !== 'Done' ? (
                        <button
                          onClick={() => updateTaskStatus(t.id, 'Done')}
                          className="px-2 py-1 bg-surface-container-high hover:bg-secondary text-primary rounded text-[10px] font-semibold transition-colors"
                        >
                          Mark Done ✓
                        </button>
                      ) : (
                        <span className="text-secondary font-semibold text-[11px]">✓ Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. VIEW 3: SIMPLE CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="bg-surface-container-lowest p-6 rounded-lg border border-secondary/20 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-secondary/15">
            <h3 className="font-headline-sm text-lg text-primary font-serif">December 2026 — Execution Horizon</h3>
            <span className="text-xs text-on-surface-variant font-tabular-nums">Aarav &amp; Meera Wedding Month</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="p-2 font-label-caps uppercase text-secondary font-semibold bg-surface-container-low">
                {day}
              </div>
            ))}

            {/* Render 31 day slots */}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const dayStr = day < 10 ? `0${day}` : `${day}`;
              const dayDate = `2026-12-${dayStr}`;
              const dayTasks = tasks.filter(t => t.due_date === dayDate);
              const isWeddingDay = day >= 18 && day <= 20;

              return (
                <div
                  key={day}
                  className={`min-h-[90px] p-2 text-left border rounded transition-colors ${
                    isWeddingDay
                      ? 'bg-secondary-container/20 border-secondary ring-1 ring-secondary'
                      : 'bg-surface-container-lowest border-secondary/15 hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-tabular-nums font-bold text-xs ${isWeddingDay ? 'text-secondary' : 'text-primary'}`}>
                      {day}
                    </span>
                    {isWeddingDay && (
                      <span className="text-[9px] font-label-caps uppercase text-secondary font-bold">Royal Gala</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayTasks.slice(0, 2).map(dt => (
                      <div key={dt.id} className="p-1 rounded bg-surface-container text-[10px] truncate text-primary font-medium" title={dt.title}>
                        • {dt.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <span className="text-[9px] text-secondary font-medium">+{dayTasks.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg p-6 shadow-2xl border border-secondary/30 space-y-4">
            <div className="flex items-center justify-between border-b border-secondary/20 pb-3">
              <h3 className="font-headline-sm text-lg text-primary font-serif">Create Planning Task</h3>
              <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-primary text-xl">✕</button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-label-caps uppercase text-secondary font-semibold">Task Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Confirm 45 Mercedes S-Class airport transfer fleet"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full p-2.5 bg-surface-container-low border border-secondary/20 focus:outline-none focus:border-primary text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-label-caps uppercase text-secondary font-semibold">Category Phase</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="w-full p-2 bg-surface-container-low border border-secondary/20 text-xs"
                  >
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-label-caps uppercase text-secondary font-semibold">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full p-2 bg-surface-container-low border border-secondary/20 text-xs"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-label-caps uppercase text-secondary font-semibold">Due Date</label>
                  <input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    className="w-full p-2 bg-surface-container-low border border-secondary/20 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-label-caps uppercase text-secondary font-semibold">Assigned Architect</label>
                  <input
                    type="text"
                    value={newTask.assigned_member}
                    onChange={(e) => setNewTask({ ...newTask, assigned_member: e.target.value })}
                    className="w-full p-2 bg-surface-container-low border border-secondary/20 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-label-caps uppercase text-secondary font-semibold">Technical Notes &amp; Specifications</label>
                <textarea
                  rows={2}
                  value={newTask.notes}
                  onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                  placeholder="Specific vendor deliverables, rider constraints..."
                  className="w-full p-2 bg-surface-container-low border border-secondary/20 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-secondary/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-surface-container text-on-surface-variant font-label-caps uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-surface font-label-caps uppercase text-xs hover:bg-secondary-dark shadow-sm"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
