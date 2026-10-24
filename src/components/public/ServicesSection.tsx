import React from 'react';
import { ServiceItem } from '../../lib/types';

interface ServicesSectionProps {
  services: ServiceItem[];
  onConsult: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services, onConsult }) => {
  return (
    <section className="px-4 py-12 bg-surface-subtle border-b border-border-subtle scroll-mt-20" id="services">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary-soft px-3.5 py-1 rounded-full">
            Dual Mission
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-on-surface mt-2.5">
            Enterprise Technology & Development Solutions
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl mx-auto mt-2 leading-relaxed">
            Beyond practical education: our engineering agency division delivers custom software, cloud migration, mobile apps, and AI systems for companies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => {
            const isAlt = index % 2 === 1;
            return (
              <div
                key={service.id || index}
                className="p-5 rounded-2xl bg-white border border-border-subtle shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isAlt ? 'bg-secondary-soft text-secondary' : 'bg-primary-light text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px]">
                        {service.icon || 'terminal'}
                      </span>
                    </span>
                    <div>
                      <h3 className="font-heading font-bold text-sm sm:text-base text-on-surface group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-[11px] text-text-muted">Enterprise Production Grade</p>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                    {service.shortDescription}
                  </p>

                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-1.5 pt-2 border-t border-border-subtle">
                      {service.features.map((feature, fIdx) => (
                        <li key={fIdx} className="text-[11px] text-on-surface flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-primary text-[14px]">
                            check
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={onConsult}
                    className="text-xs font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Request Engineering Scope</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-8 text-center">
          <button
            onClick={onConsult}
            className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-xs sm:text-sm shadow-sm active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">support_agent</span>
            <span>Consult Our Software Engineering Team</span>
          </button>
        </div>
      </div>
    </section>
  );
};
