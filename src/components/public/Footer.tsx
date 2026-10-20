import React from 'react';
import { Link } from 'react-router-dom';
import { SiteSettings } from '../../lib/types';

interface FooterProps {
  settings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white px-4 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Overview */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1WvXapdEnMeltY8iU9JwLdNKOOhH7ol8heGxaeDchiHMIQiUDUyAuHcuck53FXh1wQZvsQ_KMJHLuP9j-hYcpx4NjKm43K4yXHYRfZ7Hr7jgG_Sf4z888BGGW993BnVKCLGDXqlrJ748xu2l9Ip1YsAWTfk7IkPQJVfnkCMNvZzGqwTVaSacqoNkCcMFJ0cXECpzLvUGq0ESurWQ7xF9ukcpKDb0t1mtDoh8wHgUzc3mCIbW9z4y2U_RVO8"
                alt="NAVIORAA Logo"
                className="h-8 w-auto object-contain brightness-0 invert"
              />
              <span className="font-heading font-extrabold text-lg text-white tracking-tight">
                {settings?.companyName || 'NAVIORAA'}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              NAVIORAA is an IT training and technology project development institute committed to modern, hands-on technical pedagogy, production engineering standards, and enterprise client software systems.
            </p>
            <p className="text-xs font-bold text-secondary uppercase tracking-wider">
              {settings?.tagline || 'Learn. Build. Create. Grow.'}
            </p>
          </div>

          {/* Programs Navigation */}
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              Programs Catalog
            </p>
            <Link to="/courses" className="text-xs text-slate-400 hover:text-white transition-colors">
              Python Full Stack Engineering
            </Link>
            <Link to="/courses" className="text-xs text-slate-400 hover:text-white transition-colors">
              MERN Stack Web Development
            </Link>
            <Link to="/courses" className="text-xs text-slate-400 hover:text-white transition-colors">
              AI & Machine Learning Tracks
            </Link>
            <Link to="/courses" className="text-xs text-slate-400 hover:text-white transition-colors">
              Data Analytics & Power BI
            </Link>
            <Link to="/courses" className="text-xs text-slate-400 hover:text-white transition-colors">
              Java Cloud Architecture
            </Link>
          </div>

          {/* Institute Navigation */}
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              Institute & Labs
            </p>
            <Link to="/about" className="text-xs text-slate-400 hover:text-white transition-colors">
              About Navioraa
            </Link>
            <Link to="/services" className="text-xs text-slate-400 hover:text-white transition-colors">
              Enterprise Engineering
            </Link>
            <Link to="/projects" className="text-xs text-slate-400 hover:text-white transition-colors">
              Student Proof of Work
            </Link>
            <Link to="/team" className="text-xs text-slate-400 hover:text-white transition-colors">
              Faculty & Mentors
            </Link>
            <Link to="/resources" className="text-xs text-slate-400 hover:text-white transition-colors">
              Free Study Notes & Starters
            </Link>
            <Link to="/contact" className="text-xs text-slate-400 hover:text-white transition-colors">
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
