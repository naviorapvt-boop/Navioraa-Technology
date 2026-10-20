import React from 'react';
import { TeamMember } from '../../lib/types';

interface TeamSectionProps {
  members: TeamMember[];
}

export const TeamSection: React.FC<TeamSectionProps> = ({ members }) => {
  return (
    <section className="px-4 py-12 bg-surface-subtle border-b border-border-subtle" id="mentors">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary-soft px-3.5 py-1 rounded-full">
            Core Leadership
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-on-surface mt-2.5">
            Meet Our Mentors & Leadership Team
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl mx-auto mt-2 leading-relaxed">
            Seasoned software architects and pedagogical leads guiding your engineering trajectory and industry readiness.
          </p>
        </div>

        {/* 5-column or responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((member, index) => {
            const isRed = index % 2 === 0;
            return (
              <div
                key={member.id || index}
                className="bg-white rounded-2xl p-5 border border-border-subtle shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/20 bg-slate-100 shadow-xs">
                      <img
                        src={member.photoUrl}
                        alt={`Portrait of ${member.name}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-heading font-bold text-base text-on-surface">
                        {member.name}
                      </h3>
                      <p className={`text-xs font-bold ${isRed ? 'text-secondary' : 'text-primary'}`}>
                        {member.role}
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5 truncate">
                        {member.title || 'Director'}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {member.linkedinUrl && (
                  <div className="pt-3 border-t border-border-subtle mt-4 flex items-center justify-between text-xs">
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-dark font-semibold inline-flex items-center gap-1"
                    >
                      <span>Connect on LinkedIn</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
