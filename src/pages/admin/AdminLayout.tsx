import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';

export const AdminLayout: React.FC = () => {
  const { currentUser, adminProfile, role, isOwner, isAdmin, isStaff, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-subtle flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[36px] animate-spin">
            progress_activity
          </span>
          <p className="text-xs font-bold text-on-surface">Authenticating NAVIORAA CMS...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!currentUser) {
    navigate('/admin/login', { replace: true });
    return null;
  }

  // If logged in but lacks staff/admin role
  if (!isStaff) {
    return (
      <div className="min-h-screen bg-surface-subtle flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-border-subtle shadow-lg text-center space-y-4">
          <span className="material-symbols-outlined text-[48px] text-amber-500">lock_person</span>
          <h2 className="font-heading font-extrabold text-xl text-on-surface">Admin Access Required</h2>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Logged in as <span className="font-bold">{currentUser.email}</span>, but your account does not have active administrative permissions.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/admin/login"
              className="h-10 rounded-xl bg-primary text-white text-xs font-semibold flex items-center justify-center"
            >
              Back to Sign In
            </Link>
            <button
              onClick={() => logout()}
              className="h-10 rounded-xl border border-border-medium text-xs font-semibold hover:bg-slate-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Enquiries Inbox', path: '/admin/enquiries', icon: 'inbox' },
    { label: 'Courses & Syllabi', path: '/admin/courses', icon: 'school' },
    { label: 'Hero & Homepage', path: '/admin/homepage', icon: 'view_carousel' },
    { label: 'Enterprise Services', path: '/admin/services', icon: 'integration_instructions' },
    { label: 'Projects & Work', path: '/admin/projects', icon: 'terminal' },
    { label: 'Faculty & Team', path: '/admin/team', icon: 'groups' },
    { label: 'Resources & Notes', path: '/admin/resources', icon: 'folder_data' },
    { label: 'Blog & Articles', path: '/admin/blog', icon: 'article' },
    { label: 'Global Settings', path: '/admin/settings', icon: 'settings' },
    { label: 'Team Roles & Access', path: '/admin/users', icon: 'manage_accounts' },
  ];

  const isActive = (p: string) => location.pathname === p;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col justify-between flex-shrink-0 min-h-screen border-r border-slate-800">
        <div>
          {/* Logo Brand */}
          <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1WvXapdEnMeltY8iU9JwLdNKOOhH7ol8heGxaeDchiHMIQiUDUyAuHcuck53FXh1wQZvsQ_KMJHLuP9j-hYcpx4NjKm43K4yXHYRfZ7Hr7jgG_Sf4z888BGGW993BnVKCLGDXqlrJ748xu2l9Ip1YsAWTfk7IkPQJVfnkCMNvZzGqwTVaSacqoNkCcMFJ0cXECpzLvUGq0ESurWQ7xF9ukcpKDb0t1mtDoh8wHgUzc3mCIbW9z4y2U_RVO8"
              alt="NAVIORAA Logo"
              className="h-7 w-auto brightness-0 invert"
            />
            <div className="min-w-0">
              <span className="font-heading font-extrabold text-sm text-white tracking-tight block">
                NAVIORAA CMS
              </span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">Control Center</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-xs">
              {adminProfile?.displayName?.slice(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {adminProfile?.displayName || currentUser.email}
              </p>
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary-soft/20 px-2 py-0.5 rounded">
                {role === 'owner' ? 'Super Admin' : role}
              </span>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full h-9 rounded-xl bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 px-4 sm:px-6 bg-white border-b border-border-subtle flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-subtle"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
            <span className="text-xs sm:text-sm font-bold text-on-surface">
              Administrative Control Suite
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-3.5 rounded-full border border-border-medium text-xs font-semibold text-primary hover:bg-surface-subtle flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
              <span className="hidden sm:inline">View Public Website</span>
            </a>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border-subtle">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium text-text-muted">Live Sync Active</span>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Dropdown */}
        {mobileSidebarOpen && (
          <div className="md:hidden bg-slate-900 text-white p-3 space-y-1 border-b border-slate-800">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                  isActive(item.path) ? 'bg-primary text-white font-bold' : 'text-slate-400'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            <button
              onClick={() => logout()}
              className="w-full mt-2 h-9 rounded-lg bg-red-900/40 text-red-300 text-xs font-semibold flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Nested CMS View */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
