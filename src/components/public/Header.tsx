import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  onOpenEnquiry?: (courseName?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenEnquiry }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-border-subtle shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Open Navigation Menu"
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-on-surface hover:bg-surface-subtle active:scale-95 transition-all"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
            <Link to="/" className="flex items-center gap-2.5 min-w-0 group">
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1WvXapdEnMeltY8iU9JwLdNKOOhH7ol8heGxaeDchiHMIQiUDUyAuHcuck53FXh1wQZvsQ_KMJHLuP9j-hYcpx4NjKm43K4yXHYRfZ7Hr7jgG_Sf4z888BGGW993BnVKCLGDXqlrJ748xu2l9Ip1YsAWTfk7IkPQJVfnkCMNvZzGqwTVaSacqoNkCcMFJ0cXECpzLvUGq0ESurWQ7xF9ukcpKDb0t1mtDoh8wHgUzc3mCIbW9z4y2U_RVO8"
                alt="NAVIORAA Logo"
                className="h-9 w-auto object-contain flex-shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-heading font-extrabold text-[17px] text-primary tracking-tight leading-none">
                  NAVIORAA
                </span>
                <span className="text-[10px] uppercase font-bold text-secondary tracking-wider mt-0.5 leading-none">
                  IT Institute & Tech Labs
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isActive('/') ? 'text-primary bg-primary-light' : 'text-on-surface-variant hover:text-primary hover:bg-surface-subtle'
              }`}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isActive('/about') ? 'text-primary bg-primary-light' : 'text-on-surface-variant hover:text-primary hover:bg-surface-subtle'
              }`}
            >
              About
            </Link>

            {/* Courses Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCoursesDropdownOpen(true)}
              onMouseLeave={() => setCoursesDropdownOpen(false)}
            >
              <Link
                to="/courses"
                className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1 transition-colors ${
                  isActive('/courses') ? 'text-primary bg-primary-light' : 'text-on-surface-variant hover:text-primary hover:bg-surface-subtle'
                }`}
              >
                <span>Courses</span>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </Link>

              {coursesDropdownOpen && (
                <div className="absolute top-full left-0 w-64 pt-2 z-50">
                  <div className="bg-white rounded-2xl p-2 border border-border-subtle shadow-xl space-y-1">
                    <Link
                      to="/courses?cat=full-stack-development"
                      className="block px-3 py-2 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-subtle hover:text-primary"
                    >
                      <p className="font-bold">Full Stack Engineering</p>
                      <p className="text-[11px] text-text-muted">Python & MERN Architectures</p>
                    </Link>
                    <Link
                      to="/courses?cat=artificial-intelligence"
                      className="block px-3 py-2 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-subtle hover:text-primary"
                    >
                      <p className="font-bold">AI & Machine Learning</p>
                      <p className="text-[11px] text-text-muted">Deep Learning & LLM Systems</p>
                    </Link>
                    <Link
                      to="/courses?cat=data-analytics"
                      className="block px-3 py-2 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-subtle hover:text-primary"
                    >
                      <p className="font-bold">Data Analytics & BI</p>
                      <p className="text-[11px] text-text-muted">Power BI, SQL & Python</p>
                    </Link>
                    <Link
                      to="/courses?cat=programming"
                      className="block px-3 py-2 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-subtle hover:text-primary"
                    >
                      <p className="font-bold">Core Programming</p>
                      <p className="text-[11px] text-text-muted">Python, Java & Data Structures</p>
                    </Link>
                    <div className="pt-1 border-t border-border-subtle">
                      <Link
                        to="/courses"
                        className="block px-3 py-1.5 text-center text-xs font-bold text-primary hover:underline"
                      >
                        Explore All 24+ Programs →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/services"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isActive('/services') ? 'text-primary bg-primary-light' : 'text-on-surface-variant hover:text-primary hover:bg-surface-subtle'
              }`}
            >
              Services
            </Link>

            <Link
              to="/projects"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isActive('/projects') ? 'text-primary bg-primary-light' : 'text-on-surface-variant hover:text-primary hover:bg-surface-subtle'
              }`}
            >
              Projects
            </Link>

            <Link
              to="/team"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isActive('/team') ? 'text-primary bg-primary-light' : 'text-on-surface-variant hover:text-primary hover:bg-surface-subtle'
              }`}
            >
              Team
            </Link>

            <Link
              to="/resources"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isActive('/resources') ? 'text-primary bg-primary-light' : 'text-on-surface-variant hover:text-primary hover:bg-surface-subtle'
              }`}
            >
              Resources & Blog
            </Link>

            <Link
              to="/contact"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isActive('/contact') ? 'text-primary bg-primary-light' : 'text-on-surface-variant hover:text-primary hover:bg-surface-subtle'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Quick CTA Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/courses"
              className="hidden sm:inline-flex h-9 px-4 rounded-full bg-white hover:bg-surface-subtle text-primary border border-primary/30 text-xs font-semibold items-center justify-center transition-all active:scale-95 shadow-xs"
            >
              Explore Courses
            </Link>
            <a
              href="#enquiry-form"
              onClick={(e) => {
                if (location.pathname !== '/') {
                  // If on other page, allow standard link to /#enquiry-form
                } else {
                  e.preventDefault();
                  document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' });
                  onOpenEnquiry?.();
                }
              }}
              className="h-9 px-4 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <span>Enquire Now</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-[84%] max-w-[320px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-border-subtle bg-surface-subtle">
          <div className="flex items-center gap-2">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1WvXapdEnMeltY8iU9JwLdNKOOhH7ol8heGxaeDchiHMIQiUDUyAuHcuck53FXh1wQZvsQ_KMJHLuP9j-hYcpx4NjKm43K4yXHYRfZ7Hr7jgG_Sf4z888BGGW993BnVKCLGDXqlrJ748xu2l9Ip1YsAWTfk7IkPQJVfnkCMNvZzGqwTVaSacqoNkCcMFJ0cXECpzLvUGq0ESurWQ7xF9ukcpKDb0t1mtDoh8wHgUzc3mCIbW9z4y2U_RVO8"
              alt="NAVIORAA Logo"
              className="h-7 w-auto object-contain"
            />
            <span className="font-heading font-extrabold text-primary text-base tracking-tight">NAVIORAA</span>
          </div>
          <button
            aria-label="Close Drawer"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        <div className="p-4 border-b border-border-subtle bg-white">
          <Link
            to="/courses"
            className="w-full h-11 bg-primary text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-[18px]">school</span>
            <span>Explore All Courses</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <Link
            to="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
              isActive('/') ? 'bg-primary-light text-primary' : 'text-on-surface-variant hover:bg-surface-subtle'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            <span>Home</span>
          </Link>

          <Link
            to="/about"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              isActive('/about') ? 'bg-primary-light text-primary' : 'text-on-surface-variant hover:bg-surface-subtle'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-[20px]">info</span>
            <span>About Navioraa</span>
          </Link>

          <Link
            to="/courses"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              isActive('/courses') ? 'bg-primary-light text-primary' : 'text-on-surface-variant hover:bg-surface-subtle'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-[20px]">menu_book</span>
            <span>Programs & Syllabi</span>
          </Link>

          <Link
            to="/services"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              isActive('/services') ? 'bg-primary-light text-primary' : 'text-on-surface-variant hover:bg-surface-subtle'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-[20px]">integration_instructions</span>
            <span>Enterprise Services</span>
          </Link>

          <Link
            to="/projects"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              isActive('/projects') ? 'bg-primary-light text-primary' : 'text-on-surface-variant hover:bg-surface-subtle'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-[20px]">terminal</span>
            <span>Student & Client Projects</span>
          </Link>

          <Link
            to="/team"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              isActive('/team') ? 'bg-primary-light text-primary' : 'text-on-surface-variant hover:bg-surface-subtle'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-[20px]">groups</span>
            <span>Faculty & Mentors</span>
          </Link>

          <Link
            to="/resources"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              isActive('/resources') ? 'bg-primary-light text-primary' : 'text-on-surface-variant hover:bg-surface-subtle'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-[20px]">folder_data</span>
            <span>Free Study Notes</span>
          </Link>

          <Link
            to="/contact"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              isActive('/contact') ? 'bg-primary-light text-primary' : 'text-on-surface-variant hover:bg-surface-subtle'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-[20px]">support_agent</span>
            <span>Contact & Enquiries</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-border-subtle bg-surface-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
              NV
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-on-surface truncate">NAVIORAA Institute</p>
              <p className="text-[11px] text-text-muted truncate">Learn. Build. Create. Grow.</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
