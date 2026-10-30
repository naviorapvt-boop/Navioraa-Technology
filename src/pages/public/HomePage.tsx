import React, { useState, useEffect } from 'react';
import {
  getHeroSlides,
  getCourses,
  getCategories,
  getWhyChooseUs,
  getServices,
  getProjects,
  getResources,
  getBlogPosts,
  getSiteSettings,
} from '../../lib/data-service';
import {
  HeroSlide,
  Course,
  CourseCategory,
  WhyChooseUsItem,
  ServiceItem,
  ProjectItem,
  ResourceItem,
  BlogPost,
  SiteSettings,
} from '../../lib/types';
import {
  INITIAL_COURSES,
  INITIAL_CATEGORIES,
  INITIAL_HERO_SLIDES,
  INITIAL_WHY_CHOOSE_US,
  INITIAL_SERVICES,
  INITIAL_PROJECTS,
  INITIAL_RESOURCES,
  INITIAL_BLOG_POSTS,
  INITIAL_SITE_SETTINGS,
} from '../../lib/seed-data';
import { HeroCarousel } from '../../components/public/HeroCarousel';
import { CourseCategoryFilter } from '../../components/public/CourseCategoryFilter';
import { CourseCard } from '../../components/public/CourseCard';
import { CourseDetailModal } from '../../components/public/CourseDetailModal';
import { WhyChooseNavioraa } from '../../components/public/WhyChooseNavioraa';
import { ServicesSection } from '../../components/public/ServicesSection';
import { ProjectsSection } from '../../components/public/ProjectsSection';
import { ResourcesSection } from '../../components/public/ResourcesSection';
import { ContactEnquirySection } from '../../components/public/ContactEnquirySection';

export const HomePage: React.FC = () => {
  // Pre-seed state so the landing page renders in 0ms without waiting for network requests
  const [slides, setSlides] = useState<HeroSlide[]>(() => INITIAL_HERO_SLIDES.map((s, i) => ({ ...s, id: `seed-slide-${i}` })));
  const [courses, setCourses] = useState<Course[]>(() => INITIAL_COURSES.map((c, i) => ({ ...c, id: `seed-course-${i}` })));
  const [categories, setCategories] = useState<CourseCategory[]>(() => INITIAL_CATEGORIES.map((cat, i) => ({ ...cat, id: `seed-cat-${i}` })));
  const [whyChooseItems, setWhyChooseItems] = useState<WhyChooseUsItem[]>(() => INITIAL_WHY_CHOOSE_US.map((item, i) => ({ ...item, id: `seed-why-${i}` })));
  const [services, setServices] = useState<ServiceItem[]>(() => INITIAL_SERVICES.map((srv, i) => ({ ...srv, id: `seed-srv-${i}` })));
  const [projects, setProjects] = useState<ProjectItem[]>(() => INITIAL_PROJECTS.map((p, i) => ({ ...p, id: `seed-proj-${i}` })));
  const [resources, setResources] = useState<ResourceItem[]>(() => INITIAL_RESOURCES.map((r, i) => ({ ...r, id: `seed-res-${i}` })));
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => INITIAL_BLOG_POSTS.map((b, i) => ({ ...b, id: `seed-blog-${i}` })));
  const [settings, setSettings] = useState<SiteSettings | null>(() => INITIAL_SITE_SETTINGS);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [audience, setAudience] = useState<'all' | 'students' | 'professionals'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enquiryCourseTitle, setEnquiryCourseTitle] = useState('');

  useEffect(() => {
    async function loadData() {
      const [
        sSlides,
        sCourses,
        sCategories,
        sWhy,
        sServices,
        sProjects,
        sResources,
        sBlog,
        sSettings,
      ] = await Promise.all([
        getHeroSlides(true),
        getCourses(true),
        getCategories(true),
        getWhyChooseUs(true),
        getServices(true),
        getProjects(true),
        getResources(true),
        getBlogPosts(true),
        getSiteSettings(),
      ]);

      setSlides(sSlides);
      setCourses(sCourses);
      setCategories(sCategories);
      setWhyChooseItems(sWhy);
      setServices(sServices);
      setProjects(sProjects);
      setResources(sResources);
      setBlogPosts(sBlog);
      setSettings(sSettings);
    }

    loadData();
  }, []);

  const handleEnquireCourse = (courseTitle: string) => {
    setEnquiryCourseTitle(courseTitle);
    const formEl = document.getElementById('enquiry-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter courses based on Category, Audience, and Search Query
  const filteredCourses = courses.filter((c) => {
    if (selectedCategory !== 'all' && c.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }

    if (audience === 'students' && (c.skillLevel === 'Advanced')) {
      return false;
    }
    if (audience === 'professionals' && c.skillLevel === 'Beginner') {
      // Keep mostly intermediate and advanced for professionals
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = c.title.toLowerCase().includes(q);
      const inDesc = c.shortDescription.toLowerCase().includes(q);
      const inTech = c.technologies.some((t) => t.toLowerCase().includes(q));
      return inTitle || inDesc || inTech;
    }

    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Carousel */}
      <HeroCarousel slides={slides} />

      {/* Courses Discovery Section (Disha-inspired) */}
      <section className="px-4 py-12 bg-white border-b border-border-subtle scroll-mt-20" id="courses-catalog">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary-soft px-3.5 py-1 rounded-full">
              Our Courses
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-on-surface mt-2.5">
              Explore Top Technology Programs
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
              Curated programs designed to build high-performance technical competence through live mentor sprints.
            </p>
          </div>

          {/* Filters */}
          <CourseCategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            audience={audience}
            onSelectAudience={setAudience}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Course Cards Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-4">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id || course.slug}
                  course={course}
                  onLearnMore={setSelectedCourse}
                  onEnquire={handleEnquireCourse}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-surface-subtle rounded-3xl border border-border-subtle">
              <span className="material-symbols-outlined text-[36px] text-slate-400">
                search_off
              </span>
              <p className="text-sm font-bold text-on-surface mt-2">No programs match your criteria</p>
              <p className="text-xs text-text-muted mt-1">Try resetting the search query or selecting "All Programs".</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setAudience('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-5 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Navioraa */}
      <WhyChooseNavioraa items={whyChooseItems} />

      {/* Enterprise Services */}
      <ServicesSection
        services={services}
        onConsult={() => handleEnquireCourse('Enterprise Software & Web Development')}
      />

      {/* Live Projects */}
      <ProjectsSection
        projects={projects}
        onEnquire={handleEnquireCourse}
      />

      {/* Learning Resources & Tech Articles */}
      <ResourcesSection
        resources={resources}
        blogPosts={blogPosts}
        onEnquire={handleEnquireCourse}
      />

      {/* Enquiry Form */}
      <ContactEnquirySection
        initialCourse={enquiryCourseTitle}
        whatsappNumber={settings?.whatsappNumber}
      />

      {/* Course Detail Modal */}
      <CourseDetailModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onEnquire={handleEnquireCourse}
      />
    </div>
  );
};
