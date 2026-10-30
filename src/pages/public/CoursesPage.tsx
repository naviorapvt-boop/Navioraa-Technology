import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getCourses, getCategories } from '../../lib/data-service';
import { Course, CourseCategory } from '../../lib/types';
import { INITIAL_COURSES, INITIAL_CATEGORIES } from '../../lib/seed-data';
import { CourseCategoryFilter } from '../../components/public/CourseCategoryFilter';
import { CourseCard } from '../../components/public/CourseCard';
import { CourseDetailModal } from '../../components/public/CourseDetailModal';

export const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(() => INITIAL_COURSES.map((c, i) => ({ ...c, id: `seed-course-${i}` })));
  const [categories, setCategories] = useState<CourseCategory[]>(() => INITIAL_CATEGORIES.map((cat, i) => ({ ...cat, id: `seed-cat-${i}` })));
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [audience, setAudience] = useState<'all' | 'students' | 'professionals'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const [allCourses, allCategories] = await Promise.all([
        getCourses(true),
        getCategories(true),
      ]);
      setCourses(allCourses);
      setCategories(allCategories);

      // Check if URL has ?cat=
      const catParam = searchParams.get('cat');
      if (catParam) {
        const found = allCategories.find((c) => c.slug === catParam);
        if (found) {
          setSelectedCategory(found.name);
        }
      }
    }
    load();
  }, [searchParams]);

  const handleEnquire = (_courseTitle: string) => {
    navigate('/#enquiry-form');
  };

  const filteredCourses = courses.filter((c) => {
    if (selectedCategory !== 'all' && c.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (audience === 'students' && c.skillLevel === 'Advanced') {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.shortDescription.toLowerCase().includes(q) ||
        c.technologies.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen py-8 px-4 bg-surface-subtle">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary-soft px-3.5 py-1 rounded-full">
            Full Curriculum
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-on-surface mt-2.5">
            Industry-Ready Technology Programs
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
            All programs feature hands-on sprint reviews, real cloud deployments, and verified code repositories.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-5 rounded-3xl border border-border-subtle shadow-xs">
          <CourseCategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            audience={audience}
            onSelectAudience={setAudience}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Grid of Courses */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id || course.slug}
                course={course}
                onLearnMore={setSelectedCourse}
                onEnquire={handleEnquire}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-border-subtle">
            <span className="material-symbols-outlined text-[36px] text-slate-400">search_off</span>
            <p className="text-sm font-bold text-on-surface mt-2">No courses match your criteria</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setAudience('all');
                setSearchQuery('');
              }}
              className="mt-3 px-5 py-2 rounded-full bg-primary text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <CourseDetailModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onEnquire={handleEnquire}
      />
    </div>
  );
};
