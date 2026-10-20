import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { getSiteSettings } from '../../lib/data-service';
import { SiteSettings } from '../../lib/types';

export const PublicLayout: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | undefined>(undefined);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-surface selection:bg-primary-light selection:text-primary">
      {/* Sticky Header */}
      <Header />

      {/* Main Routed Page Content */}
      <main className="flex-1 pt-16 pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Bottom Sticky Mobile Navigation (Visible only on mobile devices) */}
      <nav className="md:hidden fixed bottom-0 w-full z-40 bg-white/95 backdrop-blur-md border-t border-border-subtle shadow-[0_-2px_12px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16 px-2">
          <Link
            to="/"
            className="flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-12 text-primary font-bold"
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            <span className="text-[11px]">Home</span>
          </Link>

          <Link
            to="/courses"
            className="flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-12 text-slate-500 hover:text-primary font-medium"
          >
            <span className="material-symbols-outlined text-[20px]">menu_book</span>
            <span className="text-[11px]">Courses</span>
          </Link>

          <Link
            to="/projects"
            className="flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-12 text-slate-500 hover:text-primary font-medium"
          >
            <span className="material-symbols-outlined text-[20px]">terminal</span>
            <span className="text-[11px]">Projects</span>
          </Link>

          <a
            href={`https://wa.me/${(settings?.whatsappNumber || '+919876543210').replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-12 text-[#25D366] hover:text-[#1EBE5D] font-medium"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            <span className="text-[11px]">WhatsApp</span>
          </a>
        </div>
      </nav>

      {/* Professional Footer */}
      <Footer settings={settings} />
    </div>
  );
};
