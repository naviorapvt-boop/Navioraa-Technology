import React, { useState, useEffect } from 'react';
import { getServices } from '../../lib/data-service';
import { ServiceItem } from '../../lib/types';
import { INITIAL_SERVICES } from '../../lib/seed-data';
import { ServicesSection } from '../../components/public/ServicesSection';
import { ContactEnquirySection } from '../../components/public/ContactEnquirySection';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>(() => INITIAL_SERVICES.map((s, i) => ({ ...s, id: `seed-srv-${i}` })));

  useEffect(() => {
    getServices(true).then(setServices);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-b from-primary-light/50 via-white to-surface px-4 py-16 border-b border-border-subtle text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary-soft px-3.5 py-1 rounded-full">
            Engineering & Technology Services
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-on-surface mt-3">
            Custom Software, Cloud Architecture & AI Automation
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant mt-3 leading-relaxed">
            Navioraa pairs senior technical leads with disciplined developer pods to deliver high-availability software products for businesses and startups.
          </p>
        </div>
      </section>

      <ServicesSection
        services={services}
        onConsult={() => {
          document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <ContactEnquirySection initialCourse="Enterprise Software & Web Development" />
    </div>
  );
};
