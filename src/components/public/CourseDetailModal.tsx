import React, { useState } from 'react';
import { Course } from '../../lib/types';
import { TOPIC_NOTES, downloadSyllabusFile } from '../../lib/syllabus-data';

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
  onEnquire: (courseTitle: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({ course, onClose, onEnquire }) => {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!course) return null;

  const handleDownload = () => {
    const slug = course.slug || '';
    const title = course.title.toLowerCase();
    const note = TOPIC_NOTES.find((n) => 
      n.slug === slug || 
      n.slug.includes(slug) || 
      title.includes(n.category.toLowerCase()) || 
      title.includes('python') && n.slug.includes('python') ||
      title.includes('mern') && n.slug.includes('mern') ||
      title.includes('ai') && n.slug.includes('ai') ||
      title.includes('data') && n.slug.includes('data')
    ) || TOPIC_NOTES[0];

    downloadSyllabusFile(note);
    setDownloadNotice(`Downloaded "${course.title}" PDF Syllabus!`);
    setTimeout(() => setDownloadNotice(null), 3000);
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
        {/* Modal Header with Course-Specific Image Banner */}
        <div className="relative min-h-[170px] sm:min-h-[200px] w-full overflow-hidden flex flex-col justify-end p-5 sm:p-6 text-white bg-slate-950">
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/35" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 border border-white/20 text-white flex items-center justify-center transition-colors z-20"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="relative z-10">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#00E5FF] bg-black/50 backdrop-blur-xs border border-white/10 px-2.5 py-0.5 rounded-full mb-2">
              {course.category} · {course.skillLevel}
            </span>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white leading-tight pr-10">
              {course.title}
            </h2>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mt-3 text-xs text-slate-200">
              <span className="flex items-center gap-1 font-medium bg-black/40 backdrop-blur-xs border border-white/10 px-2.5 py-1 rounded-lg">
                <span className="material-symbols-outlined text-[15px] text-[#00E5FF]">schedule</span>
                {course.duration}
              </span>
              <span className="flex items-center gap-1 font-medium bg-black/40 backdrop-blur-xs border border-white/10 px-2.5 py-1 rounded-lg">
                <span className="material-symbols-outlined text-[15px] text-blue-400">terminal</span>
                {course.projectsCount || 4} Production Projects
              </span>
              <span className="flex items-center gap-1 font-medium text-amber-300 bg-black/40 backdrop-blur-xs border border-white/10 px-2.5 py-1 rounded-lg">
                <span className="material-symbols-outlined text-[15px]">star</span>
                {course.rating || 4.9} / 5.0
              </span>
            </div>
          </div>
        </div>

        {/* Notice Banner */}
        {downloadNotice && (
          <div className="px-6 py-2.5 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
            <span>{downloadNotice}</span>
          </div>
        )}

        {/* Modal Content Scrollable Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Overview */}
          <div>
            <h3 className="font-heading font-bold text-sm text-primary uppercase tracking-wider mb-2">
              Program Overview
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {course.fullDescription || course.shortDescription}
            </p>
          </div>

          {/* Technologies Covered */}
          <div>
            <h3 className="font-heading font-bold text-sm text-primary uppercase tracking-wider mb-2">
              Technologies & Tools Mastered
            </h3>
            <div className="flex flex-wrap gap-2">
              {course.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-surface-muted text-primary border border-border-subtle rounded-lg text-xs font-semibold"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Detailed Syllabus */}
          {course.syllabus && course.syllabus.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-bold text-sm text-primary uppercase tracking-wider">
                  Comprehensive Curriculum Syllabus
                </h3>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="text-xs text-[#0052FF] font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">download</span>
                  <span>Download Syllabus</span>
                </button>
              </div>
              <div className="space-y-3">
                {course.syllabus.map((mod, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-surface-subtle border border-border-subtle">
                    <p className="font-bold text-xs sm:text-sm text-on-surface flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary-light text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span>{mod.title}</span>
                    </p>
                    <ul className="mt-2 pl-7 space-y-1">
                      {mod.topics.map((topic, tIdx) => (
                        <li key={tIdx} className="text-xs text-on-surface-variant list-disc">
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Outcomes - User requirement 10: green color */}
          {course.learningOutcomes && course.learningOutcomes.length > 0 && (
            <div>
              <h3 className="font-heading font-bold text-sm text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                <span>What You Will Achieve</span>
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {course.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-on-surface">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px] flex-shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span className="leading-relaxed">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions - Requirement 4: flexible on mobile, keyword buttons */}
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
              className="h-10 px-4 rounded-xl border border-border-medium text-xs font-semibold hover:bg-slate-100 transition-colors flex items-center justify-center"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEnquire(course.title);
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

