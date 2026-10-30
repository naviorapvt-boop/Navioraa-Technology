import React from 'react';
import { ProjectItem } from '../../lib/types';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onEnquire: (projectTitle: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose, onEnquire }) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-border-subtle relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image Area */}
        <div className="relative h-56 w-full bg-slate-900 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-200 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full mb-1">
              {project.category} · {project.statusBadge}
            </span>
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white leading-tight">
              {project.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          <div>
            <h3 className="font-heading font-bold text-sm text-primary uppercase tracking-wider mb-2">
              Architecture & System Overview
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {project.fullCaseStudy || project.description}
            </p>
          </div>

          <div>
            <h3 className="font-heading font-bold text-sm text-primary uppercase tracking-wider mb-2">
              Technology Stack Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-surface-muted text-primary border border-border-subtle rounded-lg text-xs font-semibold"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-on-surface">Verified Proof of Work</p>
              <p className="text-[11px] text-text-muted">Developed within the Navioraa Practical Incubator</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              Production Tested
            </span>
          </div>
        </div>

        {/* Footer Actions - Requirement 4 & 6: responsive layout with concise keyword labels */}
        <div className="p-3.5 sm:p-4 border-t border-border-subtle bg-surface-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="text-[11px] text-text-muted hidden sm:block">
            <span>NAVIORAA Real-World Project Incubator</span>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-border-medium text-xs font-semibold hover:bg-slate-100 transition-colors flex items-center justify-center text-slate-700"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEnquire(`Project: ${project.title}`);
              }}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#0052FF] via-[#0066FF] to-[#00A3FF] hover:from-[#0047E0] hover:to-[#008FE6] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <span>Enquire Project</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
