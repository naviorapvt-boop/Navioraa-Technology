import React from 'react';
import { Link } from 'react-router-dom';
import { SiteSettings } from '../../lib/types';
import { NavioraaLogo } from './NavioraaLogo';

interface FooterProps {
  settings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  return (
    <footer className="bg-slate-900 text-white px-4 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Overview */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" onClick={handleLinkClick} className="inline-block group py-1">
              <NavioraaLogo variant="dark" size="lg" />
            </Link>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              NAVIORAA is an IT training and technology project development institute committed to modern, hands-on technical pedagogy, production engineering standards, and enterprise client software systems.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-4 text-xs">
              <a
                href={`tel:${(settings?.contactPhone || '+919890187383').replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors font-medium"
              >
                <span className="material-symbols-outlined text-[16px] text-[#00D2FF]">call</span>
                <span>{settings?.contactPhone || '+91 9890187383'}</span>
              </a>
              <a
                href={`https://wa.me/${(settings?.whatsappNumber || '+919890187383').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>WhatsApp</span>
              </a>
              <a
                href={`mailto:${settings?.contactEmail || 'naviora.pvt@gmail.com'}`}
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors font-medium"
              >
                <span className="material-symbols-outlined text-[16px] text-[#00D2FF]">mail</span>
                <span>{settings?.contactEmail || 'naviora.pvt@gmail.com'}</span>
              </a>
            </div>
          </div>

          {/* Programs Navigation */}
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              Programs Catalog
            </p>
            <Link to="/courses" onClick={handleLinkClick} className="text-xs text-slate-400 hover:text-white transition-colors">
              Python Full Stack Engineering
            </Link>
            <Link to="/courses" onClick={handleLinkClick} className="text-xs text-slate-400 hover:text-white transition-colors">
              MERN Stack Web Development
            </Link>
            <Link to="/courses" onClick={handleLinkClick} className="text-xs text-slate-400 hover:text-white transition-colors">
              AI & Machine Learning Tracks
            </Link>
            <Link to="/courses" onClick={handleLinkClick} className="text-xs text-slate-400 hover:text-white transition-colors">
              Data Analytics & Power BI
            </Link>
            <Link to="/courses" onClick={handleLinkClick} className="text-xs text-slate-400 hover:text-white transition-colors">
              Java Cloud Architecture
            </Link>
          </div>

          {/* Institute Navigation - team link removed */}
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              Institute & Labs
            </p>
            <Link to="/about" onClick={handleLinkClick} className="text-xs text-slate-400 hover:text-white transition-colors">
              About Navioraa
            </Link>
            <Link to="/services" onClick={handleLinkClick} className="text-xs text-slate-400 hover:text-white transition-colors">
              Enterprise Engineering
            </Link>
            <Link to="/projects" onClick={handleLinkClick} className="text-xs text-slate-400 hover:text-white transition-colors">
              Student Proof of Work
            </Link>
            <Link to="/resources" onClick={handleLinkClick} className="text-xs text-slate-400 hover:text-white transition-colors">
              Free Study Notes & Starters
            </Link>
            <Link to="/contact" onClick={handleLinkClick} className="text-xs text-slate-400 hover:text-white transition-colors">
              Admissions & Contact
            </Link>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex flex-wrap items-center gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Admission</a>
            <a href="#" className="hover:underline">Code of Academic Conduct</a>
          </div>
          <p>© {currentYear} NAVIORAA Institute of Technology & R&D. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
