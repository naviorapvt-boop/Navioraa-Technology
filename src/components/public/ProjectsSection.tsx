import React, { useState } from 'react';
import { ProjectItem } from '../../lib/types';
import { ProjectDetailModal } from './ProjectDetailModal';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onEnquire: (projectTitle: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, onEnquire }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <section className="px-4 py-12 bg-white border-b border-border-subtle scroll-mt-20" id="projects">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3.5 py-1 rounded-full">
            Proof of Work
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-on-surface mt-2.5">
            Live Student & Client Projects
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl mx-auto mt-2 leading-relaxed">
            Real products built and shipped by our learners and development incubator pods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj, idx) => (
            <div
              key={proj.id || idx}
              className="bg-surface-subtle border border-border-subtle rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-primary font-bold text-[10px] uppercase px-2.5 py-1 rounded-md border border-border-subtle shadow-xs">
                  {proj.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-on-surface group-hover:text-primary transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed line-clamp-2">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {proj.technologies.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] bg-white text-slate-700 font-semibold px-2 py-0.5 rounded border border-border-subtle"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                  <button
                    onClick={() => setSelectedProject(proj)}
                    className="text-xs font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1"
                  >
                    <span>View Case Study</span>
                    <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                  </button>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {proj.statusBadge}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onEnquire={onEnquire}
      />
    </section>
  );
};
