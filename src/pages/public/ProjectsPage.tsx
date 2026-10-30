import React, { useState, useEffect } from 'react';
import { getProjects } from '../../lib/data-service';
import { ProjectItem } from '../../lib/types';
import { INITIAL_PROJECTS } from '../../lib/seed-data';
import { ProjectsSection } from '../../components/public/ProjectsSection';
import { ContactEnquirySection } from '../../components/public/ContactEnquirySection';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>(() => INITIAL_PROJECTS.map((p, i) => ({ ...p, id: `seed-proj-${i}` })));

  useEffect(() => {
    getProjects(true).then(setProjects);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-b from-primary-light/50 via-white to-surface px-4 py-16 border-b border-border-subtle text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3.5 py-1 rounded-full">
            Verified Proof of Work
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-on-surface mt-3">
            Student & Client Technology Projects
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant mt-3 leading-relaxed">
            Explore live production web apps, mobile solutions, and AI algorithms architected and shipped by our incubator pods.
          </p>
        </div>
      </section>

      <ProjectsSection
        projects={projects}
        onEnquire={(title) => {
          document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <ContactEnquirySection initialCourse="Project Incubator Collaboration" />
    </div>
  );
};
