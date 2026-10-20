import React, { useState, useEffect } from 'react';
import { getTeamMembers } from '../../lib/data-service';
import { TeamMember } from '../../lib/types';
import { TeamSection } from '../../components/public/TeamSection';

export const TeamPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    getTeamMembers(true).then(setTeam);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-b from-primary-light/50 via-white to-surface px-4 py-16 border-b border-border-subtle text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary-soft px-3.5 py-1 rounded-full">
            Faculty & Mentors
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-on-surface mt-3">
            Core Leadership & Technical Mentors
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant mt-3 leading-relaxed">
            Meet the architects, engineering leads, and educational directors leading the learning experience at NAVIORAA.
          </p>
        </div>
      </section>

      <TeamSection members={team} />
    </div>
  );
};
