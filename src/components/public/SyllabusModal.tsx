import React from 'react';
import { TopicNote, downloadSyllabusFile } from '../../lib/syllabus-data';

interface SyllabusModalProps {
  note: TopicNote | null;
  onClose: () => void;
  onEnquire: (programName: string) => void;
}

export const SyllabusModal: React.FC<SyllabusModalProps> = ({ note, onClose, onEnquire }) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!note) return null;

  const handleDownload = () => {
    downloadSyllabusFile(note);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-border-subtle relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-[#0052FF] via-[#0066FF] to-[#00A3FF] text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-100 bg-white/20 px-2.5 py-0.5 rounded-full">
              {note.category}
            </span>
            <span className="text-[11px] text-blue-100">
              {note.duration}
            </span>
          </div>

          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white leading-tight pr-8">
            {note.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-blue-100">
            <span className="flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              {note.modules.length} Intensive Modules
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              {note.level}
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[16px]">download</span>
              {note.fileFormat} ({note.fileSize})
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Overview */}
          <div>
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-primary mb-1.5">
              Curriculum Overview & Scope
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {note.description}
            </p>
          </div>

          {/* Tools & Tech Stack */}
          <div>
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-primary mb-2">
              Technologies & Frameworks Mastered
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {note.toolsAndStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-surface-muted text-primary border border-border-subtle rounded-md text-xs font-semibold"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Modules Breakdown */}
          <div>
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-primary mb-3">
              Module-by-Module Breakdown & Practical Labs
            </h3>
            <div className="space-y-3">
              {note.modules.map((mod) => (
                <div key={mod.moduleNumber} className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="font-heading font-bold text-xs sm:text-sm text-on-surface flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                        {mod.moduleNumber}
                      </span>
                      <span>{mod.title}</span>
                    </p>
                    <span className="text-[11px] font-semibold text-text-muted bg-white px-2 py-0.5 rounded border border-border-subtle">
                      {mod.duration}
                    </span>
                  </div>

                  <ul className="pl-7 space-y-1 my-2">
                    {mod.topics.map((t, ti) => (
                      <li key={ti} className="text-xs text-on-surface-variant list-disc">
                        {t}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-2.5 pt-2.5 border-t border-border-subtle/60 pl-2">
                    <p className="text-[11px] font-semibold text-primary flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-[14px] mt-0.5 text-secondary">terminal</span>
                      <span><strong>Hands-On Lab:</strong> {mod.practicalLab}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Outcomes */}
          <div>
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-primary mb-2">
              Career Competencies You Will Build
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {note.keyOutcomes.map((ko, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600 flex-shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>{ko}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          <div>
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
              Prerequisites & Setup Requirements
            </h3>
            <ul className="space-y-1 text-xs text-on-surface-variant pl-4">
              {note.prerequisites.map((p, i) => (
                <li key={i} className="list-disc">{p}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer Actions - Requirement 4 & 8: mobile-flexible layout with concise keyword labels */}
        <div className="p-3.5 sm:p-4 border-t border-border-subtle bg-surface-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full sm:w-auto h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs"
            title="Download official PDF syllabus"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Download PDF</span>
          </button>
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
                onEnquire(note.title);
              }}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#0052FF] via-[#0066FF] to-[#00A3FF] hover:from-[#0047E0] hover:to-[#008FE6] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <span>Enquire</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
