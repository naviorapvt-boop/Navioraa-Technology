import React from 'react';
import { Course } from '../../lib/types';

interface CourseCardProps {
  course: Course;
  onLearnMore: (course: Course) => void;
  onEnquire: (courseTitle: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onLearnMore, onEnquire }) => {
  return (
    <article className="bg-white rounded-2xl border border-border-subtle overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col h-full group hover:-translate-y-1">
      {/* Thumbnail / Header Area */}
      <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="bg-white/90 backdrop-blur-md text-primary font-bold text-[11px] px-2.5 py-0.5 rounded-full shadow-xs">
            {course.skillLevel}
          </span>
          {course.featured && (
            <span className="bg-secondary text-white font-bold text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full shadow-xs">
              Featured Track
            </span>
          )}
        </div>

        {/* Category & Title Over Image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider block">
            {course.category}
          </span>
          <h3 className="font-heading font-bold text-base sm:text-lg text-white leading-tight line-clamp-1">
            {course.title}
          </h3>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
            {course.shortDescription}
          </p>

          {/* Technology Badges */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {course.technologies.slice(0, 5).map((tech, i) => (
              <span
                key={i}
                className="text-[11px] bg-surface-muted text-primary font-semibold px-2 py-0.5 rounded-md border border-border-subtle"
              >
                {tech}
              </span>
            ))}
            {course.technologies.length > 5 && (
              <span className="text-[10px] text-text-muted self-center font-medium">
                +{course.technologies.length - 5} more
              </span>
            )}
          </div>

          {/* Green What we achieve highlight - Requirement 10 */}
          {course.learningOutcomes && course.learningOutcomes[0] && (
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50/90 px-2.5 py-1.5 rounded-lg border border-emerald-200/80">
              <span className="material-symbols-outlined text-[15px] text-emerald-600 shrink-0">check_circle</span>
              <span className="line-clamp-1 font-medium text-emerald-800">
                <strong className="text-emerald-600 font-bold">What we achieve:</strong> {course.learningOutcomes[0]}
              </span>
            </div>
          )}
        </div>

        {/* Meta Info: Duration & Projects */}
        <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted">
          <span className="flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
            {course.duration || '12 Weeks'}
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[16px] text-secondary">rocket_launch</span>
            {course.projectsCount ? `${course.projectsCount} Projects` : 'Live Projects'}
          </span>
          <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs">
            <span className="material-symbols-outlined text-[14px]">star</span>
            <span>{course.rating || 4.9}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onLearnMore(course)}
            className="h-10 rounded-xl border border-border-medium hover:bg-surface-subtle text-on-surface font-semibold text-xs flex items-center justify-center transition-all active:scale-98"
          >
            Learn More
          </button>
          <button
            onClick={() => onEnquire(course.title)}
            className="h-10 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-xs flex items-center justify-center shadow-xs active:scale-98 transition-all"
          >
            Enquire Now
          </button>
        </div>
      </div>
    </article>
  );
};
