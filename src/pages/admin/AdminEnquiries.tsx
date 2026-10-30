import React, { useState, useEffect } from 'react';
import { getEnquiries, updateEnquiryStatus, deleteEnquiry } from '../../lib/data-service';
import { Enquiry, EnquiryStatus } from '../../lib/types';
import { useAuth } from '../../lib/auth-context';

export const AdminEnquiries: React.FC = () => {
  const { isOwner, isAdmin } = useAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | EnquiryStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Editing state for detail sidebar
  const [activeStatus, setActiveStatus] = useState<EnquiryStatus>('new');
  const [assignedTo, setAssignedTo] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadAllEnquiries = async () => {
    try {
      const data = await getEnquiries();
      setEnquiries(data);
      if (selectedEnquiry) {
        const updated = data.find((e) => e.id === selectedEnquiry.id);
        if (updated) setSelectedEnquiry(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllEnquiries();
  }, []);

  const openEnquiryModal = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setActiveStatus(enq.status);
    setAssignedTo(enq.assignedTo || '');
    setInternalNotes(enq.internalNotes || '');
    setFollowUpDate(enq.followUpDate || '');
    setSaveSuccess(false);
  };

  const handleUpdate = async () => {
    if (!selectedEnquiry) return;
    setSavingNote(true);
    setSaveSuccess(false);

    try {
      await updateEnquiryStatus(selectedEnquiry.id, {
        status: activeStatus,
        assignedTo,
        internalNotes,
        followUpDate,
      });

      setSaveSuccess(true);
      await loadAllEnquiries();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Failed to update enquiry: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSavingNote(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this enquiry? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteEnquiry(id);
      setSelectedEnquiry(null);
      await loadAllEnquiries();
    } catch (err) {
      alert('Delete error: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (enquiries.length === 0) {
      alert('No enquiries to export.');
      return;
    }

    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Program/Service', 'Status', 'Assigned To', 'Follow Up', 'Created At'];
    const rows = enquiries.map((e) => [
      e.id,
      `"${e.fullName.replace(/"/g, '""')}"`,
      `"${e.email}"`,
      `"${e.phone}"`,
      `"${(e.programOrService || '').replace(/"/g, '""')}"`,
      e.status,
      `"${(e.assignedTo || '').replace(/"/g, '""')}"`,
      `"${e.followUpDate || ''}"`,
      `"${e.createdAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `navioraa_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = enquiries.filter((e) => {
    if (statusFilter !== 'all' && e.status !== statusFilter) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        e.fullName.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.phone.toLowerCase().includes(q) ||
        (e.programOrService && e.programOrService.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white">
            Admissions & Student Enquiry CRM
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time candidate applications, counselor assignment, status pipelines, and private counseling notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="h-9 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[17px]">download</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#131926] p-4 rounded-2xl border border-slate-800/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {(['all', 'new', 'in_progress', 'contacted', 'resolved', 'spam'] as const).map((st) => {
            const count = st === 'all' ? enquiries.length : enquiries.filter((e) => e.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  statusFilter === st
                    ? 'bg-[#0052FF] text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{st.replace('_', ' ')}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${statusFilter === st ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0052FF]"
          />
        </div>
      </div>

      {/* Enquiries Grid / Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enquiries List */}
        <div className="lg:col-span-2 bg-[#131926] rounded-2xl border border-slate-800/80 shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400 font-mono">Loading inbox telemetry...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 space-y-2">
              <span className="material-symbols-outlined text-[36px] text-slate-600">inbox</span>
              <p className="font-bold text-white">No enquiries found in this view.</p>
              <p>Try switching filter tabs or clearing your search term.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {filtered.map((enq) => {
                const isSelected = selectedEnquiry?.id === enq.id;
                return (
                  <div
                    key={enq.id}
                    onClick={() => openEnquiryModal(enq)}
                    className={`p-4 sm:p-5 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected ? 'bg-slate-900/90 border-l-4 border-[#00E5FF]' : 'hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-white">{enq.fullName}</span>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            enq.status === 'new'
                              ? 'bg-red-500/20 text-red-400 border-red-500/30 font-extrabold'
                              : enq.status === 'in_progress'
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              : enq.status === 'contacted'
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                              : enq.status === 'resolved'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {enq.status ? enq.status.replace('_', ' ') : 'new'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#00E5FF] truncate">{enq.programOrService}</p>
                      <p className="text-xs text-slate-400 line-clamp-1">{enq.message}</p>
                    </div>

                    <div className="flex sm:flex-col sm:items-end justify-between text-[11px] text-slate-500 flex-shrink-0 font-mono">
                      <span>{new Date(enq.createdAt).toLocaleDateString()}</span>
                      {enq.assignedTo && (
                        <span className="text-slate-300 font-medium">Assigned: {enq.assignedTo}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="bg-[#131926] rounded-2xl border border-slate-800/80 shadow-md p-5 sm:p-6 flex flex-col justify-between h-fit sticky top-24 space-y-5">
          {selectedEnquiry ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h2 className="font-heading font-bold text-base text-white">Enquiry Details</h2>
                <button
                  onClick={() => handleDelete(selectedEnquiry.id)}
                  className="text-red-400 hover:text-red-300 text-xs font-semibold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>Delete</span>
                </button>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-medium rounded-xl">
                  Enquiry status and internal notes updated!
                </div>
              )}

              {/* Applicant Info */}
              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Full Name</span>
                  <span className="font-bold text-white text-sm">{selectedEnquiry.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Email</span>
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-[#00E5FF] font-medium hover:underline">
                    {selectedEnquiry.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Phone / WhatsApp</span>
                  <a href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-medium hover:underline">
                    {selectedEnquiry.phone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Program Requested</span>
                  <span className="font-semibold text-white">{selectedEnquiry.programOrService}</span>
                </div>
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px] font-bold uppercase mb-1">Applicant Message</span>
                  <p className="text-slate-300 leading-relaxed text-xs">{selectedEnquiry.message}</p>
                </div>
              </div>

              {/* CRM Update Controls */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#00E5FF]">
                  Admissions Workflow & Notes
                </h3>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Status Pipeline</label>
                  <select
                    value={activeStatus}
                    onChange={(e) => setActiveStatus(e.target.value as EnquiryStatus)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-white focus:outline-none focus:border-[#0052FF]"
                  >
                    <option value="new">New / Uncontacted</option>
                    <option value="in_progress">In Progress</option>
                    <option value="contacted">Contacted by Phone/WhatsApp</option>
                    <option value="resolved">Enrolled / Resolved</option>
                    <option value="spam">Spam / Junk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Assign Counselor</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white focus:outline-none focus:border-[#0052FF]"
                  >
                    <option value="">Unassigned</option>
                    <option value="Admissions Counselor">Admissions Counseling Desk</option>
                    <option value="Academic Curriculum Lead">Academic Curriculum Lead</option>
                    <option value="Technical Project Lead">Technical & Project Engineering Lead</option>
                    <option value="Student Operations">Student Operations Desk</option>
                    <option value="Executive Advisory">Executive Advisory Office</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Follow-Up Target Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white focus:outline-none focus:border-[#0052FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Internal Counselor Notes (Private)
                  </label>
                  <textarea
                    rows={3}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Enter confidential notes, student preferences, call summary..."
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0052FF] resize-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Internal notes are strictly protected by ABAC rules and never exposed to the public site.
                  </p>
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={savingNote}
                  className="w-full h-10 rounded-xl bg-[#0052FF] hover:bg-[#0040CC] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-[#0052FF]/20 active:scale-98 transition-all disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>{savingNote ? 'Saving...' : 'Update CRM Record'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-slate-500 font-mono">
              Select an enquiry from the list to view full applicant background, assign a counselor, or record internal notes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
