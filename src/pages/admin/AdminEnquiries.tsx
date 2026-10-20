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
      `"${e.assignedTo || ''}"`,
      `"${e.followUpDate || ''}"`,
      `"${new Date(e.createdAt).toLocaleString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `navioraa_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter
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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-on-surface">
            Admissions & Student Enquiry CRM
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Confidential student enquiries, counselor assignment, status pipelines, and private counseling notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="h-10 px-4 rounded-xl border border-border-medium bg-white hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-2xs text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-border-subtle shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
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
                    ? 'bg-primary text-white shadow-2xs'
                    : 'bg-surface-subtle text-on-surface-variant hover:bg-slate-100'
                }`}
              >
                <span>{st.replace('_', ' ')}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${statusFilter === st ? 'bg-white/20' : 'bg-slate-200'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-border-medium text-xs text-on-surface placeholder:text-slate-400 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Enquiries Grid / Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enquiries List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-border-subtle shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-xs text-text-muted">Loading inbox...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-text-muted space-y-2">
              <span className="material-symbols-outlined text-[36px] text-slate-300">inbox</span>
              <p className="font-bold text-on-surface">No enquiries found in this view.</p>
              <p>Try switching filter tabs or clearing your search term.</p>
            </div>
          ) : (
            <div className="divide-y divide-border-subtle">
              {filtered.map((enq) => {
                const isSelected = selectedEnquiry?.id === enq.id;
                return (
                  <div
                    key={enq.id}
                    onClick={() => openEnquiryModal(enq)}
                    className={`p-4 sm:p-5 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected ? 'bg-primary-light/40 border-l-4 border-primary' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-on-surface">{enq.fullName}</span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            enq.status === 'new'
                              ? 'bg-red-100 text-red-700 font-extrabold'
                              : enq.status === 'in_progress'
                              ? 'bg-amber-100 text-amber-800'
                              : enq.status === 'contacted'
                              ? 'bg-blue-100 text-blue-800'
                              : enq.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {enq.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-primary truncate">{enq.programOrService}</p>
                      <p className="text-xs text-text-muted line-clamp-1">{enq.message}</p>
                    </div>

                    <div className="flex sm:flex-col sm:items-end justify-between text-[11px] text-text-muted flex-shrink-0">
                      <span>{new Date(enq.createdAt).toLocaleDateString()}</span>
                      {enq.assignedTo && (
                        <span className="text-primary font-medium">Assigned: {enq.assignedTo}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="bg-white rounded-3xl border border-border-subtle shadow-2xs p-5 sm:p-6 flex flex-col justify-between h-fit sticky top-24 space-y-5">
          {selectedEnquiry ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <h2 className="font-heading font-bold text-base text-on-surface">Enquiry Details</h2>
                <button
                  onClick={() => handleDelete(selectedEnquiry.id)}
                  className="text-red-600 hover:text-red-800 text-xs font-semibold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>Delete</span>
                </button>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl">
                  Enquiry status and internal notes updated!
                </div>
              )}

              {/* Applicant Info */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-text-muted block text-[11px]">Full Name</span>
                  <span className="font-bold text-on-surface text-sm">{selectedEnquiry.fullName}</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[11px]">Email</span>
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-primary font-medium hover:underline">
                    {selectedEnquiry.email}
                  </a>
                </div>
                <div>
                  <span className="text-text-muted block text-[11px]">Phone / WhatsApp</span>
                  <a href={`tel:${selectedEnquiry.phone}`} className="text-primary font-medium hover:underline">
                    {selectedEnquiry.phone}
                  </a>
                </div>
                <div>
                  <span className="text-text-muted block text-[11px]">Program Requested</span>
                  <span className="font-semibold text-on-surface">{selectedEnquiry.programOrService}</span>
                </div>
                <div className="p-3 bg-surface-subtle rounded-xl border border-border-subtle">
                  <span className="text-text-muted block text-[10px] font-bold uppercase mb-1">Applicant Message</span>
                  <p className="text-on-surface leading-relaxed text-xs">{selectedEnquiry.message}</p>
                </div>
              </div>

              {/* CRM Update Controls */}
              <div className="pt-3 border-t border-border-subtle space-y-3">
                <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-primary">
                  Admissions Workflow & Notes
                </h3>

                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">Status Pipeline</label>
                  <select
                    value={activeStatus}
                    onChange={(e) => setActiveStatus(e.target.value as EnquiryStatus)}
                    className="w-full h-10 px-3 rounded-xl border border-border-medium bg-white text-xs font-semibold text-on-surface"
                  >
                    <option value="new">New / Uncontacted</option>
                    <option value="in_progress">In Progress</option>
                    <option value="contacted">Contacted by Phone/WhatsApp</option>
                    <option value="resolved">Enrolled / Resolved</option>
                    <option value="spam">Spam / Junk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">Assign Counselor</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-border-medium bg-white text-xs text-on-surface"
                  >
                    <option value="">Unassigned</option>
                    <option value="Disha (Admissions Lead)">Disha (Marketing & Admissions Lead)</option>
                    <option value="Sandip (Training Head)">Sandip (Head of Training)</option>
                    <option value="Sakshi (Tech Lead)">Sakshi (Technical & Project Lead)</option>
                    <option value="Chaitanya (Operations)">Chaitanya (Operations Lead)</option>
                    <option value="Shubham (Founder)">Shubham (Founder & CEO)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">Follow-Up Target Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-border-medium bg-white text-xs text-on-surface"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-on-surface mb-1">
                    Internal Counselor Notes (Private)
                  </label>
                  <textarea
                    rows={3}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Enter confidential notes, student preferences, call summary..."
                    className="w-full p-2.5 rounded-xl border border-border-medium bg-white text-xs text-on-surface placeholder:text-slate-400 focus:outline-none focus:border-primary resize-none"
                  />
                  <p className="text-[10px] text-text-muted mt-0.5">
                    Internal notes are strictly protected by ABAC rules and never exposed to the public site.
                  </p>
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={savingNote}
                  className="w-full h-10 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-all disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>{savingNote ? 'Saving...' : 'Update CRM Record'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-text-muted">
              Select an enquiry from the list to view full applicant background, assign a counselor, or record internal notes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
