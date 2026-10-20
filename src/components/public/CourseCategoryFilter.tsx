import React from 'react';
import { CourseCategory } from '../../lib/types';

interface CourseCategoryFilterProps {
  categories: CourseCategory[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  audience: 'all' | 'students' | 'professionals';
  onSelectAudience: (audience: 'all' | 'students' | 'professionals') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const CourseCategoryFilter: React.FC<CourseCategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  audience,
  onSelectAudience,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Search & Audience Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Audience Segment Toggle */}
        <div className="flex items-center p-1 bg-surface-muted rounded-xl w-full md:w-auto border border-border-subtle">
          <button
            onClick={() => onSelectAudience('students')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs rounded-lg transition-all ${
              audience === 'students'
                ? 'bg-white text-primary font-bold shadow-xs'
                : 'text-on-surface-variant font-medium hover:text-primary'
            }`}
          >
            For Students & Beginners
          </button>
          <button
            onClick={() => onSelectAudience('professionals')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs rounded-lg transition-all ${
              audience === 'professionals'
                ? 'bg-white text-primary font-bold shadow-xs'
                : 'text-on-surface-variant font-medium hover:text-primary'
            }`}
          >
            For Working Professionals
          </button>
          <button
            onClick={() => onSelectAudience('all')}
            className={`flex-1 md:flex-none px-3 py-2 text-xs rounded-lg transition-all ${
              audience === 'all'
                ? 'bg-white text-primary font-bold shadow-xs'
                : 'text-on-surface-variant font-medium hover:text-primary'
            }`}
          >
            All Tracks
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search courses, skills (e.g. Python, AI)..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-border-medium bg-white text-xs text-on-surface placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills (Pill-shaped scrollable buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scroll-smooth">
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex-shrink-0 h-9 px-4 rounded-full text-xs font-semibold transition-all ${
            selectedCategory === 'all'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white text-on-surface-variant border border-border-subtle hover:bg-slate-100'
          }`}
        >
          All Programs
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id || cat.slug}
            onClick={() => onSelectCategory(cat.name)}
            className={`flex-shrink-0 h-9 px-4 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === cat.name
                ? 'bg-secondary text-white shadow-xs'
                : 'bg-white text-on-surface-variant border border-border-subtle hover:bg-slate-100'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};
