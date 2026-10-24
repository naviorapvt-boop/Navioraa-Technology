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
    setDownloadNotice(`Downloaded "${course.title}" Syllabus!`);
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-border-subtle"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative p-6 bg-gradient-to-r from-primary to-primary-dark text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full mb-2">
            {course.category} · {course.skillLevel}
          </span>

          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white leading-tight pr-8">
            {course.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-blue-100">
            <span className="flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              {course.duration}
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[16px]">terminal</span>
              {course.projectsCount || 4} Production Projects
            </span>
            <span className="flex items-center gap-1 font-medium text-amber-300">
              <span className="material-symbols-outlined text-[16px]">star</span>
              {course.rating || 4.9} / 5.0
            </span>
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

          {/* Learning Outcomes */}
          {course.learningOutcomes && course.learningOutcomes.length > 0 && (
            <div>
              <h3 className="font-heading font-bold text-sm text-primary uppercase tracking-wider mb-3">
                What You Will Achieve
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {course.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-on-surface">
                    <span className="material-symbols-outlined text-secondary text-[18px] flex-shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-border-subtle bg-surface-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full sm:w-auto h-11 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Download Full Syllabus</span>
          </button>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none h-11 px-4 rounded-xl border border-border-medium text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEnquire(course.title);
              }}
              className="flex-1 sm:flex-none h-11 px-5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <span>Enquire for Admission</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

