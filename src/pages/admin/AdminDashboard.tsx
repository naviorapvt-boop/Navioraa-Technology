import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getEnquiries,
  getCourses,
  getProjects,
  getServices,
  getTeamMembers,
  getResources,
  updateEnquiryStatus,
  deleteEnquiry,
} from '../../lib/data-service';
import { Enquiry, Course, ProjectItem, ServiceItem, TeamMember, ResourceItem } from '../../lib/types';
import { useAuth } from '../../lib/auth-context';

export const AdminDashboard: React.FC = () => {
  const { adminProfile, currentUser, role, logout } = useAuth();
  const navigate = useNavigate();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'contacted' | 'resolved'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadAllData = async () => {
    try {
      const [enq, crs, prj, srv, tm, res] = await Promise.all([
        getEnquiries(),
        getCourses(false),
        getProjects(false),
        getServices(false),
        getTeamMembers(false),
        getResources(false),
      ]);
      setEnquiries(enq);
      setCourses(crs);
      setProjects(prj);
      setServices(srv);
      setTeam(tm);
      setResources(res);
    } catch (err) {
      console.warn('Dashboard data fetch notice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleStatusChange = async (enquiryId: string, newStatus: Enquiry['status']) => {
    setUpdatingId(enquiryId);
    try {
      await updateEnquiryStatus(enquiryId, { status: newStatus });
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
      );
    } catch (err) {
      alert('Failed to update enquiry: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteEnquiry = async (enquiryId: string, fullName: string) => {
    if (!window.confirm(`Delete enquiry from "${fullName}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteEnquiry(enquiryId);
      setEnquiries((prev) => prev.filter((e) => e.id !== enquiryId));
    } catch (err) {
      alert('Failed to delete enquiry: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleExportCSV = () => {
    if (enquiries.length === 0) {
      alert('No inquiries available to export.');
      return;
    }

    const headers = ['Enquiry ID', 'Full Name', 'Email', 'Phone', 'Program / Service', 'Message', 'Status', 'Date Submitted'];
    const rows = enquiries.map((e) => [
      `"${e.id}"`,
      `"${(e.fullName || '').replace(/"/g, '""')}"`,
      `"${(e.email || '').replace(/"/g, '""')}"`,
      `"${(e.phone || '').replace(/"/g, '""')}"`,
      `"${(e.programOrService || '').replace(/"/g, '""')}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`,
      `"${e.status || 'new'}"`,
      `"${e.createdAt || ''}"`,
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

  // Calculations for Metrics (matches image_5644d796.png)
  const publishedServices = services.filter((s) => s.published).length;
  const draftServices = services.filter((s) => !s.published).length;

  const publishedCourses = courses.filter((c) => c.published).length;
  const draftCourses = courses.filter((c) => !c.published).length;

  const newUnresolvedCount = enquiries.filter((e) => e.status === 'new' || !e.status).length;
  const inProgressCount = enquiries.filter((e) => e.status === 'in_progress' || e.status === 'contacted').length;
  const resolvedCount = enquiries.filter((e) => e.status === 'resolved').length;

  // Category aggregations for the "Inquiry report" card
  const categoryCounts: Record<string, number> = {};
  enquiries.forEach((e) => {
    const cat = e.programOrService?.trim() || 'General Admissions';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  const filteredEnquiries = enquiries.filter((e) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'new') return e.status === 'new' || !e.status;
    return e.status === statusFilter;
  });

  const initials = adminProfile?.displayName
    ? adminProfile.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : currentUser?.email?.slice(0, 2).toUpperCase() || 'NA';

  return (
    <div className="space-y-6">
      {/* 1. Subheader: Administrator Workspace / Content management (matches image_5644d796.png) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-widest font-mono">
            <span>ADMINISTRATOR WORKSPACE</span>
            <span>/</span>
            <div className="flex items-center gap-1.5 text-[#00E5FF] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] animate-pulse" />
              <span>Content management</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {enquiries.length} inquiries received
          </p>
        </div>

        {/* User Pill & Logout (matches image_5644d796.png) */}
        <div className="flex items-center gap-3 bg-[#131926] p-1.5 pl-3 rounded-2xl border border-slate-800 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-[#0052FF]/20 text-[#00E5FF] border border-[#0052FF]/40 flex items-center justify-center font-bold text-xs relative">
            {initials}
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] absolute bottom-0 right-0 border-2 border-[#131926]" />
          </div>

          <div className="text-left pr-2">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-white truncate max-w-[140px]">
                {adminProfile?.displayName || 'NAVIORA PVT'}
              </span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-[#0052FF]/30 text-[#00E5FF] tracking-wider border border-[#0052FF]/40">
                {role === 'owner' ? 'SUPER ADMIN' : 'ADMIN'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[160px]">
              {currentUser?.email || 'shubhammahadik3228@gmail.com'}
            </span>
          </div>

          <button
            onClick={() => logout()}
            className="h-8 px-3 rounded-xl bg-slate-800 hover:bg-red-950/50 text-slate-300 hover:text-red-400 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            title="Sign out of Admin CMS"
          >
            <span className="material-symbols-outlined text-[15px]">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Navigation Tabs (matches image_d4e6f5a6.png) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <Link
          to="/admin/services"
          className="px-3.5 py-2 rounded-xl bg-[#131926] hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-2 whitespace-nowrap transition-colors"
        >
          <span className="material-symbols-outlined text-[16px] text-slate-400">dns</span>
          <span>IT Services</span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
            {services.length}
          </span>
        </Link>

        <Link
          to="/admin/projects"
          className="px-3.5 py-2 rounded-xl bg-[#131926] hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-2 whitespace-nowrap transition-colors"
        >
          <span className="material-symbols-outlined text-[16px] text-slate-400">rocket_launch</span>
          <span>Showcase Projects</span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
            {projects.length}
          </span>
        </Link>

        <Link
          to="/admin/resources"
          className="px-3.5 py-2 rounded-xl bg-[#131926] hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-2 whitespace-nowrap transition-colors"
        >
          <span className="material-symbols-outlined text-[16px] text-slate-400">menu_book</span>
          <span>Learning Docs</span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
            {resources.length}
          </span>
        </Link>

        <Link
          to="/admin/team"
          className="px-3.5 py-2 rounded-xl bg-[#131926] hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-2 whitespace-nowrap transition-colors"
        >
          <span className="material-symbols-outlined text-[16px] text-slate-400">groups</span>
          <span>Team Faculty</span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
            {team.length}
          </span>
        </Link>

        {/* Active Tab: Recent Inquiries */}
        <Link
          to="/admin/enquiries"
          className="px-3.5 py-2 rounded-xl bg-[#131926] border border-[#00E5FF]/40 text-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.15)] flex items-center gap-2 whitespace-nowrap font-bold"
        >
          <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
          <span>Recent Inquiries</span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/40">
            {newUnresolvedCount}
          </span>
        </Link>
      </div>

      {/* 3. The 4 KPI Metric Cards (matches image_5644d796.png) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Services */}
        <div className="bg-[#131926] rounded-2xl p-5 border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-mono tracking-wider mb-2">
            <span>MODULAR FLEET</span>
            <div className="w-8 h-8 rounded-lg bg-slate-800/80 text-[#00E5FF] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">sync_alt</span>
            </div>
          </div>
          <h3 className="font-heading font-extrabold text-base text-white">Active Services</h3>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-extrabold text-white font-mono">{publishedServices}</span>
            <span className="text-xs text-[#00E5FF] font-semibold">Published</span>
            <span className="ml-auto text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              {draftServices} Drafts
            </span>
          </div>
          {/* Blue bottom indicator line */}
          <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-[#0052FF] rounded-full w-4/5" />
          </div>
        </div>

        {/* Card 2: Training Courses */}
        <div className="bg-[#131926] rounded-2xl p-5 border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-mono tracking-wider mb-2">
            <span>ACADEMY LMS</span>
            <div className="w-8 h-8 rounded-lg bg-slate-800/80 text-[#00E5FF] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
            </div>
          </div>
          <h3 className="font-heading font-extrabold text-base text-white">Training Courses</h3>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-extrabold text-white font-mono">{publishedCourses}</span>
            <span className="text-xs text-[#00E5FF] font-semibold">Published</span>
            <span className="ml-auto text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              {draftCourses} Drafts
            </span>
          </div>
          {/* Cyan bottom indicator line */}
          <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#0052FF] to-[#00E5FF] rounded-full w-[90%]" />
          </div>
        </div>

        {/* Card 3: Portfolio Projects */}
        <div className="bg-[#131926] rounded-2xl p-5 border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-mono tracking-wider mb-2">
            <span>CLIENT WORK</span>
            <div className="w-8 h-8 rounded-lg bg-slate-800/80 text-[#2DD4BF] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
            </div>
          </div>
          <h3 className="font-heading font-extrabold text-base text-white">Portfolio Projects</h3>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-extrabold text-white font-mono">{projects.length}</span>
            <span className="text-xs text-[#2DD4BF] font-semibold">Live Showcases</span>
            <span className="ml-auto text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-[#2DD4BF] flex items-center gap-0.5">
              <span>↑ 100% Active</span>
            </span>
          </div>
          {/* Teal bottom indicator line */}
          <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-[#2DD4BF] rounded-full w-full" />
          </div>
        </div>

        {/* Card 4: Client Inquiries */}
        <div className="bg-[#131926] rounded-2xl p-5 border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-mono tracking-wider mb-2">
            <span>INBOUND QUEUE</span>
            <div className="w-8 h-8 rounded-lg bg-slate-800/80 text-red-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">mark_email_unread</span>
            </div>
          </div>
          <h3 className="font-heading font-extrabold text-base text-white">Client Inquiries</h3>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-extrabold text-white font-mono">{newUnresolvedCount}</span>
            <span className="text-xs text-red-400 font-semibold">New Unresolved</span>
            <span className="ml-auto text-[11px] font-mono px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/50">
              Needs Review
            </span>
          </div>
          {/* Violet gradient bottom indicator line */}
          <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 via-purple-500 to-[#0052FF] rounded-full w-3/4" />
          </div>
        </div>
      </div>

      {/* 4. Inquiry Report Section (matches image_5644d796.png) */}
      <div className="bg-[#131926] rounded-2xl p-6 border border-slate-800/80 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="font-heading font-extrabold text-lg text-white">Inquiry report</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Submission volume, follow-up status, and client interest by category.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {enquiries.length} received in the last 30 days
          </span>
        </div>

        {/* 4 Statistical Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          <div>
            <p className="text-3xl font-extrabold text-white font-mono leading-none">
              {enquiries.length}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">All inquiries</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-[#00E5FF] font-mono leading-none">
              {newUnresolvedCount}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">New</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-amber-400 font-mono leading-none">
              {inProgressCount}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">In progress</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-emerald-400 font-mono leading-none">
              {resolvedCount}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Resolved</p>
          </div>
        </div>

        {/* Category Breakdown Progress Bars (matches image_5644d796.png) */}
        {sortedCategories.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-slate-800/80">
            {sortedCategories.slice(0, 4).map(([catName, count]) => {
              const pct = Math.max(15, Math.round((count / Math.max(1, enquiries.length)) * 100));
              return (
                <div key={catName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{catName}</span>
                    <span className="font-mono text-slate-400 font-bold">{count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00E5FF] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Inquiries Queue & Live Telemetry Stream (matches image_d4e6f5a6.png) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Queue Table & Filter) - 7 cols */}
        <div className="lg:col-span-7 bg-[#131926] rounded-2xl p-5 border border-slate-800/80 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="font-heading font-extrabold text-base text-white">Inquiries Queue</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage applications, follow-ups, and student consultations.
              </p>
            </div>

            <button
              onClick={handleExportCSV}
              className="h-8.5 px-3 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export spreadsheet</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {(['all', 'new', 'in_progress', 'resolved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg uppercase tracking-wider text-[11px] font-bold transition-colors ${
                  statusFilter === st
                    ? 'bg-[#0052FF] text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Enquiries Card List */}
          <div className="space-y-3">
            {filteredEnquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 font-mono bg-slate-900/50 rounded-xl border border-slate-800/60">
                No inquiries matching filter criteria.
              </div>
            ) : (
              filteredEnquiries.map((enq) => {
                const cleanPhone = (enq.phone || '').replace(/[^0-9]/g, '');
                const waLink = `https://wa.me/${cleanPhone}`;
                const mailtoLink = `mailto:${enq.email}?subject=Re:%20Navioraa%20Inquiry%20-%20${encodeURIComponent(enq.programOrService || 'Admissions')}`;

                return (
                  <div
                    key={enq.id}
                    className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 space-y-3 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
                          <h4 className="font-bold text-sm text-white">{enq.fullName}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            {enq.programOrService}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          {enq.email} · {enq.phone}
                        </p>
                      </div>

                      {/* Status Selector Dropdown & Delete Icon */}
                      <div className="flex items-center gap-2">
                        <select
                          value={enq.status || 'new'}
                          disabled={updatingId === enq.id}
                          onChange={(e) => handleStatusChange(enq.id, e.target.value as Enquiry['status'])}
                          className="h-7 px-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#0052FF]"
                        >
                          <option value="new">New</option>
                          <option value="in_progress">In Progress</option>
                          <option value="contacted">Follow Up / Contacted</option>
                          <option value="resolved">Resolved</option>
                        </select>

                        <button
                          onClick={() => handleDeleteEnquiry(enq.id, enq.fullName)}
                          className="w-7 h-7 rounded-lg hover:bg-red-950/50 text-slate-500 hover:text-red-400 flex items-center justify-center transition-colors"
                          title="Delete enquiry"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Query Message Preview */}
                    <div className="p-2.5 rounded-lg bg-[#131926] border border-slate-800/80 text-xs text-slate-300 font-sans leading-relaxed">
                      "{enq.message}"
                    </div>

                    {/* Actions: WhatsApp & Email Reply */}
                    <div className="flex items-center justify-end gap-3 pt-1">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:underline"
                      >
                        <span className="material-symbols-outlined text-[16px]">chat</span>
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={mailtoLink}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00E5FF] hover:underline"
                      >
                        <span className="material-symbols-outlined text-[16px]">mail</span>
                        <span>Email Reply</span>
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (Inquiries Stream telemetry panel) - 5 cols (matches image_d4e6f5a6.png) */}
        <div className="lg:col-span-5 bg-[#131926] rounded-2xl p-5 border border-slate-800/80 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
              <h3 className="font-heading font-extrabold text-base text-white">Inquiries Stream</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950/70 text-red-400 border border-red-800/50 font-mono">
              {newUnresolvedCount} UNRESOLVED
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Live sync incoming telemetry from public RFPs, consultation schedules, and Academy applications.
          </p>

          {/* Stream Cards */}
          <div className="space-y-3.5 pt-1">
            {enquiries.slice(0, 6).map((enq) => {
              const cleanPhone = (enq.phone || '').replace(/[^0-9]/g, '');
              const waLink = `https://wa.me/${cleanPhone}`;
              const mailtoLink = `mailto:${enq.email}?subject=Re:%20Navioraa%20Enquiry`;
              const isUnresolved = enq.status === 'new' || !enq.status;

              return (
                <div
                  key={`stream-${enq.id}`}
                  className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 space-y-2.5 transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isUnresolved ? 'bg-[#00E5FF]' : 'bg-emerald-400'}`} />
                      <span className="font-bold text-xs text-white truncate">{enq.fullName}</span>
                    </div>

                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-[#0052FF]/20 text-[#00E5FF] border border-[#0052FF]/30 tracking-wider flex-shrink-0">
                      {enq.programOrService?.split(' ')[0] || 'INTERNSHIP'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <span className="material-symbols-outlined text-[15px] text-slate-500">domain</span>
                    <span className="truncate">{enq.email}</span>
                  </div>

                  <p className="text-xs text-slate-300 italic line-clamp-2">
                    "{enq.message}"
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
                    <div className="flex items-center gap-2">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 flex items-center gap-1 font-semibold text-[11px]"
                      >
                        <span className="material-symbols-outlined text-[14px]">chat</span>
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={mailtoLink}
                        className="p-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-[#00E5FF] flex items-center gap-1 font-semibold text-[11px]"
                      >
                        <span className="material-symbols-outlined text-[14px]">mail</span>
                        <span>Email Reply</span>
                      </a>
                    </div>

                    {isUnresolved && (
                      <button
                        onClick={() => handleStatusChange(enq.id, 'resolved')}
                        className="p-1 px-2 rounded bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/60 flex items-center gap-1 font-semibold text-[11px]"
                        title="Mark inquiry as resolved"
                      >
                        <span className="material-symbols-outlined text-[14px]">done_all</span>
                        <span>Resolve</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
