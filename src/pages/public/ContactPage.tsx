import React, { useState, useEffect } from 'react';
import { getSiteSettings } from '../../lib/data-service';
import { SiteSettings } from '../../lib/types';
import { ContactEnquirySection } from '../../components/public/ContactEnquirySection';

export const ContactPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-b from-primary-light/50 via-white to-surface px-4 py-16 border-b border-border-subtle text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary-soft px-3.5 py-1 rounded-full">
            Connect With Navioraa
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-on-surface mt-3">
            Admissions, Project Inquiries & Tech Support
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant mt-3 leading-relaxed">
            Reach out to our campus counselors and engineering project advisors.
          </p>
        </div>
      </section>

      {/* Campus & Communication Channels */}
      <section className="px-4 py-12 bg-white border-b border-border-subtle">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-surface-subtle border border-border-subtle flex flex-col items-center text-center">
            <span className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[24px]">location_on</span>
            </span>
            <h3 className="font-heading font-bold text-base text-on-surface mb-1">Campus Hubs</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {settings?.address || 'Tech Innovation Park, Pune & Navi Mumbai, Maharashtra, India'}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-surface-subtle border border-border-subtle flex flex-col items-center text-center">
            <span className="w-12 h-12 rounded-2xl bg-secondary-soft text-secondary flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[24px]">mail</span>
            </span>
            <h3 className="font-heading font-bold text-base text-on-surface mb-1">Email Counseling</h3>
            <p className="text-xs text-on-surface-variant">
              {settings?.contactEmail || 'naviora.pvt@gmail.com'}
            </p>
            <p className="text-[11px] text-text-muted mt-1">Response guaranteed within 2 hours</p>
          </div>

          <div className="p-6 rounded-3xl bg-surface-subtle border border-border-subtle flex flex-col items-center text-center">
            <span className="w-12 h-12 rounded-2xl bg-[#E8F8EE] text-[#1EBE5D] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[24px]">call</span>
            </span>
            <h3 className="font-heading font-bold text-base text-on-surface mb-1">Phone & WhatsApp</h3>
            <p className="text-xs text-on-surface-variant font-medium">
              {settings?.contactPhone || '+91 98765 43210'}
            </p>
            <p className="text-[11px] text-text-muted mt-1">Mon - Sat: 9:00 AM - 7:00 PM IST</p>
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <ContactEnquirySection whatsappNumber={settings?.whatsappNumber} />
    </div>
  );
};
