import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getEnquiries,
  getCourses,
  getProjects,
  getTeamMembers,
  getResources,
  getBlogPosts,
  seedInitialDatabaseIfEmpty,
} from '../../lib/data-service';
import { Enquiry, Course, ProjectItem, TeamMember } from '../../lib/types';
import { useAuth } from '../../lib/auth-context';

export const AdminDashboard: React.FC = () => {
  const { isOwner, role } = useAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [resourceCount, setResourceCount] = useState(0);
  const [articleCount, setArticleCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [enq, crs, prj, tm, res, blg] = await Promise.all([
          getEnquiries(),
          getCourses(false),
          getProjects(false),
          getTeamMembers(false),
          getResources(false),
          getBlogPosts(false),
        ]);
        setEnquiries(enq);
        setCourses(crs);
        setProjects(prj);
        setTeam(tm);
        setResourceCount(res.length);
        setArticleCount(blg.length);
      } catch (err) {
        console.warn('Dashboard metrics load notice:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  const handleSeedDatabase = async () => {
    if (!window.confirm('Do you want to seed the database with initial Navioraa records? (Initial courses, slides, team, and services)')) {
      return;
    }
    setSeeding(true);
    setSeedNotice(null);
    try {
      const res = await seedInitialDatabaseIfEmpty();
      setSeedNotice(res.message);
      // Reload metrics
      const [crs, prj, tm] = await Promise.all([
        getCourses(false),
        getProjects(false),
        getTeamMembers(false),
      ]);
      setCourses(crs);
      setProjects(prj);
      setTeam(tm);
    } catch (err) {
      setSeedNotice(err instanceof Error ? err.message : 'Seeding failed');
    } finally {
      setSeeding(false);
    }
  };

  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;
  const publishedCoursesCount = courses.filter((c) => c.published).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-on-surface">
            Executive CMS Dashboard
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Real-time control over NAVIORAA academic programs, live admissions enquiries, and digital content.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {courses.length === 0 && (
            <button
              onClick={handleSeedDatabase}
              disabled={seeding}
              className="h-10 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">database</span>
              <span>{seeding ? 'Seeding...' : 'Seed Initial Database'}</span>
            </button>
          )}

          <Link
            to="/admin/courses"
            className="h-10 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Course</span>
          </Link>

          <Link
            to="/admin/enquiries"
            className="h-10 px-4 rounded-xl bg-white border border-border-medium hover:bg-surface-subtle text-on-surface font-semibold text-xs flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">mail</span>
            <span>View Inbox</span>
          </Link>
        </div>
      </div>

      {seedNotice && (
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium flex items-center justify-between">
          <span>{seedNotice}</span>
          <button onClick={() => setSeedNotice(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white border border-border-subtle shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-secondary-soft text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">mark_email_unread</span>
            </span>
            {newEnquiriesCount > 0 && (
              <span className="text-[11px] font-bold bg-secondary text-white px-2 py-0.5 rounded-full animate-pulse">
                Action Needed
              </span>
            )}
          </div>
          <p className="text-2xl font-extrabold text-on-surface leading-none">
            {newEnquiriesCount}
          </p>
          <p className="text-xs font-bold text-on-surface mt-1">New & Unread Enquiries</p>
          <p className="text-[11px] text-text-muted mt-0.5">Total submissions: {enquiries.length}</p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white border border-border-subtle shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">school</span>
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {publishedCoursesCount} Published
            </span>
          </div>
          <p className="text-2xl font-extrabold text-on-surface leading-none">
            {courses.length}
          </p>
          <p className="text-xs font-bold text-on-surface mt-1">Course Catalog</p>
          <p className="text-[11px] text-text-muted mt-0.5">Syllabi & certifications</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white border border-border-subtle shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">terminal</span>
            </span>
            <span className="text-[11px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full">
              Incubator
            </span>
          </div>
          <p className="text-2xl font-extrabold text-on-surface leading-none">
            {projects.length}
          </p>
          <p className="text-xs font-bold text-on-surface mt-1">Live Projects</p>
          <p className="text-[11px] text-text-muted mt-0.5">Student & client software</p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white border border-border-subtle shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">groups</span>
            </span>
            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
              MD & Faculty
            </span>
          </div>
          <p className="text-2xl font-extrabold text-on-surface leading-none">
            {team.length}
          </p>
          <p className="text-xs font-bold text-on-surface mt-1">Faculty Mentors</p>
          <p className="text-[11px] text-text-muted mt-0.5">Core leadership profiles</p>
        </div>
      </div>

      {/* Recent Admissions & Inquiries Table */}
      <div className="bg-white rounded-3xl border border-border-subtle shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-border-subtle flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-base text-on-surface">
              Recent Admissions & Program Enquiries
            </h2>
            <p className="text-xs text-text-muted">Direct submissions from the public website</p>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>Open Full CRM Inbox ({enquiries.length})</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {enquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle text-slate-500 font-semibold border-b border-border-subtle">
                <tr>
                  <th className="px-5 py-3">Applicant Name</th>
                  <th className="px-5 py-3">Contact Details</th>
                  <th className="px-5 py-3">Domain Track</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Submitted</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {enquiries.slice(0, 5).map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-on-surface">
                      {enq.fullName}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-on-surface font-medium">{enq.email}</p>
                      <p className="text-[11px] text-text-muted">{enq.phone}</p>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-primary">
                      {enq.programOrService}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          enq.status === 'new'
                            ? 'bg-red-100 text-red-700'
                            : enq.status === 'in_progress'
                            ? 'bg-amber-100 text-amber-800'
                            : enq.status === 'contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {enq.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-text-muted">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        to="/admin/enquiries"
                        className="px-3 py-1 rounded-lg bg-surface-subtle hover:bg-slate-200 text-on-surface font-semibold text-xs inline-block"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-text-muted text-xs">
            No admissions submissions received yet. When users submit the public enquiry form, they will display here with live status updates.
          </div>
        )}
      </div>

      {/* Quick Content Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin/homepage"
          className="p-5 rounded-2xl bg-white border border-border-subtle shadow-2xs hover:shadow-xs transition-all flex items-center justify-between"
        >
          <div>
            <h3 className="font-heading font-bold text-sm text-on-surface">Hero Carousel Manager</h3>
            <p className="text-xs text-text-muted mt-0.5">Edit slides, banners & CTAs</p>
          </div>
          <span className="material-symbols-outlined text-primary text-[24px]">view_carousel</span>
        </Link>

        <Link
          to="/admin/team"
          className="p-5 rounded-2xl bg-white border border-border-subtle shadow-2xs hover:shadow-xs transition-all flex items-center justify-between"
        >
          <div>
            <h3 className="font-heading font-bold text-sm text-on-surface">Leadership Profiles</h3>
            <p className="text-xs text-text-muted mt-0.5">Shubham, Sakshi, Chaitanya & MDs</p>
          </div>
          <span className="material-symbols-outlined text-secondary text-[24px]">badge</span>
        </Link>

        <Link
          to="/admin/settings"
          className="p-5 rounded-2xl bg-white border border-border-subtle shadow-2xs hover:shadow-xs transition-all flex items-center justify-between"
        >
          <div>
            <h3 className="font-heading font-bold text-sm text-on-surface">Settings & Email Alerts</h3>
            <p className="text-xs text-text-muted mt-0.5">Contact info, WhatsApp & SMTP</p>
          </div>
          <span className="material-symbols-outlined text-accent-blue text-[24px]">mail_lock</span>
        </Link>
      </div>
    </div>
  );
};
