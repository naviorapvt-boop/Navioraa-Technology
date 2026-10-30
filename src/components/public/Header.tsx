import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavioraaLogo } from './NavioraaLogo';

interface HeaderProps {
  onOpenEnquiry?: (courseName?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenEnquiry }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  // Navigates and guarantees that the page content scrolls directly to the top
  const handleNavClick = (path: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    setCoursesDropdownOpen(false);

    if (location.pathname === path) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } else {
      navigate(path);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  const handleEnquireClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setCoursesDropdownOpen(false);

    if (location.pathname === '/') {
      const el = document.getElementById('enquiry-form');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      onOpenEnquiry?.();
    } else {
      navigate('/#enquiry-form');
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-border-subtle shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
        <div className="max-w-7xl mx-auto h-16 sm:h-18 px-2.5 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Mobile Menu Toggle & Brand Vector Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-shrink">
            <button
              type="button"
              aria-label="Open Navigation Menu"
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-on-surface hover:bg-surface-subtle active:scale-95 transition-all flex-shrink-0"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>

            {/* Seamless vector logo styled specifically for light navbar UI */}
            <Link
              to="/"
              onClick={(e) => handleNavClick('/', e)}
              className="flex items-center group flex-shrink py-1 min-w-0"
              title="NAVIORAA - Innovation Beyond Tomorrow"
            >
              <NavioraaLogo variant="light" size="responsive" />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 flex-1 justify-center max-w-2xl">
            <button
              type="button"
              onClick={(e) => handleNavClick('/', e)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isActive('/')
                  ? 'text-[#0052FF] bg-[#0052FF]/10 font-bold'
                  : 'text-on-surface-variant hover:text-[#0052FF] hover:bg-surface-subtle'
              }`}
            >
              Home
            </button>

            <button
              type="button"
              onClick={(e) => handleNavClick('/about', e)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isActive('/about')
                  ? 'text-[#0052FF] bg-[#0052FF]/10 font-bold'
                  : 'text-on-surface-variant hover:text-[#0052FF] hover:bg-surface-subtle'
              }`}
            >
              About
            </button>

            {/* Courses Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCoursesDropdownOpen(true)}
              onMouseLeave={() => setCoursesDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={(e) => handleNavClick('/courses', e)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1 transition-colors ${
                  isActive('/courses')
                    ? 'text-[#0052FF] bg-[#0052FF]/10 font-bold'
                    : 'text-on-surface-variant hover:text-[#0052FF] hover:bg-surface-subtle'
                }`}
              >
                <span>Courses</span>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>

              {coursesDropdownOpen && (
                <div className="absolute top-full left-0 w-64 pt-2 z-50">
                  <div className="bg-white rounded-2xl p-2 border border-border-subtle shadow-xl space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setCoursesDropdownOpen(false);
                        navigate('/courses?cat=full-stack-development');
                        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-subtle hover:text-primary"
                    >
                      <p className="font-bold">Full Stack Engineering</p>
                      <p className="text-[11px] text-text-muted">Python & MERN Architectures</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCoursesDropdownOpen(false);
                        navigate('/courses?cat=artificial-intelligence');
                        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-subtle hover:text-primary"
                    >
                      <p className="font-bold">AI & Machine Learning</p>
                      <p className="text-[11px] text-text-muted">Deep Learning & LLM Systems</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCoursesDropdownOpen(false);
                        navigate('/courses?cat=data-analytics');
                        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-subtle hover:text-primary"
                    >
                      <p className="font-bold">Data Analytics & BI</p>
                      <p className="text-[11px] text-text-muted">Power BI, SQL & Python</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCoursesDropdownOpen(false);
                        navigate('/courses?cat=programming');
                        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-subtle hover:text-primary"
                    >
                      <p className="font-bold">Core Programming</p>
                      <p className="text-[11px] text-text-muted">Python, Java & Data Structures</p>
                    </button>

                    <div className="pt-1 border-t border-border-subtle">
                      <button
                        type="button"
                        onClick={(e) => handleNavClick('/courses', e)}
                        className="w-full text-center px-3 py-1.5 text-xs font-bold text-primary hover:underline"
                      >
                        Explore All Programs →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => handleNavClick('/services', e)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isActive('/services')
                  ? 'text-[#0052FF] bg-[#0052FF]/10 font-bold'
                  : 'text-on-surface-variant hover:text-[#0052FF] hover:bg-surface-subtle'
              }`}
            >
              Services
            </button>

            <button
              type="button"
              onClick={(e) => handleNavClick('/projects', e)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isActive('/projects')
                  ? 'text-[#0052FF] bg-[#0052FF]/10 font-bold'
                  : 'text-on-surface-variant hover:text-[#0052FF] hover:bg-surface-subtle'
              }`}
            >
              Projects
            </button>

            <button
              type="button"
              onClick={(e) => handleNavClick('/resources', e)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isActive('/resources')
                  ? 'text-[#0052FF] bg-[#0052FF]/10 font-bold'
                  : 'text-on-surface-variant hover:text-[#0052FF] hover:bg-surface-subtle'
              }`}
            >
              Resources & Blog
            </button>

            <button
              type="button"
              onClick={(e) => handleNavClick('/contact', e)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isActive('/contact')
                  ? 'text-[#0052FF] bg-[#0052FF]/10 font-bold'
                  : 'text-on-surface-variant hover:text-[#0052FF] hover:bg-surface-subtle'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action CTA Buttons: Clean, clearly visible, styled with logo palette */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={(e) => handleNavClick('/courses', e)}
              className="hidden md:inline-flex h-9 px-3.5 lg:px-4 rounded-full bg-slate-50 hover:bg-[#0052FF]/10 text-[#0052FF] border border-[#0052FF]/25 text-xs font-bold items-center justify-center transition-all active:scale-95 shadow-2xs hover:border-[#0052FF]/40 whitespace-nowrap"
            >
              Explore Courses
            </button>

            <button
              type="button"
              onClick={handleEnquireClick}
              className="h-8 sm:h-9 px-2.5 sm:px-4 rounded-full bg-gradient-to-r from-[#0052FF] via-[#0066FF] to-[#00A3FF] hover:from-[#0047E0] hover:to-[#008FE6] text-white text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 shadow-sm shadow-blue-500/25 hover:shadow-md hover:shadow-blue-500/35 transition-all active:scale-95 whitespace-nowrap flex-shrink-0"
              aria-label="Enquire Now"
            >
              <span>Enquire Now</span>
              <span className="material-symbols-outlined text-[13px] sm:text-[16px]">arrow_forward</span>
            </button>
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
        {/* Drawer Header: Clean vector logo suited for UI */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-border-subtle bg-surface-subtle">
          <Link
            to="/"
            onClick={(e) => handleNavClick('/', e)}
            className="flex items-center"
          >
            <NavioraaLogo variant="light" size="sm" />
          </Link>

          <button
            type="button"
            aria-label="Close Drawer"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Quick CTA inside drawer with brand colors */}
        <div className="p-4 border-b border-border-subtle bg-white space-y-2">
          <button
            type="button"
            onClick={(e) => handleNavClick('/courses', e)}
            className="w-full h-11 bg-gradient-to-r from-[#0052FF] via-[#0066FF] to-[#00A3FF] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">school</span>
            <span>Explore All Courses</span>
          </button>
          <button
            type="button"
            onClick={handleEnquireClick}
            className="w-full h-10 bg-slate-50 hover:bg-[#0052FF]/10 text-[#0052FF] border border-[#0052FF]/20 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Admission Enquiry</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <button
            type="button"
            onClick={(e) => handleNavClick('/', e)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left ${
              isActive('/') ? 'bg-[#0052FF]/10 text-[#0052FF] font-bold' : 'text-on-surface-variant hover:bg-surface-subtle'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={(e) => handleNavClick('/about', e)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left ${
              isActive('/about') ? 'bg-[#0052FF]/10 text-[#0052FF] font-bold' : 'text-on-surface-variant hover:bg-surface-subtle'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">info</span>
            <span>About Navioraa</span>
          </button>

          <button
            type="button"
            onClick={(e) => handleNavClick('/courses', e)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left ${
              isActive('/courses') ? 'bg-[#0052FF]/10 text-[#0052FF] font-bold' : 'text-on-surface-variant hover:bg-surface-subtle'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">menu_book</span>
            <span>Courses & Syllabi</span>
          </button>

          <button
            type="button"
            onClick={(e) => handleNavClick('/services', e)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left ${
              isActive('/services') ? 'bg-[#0052FF]/10 text-[#0052FF] font-bold' : 'text-on-surface-variant hover:bg-surface-subtle'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">integration_instructions</span>
            <span>Enterprise Services</span>
          </button>

          <button
            type="button"
            onClick={(e) => handleNavClick('/projects', e)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left ${
              isActive('/projects') ? 'bg-[#0052FF]/10 text-[#0052FF] font-bold' : 'text-on-surface-variant hover:bg-surface-subtle'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">terminal</span>
            <span>Student & Client Projects</span>
          </button>

          <button
            type="button"
            onClick={(e) => handleNavClick('/resources', e)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left ${
              isActive('/resources') ? 'bg-[#0052FF]/10 text-[#0052FF] font-bold' : 'text-on-surface-variant hover:bg-surface-subtle'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">folder_data</span>
            <span>Resources & Study Notes</span>
          </button>

          <button
            type="button"
            onClick={(e) => handleNavClick('/contact', e)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left ${
              isActive('/contact') ? 'bg-[#0052FF]/10 text-[#0052FF] font-bold' : 'text-on-surface-variant hover:bg-surface-subtle'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">support_agent</span>
            <span>Contact & Enquiries</span>
          </button>
        </nav>

        <div className="p-3 border-t border-border-subtle bg-surface-subtle text-center">
          <p className="text-[11px] text-text-muted">NAVIORAA IT Institute & Tech Labs</p>
        </div>
      </aside>
    </>
  );
};
