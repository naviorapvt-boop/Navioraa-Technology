import React from 'react';
import { WhyChooseUsItem } from '../../lib/types';

interface WhyChooseNavioraaProps {
  items: WhyChooseUsItem[];
}

export const WhyChooseNavioraa: React.FC<WhyChooseNavioraaProps> = ({ items }) => {
  return (
    <section className="px-4 py-12 bg-white border-b border-border-subtle scroll-mt-20" id="why-navioraa">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3.5 py-1 rounded-full">
            The Career Edge
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-on-surface mt-2.5">
            Why Practical Tech Skills <span className="text-secondary">Matter</span>
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl mx-auto mt-2 leading-relaxed">
            Standard theoretical degrees alone no longer prepare developers for production expectations. Here is how
            Navioraa’s project-centric training accelerates your engineering career.
          </p>
        </div>

        {/* 6 Grid Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => {
            const isRed = index % 2 === 0;
            return (
              <div
                key={item.id || index}
                className="p-5 rounded-2xl bg-surface-subtle border border-border-subtle hover:border-border-medium hover:shadow-xs transition-all flex items-start gap-4"
              >
                {/* Number Badge */}
                <div
                  className={`w-11 h-11 rounded-xl text-white font-extrabold flex items-center justify-center flex-shrink-0 text-sm shadow-xs ${
                    isRed ? 'bg-secondary' : 'bg-primary'
                  }`}
                >
                  {item.stepNumber || `0${index + 1}`}
                </div>

                <div className="min-w-0">
                  <h3 className="font-heading font-bold text-sm sm:text-base text-on-surface leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
