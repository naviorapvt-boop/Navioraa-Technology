import React, { useState } from 'react';
import { ResourceItem, BlogPost } from '../../lib/types';
import { TOPIC_NOTES, TopicNote, downloadSyllabusFile } from '../../lib/syllabus-data';
import { SyllabusModal } from './SyllabusModal';
import { ArticleReaderModal } from './ArticleReaderModal';

interface ResourcesSectionProps {
  resources: ResourceItem[];
  blogPosts: BlogPost[];
  onOpenResource?: (resource: ResourceItem) => void;
  onReadArticle?: (post: BlogPost) => void;
  onEnquire?: (courseOrTopic: string) => void;
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({
  resources,
  blogPosts,
  onOpenResource,
  onReadArticle,
  onEnquire,
}) => {
  const [selectedNote, setSelectedNote] = useState<TopicNote | null>(null);
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);
  const [downloadSuccessNote, setDownloadSuccessNote] = useState<string | null>(null);

  const findMatchingNote = (resource: ResourceItem): TopicNote => {
    const slug = resource.slug || '';
    const title = resource.title.toLowerCase();
    
    const found = TOPIC_NOTES.find((n) => 
      n.slug === slug || 
      n.id === resource.id ||
      title.includes(n.category.toLowerCase()) ||
      title.includes(n.slug.replace('-syllabus', ''))
    );

    if (found) return found;

    // Default fallback note
    return {
      id: resource.id || 'topic-custom',
      title: resource.title,
      slug: resource.slug || 'curriculum-notes',
      category: resource.category || 'Engineering',
      level: 'All Levels',
      duration: 'Comprehensive Sprints',
      fileFormat: resource.fileFormat || 'PDF / Text Guide',
      fileSize: resource.fileSize || '3.5 MB',
      description: resource.description || 'Comprehensive curriculum breakdown and practical coding lab handbook.',
      summary: resource.description || 'Hands-on technical study notes and syllabus modules prepared by NAVIORAA IT Training.',
      modules: [
        {
          moduleNumber: 1,
          title: 'Foundations, Architecture & Core Principles',
          duration: 'Module 1',
          topics: ['Core syntax & data modeling', 'Algorithmic efficiency', 'Best practices and design patterns'],
          practicalLab: 'Hands-on practical sprint with unit testing and code review.'
        },
        {
          moduleNumber: 2,
          title: 'Advanced System Engineering & APIs',
          duration: 'Module 2',
          topics: ['Enterprise services', 'Data persistence & caching', 'Production deployment setup'],
          practicalLab: 'End-to-end implementation with verified deployment.'
        }
      ],
      prerequisites: ['Basic computer familiarity', 'Enthusiasm for software development'],
      keyOutcomes: ['Write production-grade source code', 'Deploy verified software systems', 'Complete capstone project'],
      toolsAndStack: ['Git', 'VS Code', 'Modern Engineering Stack', 'Docker'],
      careerRoles: ['Software Engineer', 'Technical Specialist']
    };
  };

  const handleDownloadResource = (res: ResourceItem) => {
    const note = findMatchingNote(res);
    downloadSyllabusFile(note);
    setDownloadSuccessNote(`Downloaded "${note.title}"!`);
    setTimeout(() => setDownloadSuccessNote(null), 3000);
    onOpenResource?.(res);
  };

  const handlePreviewSyllabus = (res: ResourceItem) => {
    const note = findMatchingNote(res);
    setSelectedNote(note);
  };

  const handleOpenArticle = (post: BlogPost) => {
    if (onReadArticle) {
      onReadArticle(post);
    } else {
      setReadingPost(post);
    }
  };

  const handleEnquireTopic = (topic: string) => {
    if (onEnquire) {
      onEnquire(topic);
    } else {
      const el = document.getElementById('enquiry-form');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="px-4 py-12 bg-white border-b border-border-subtle scroll-mt-20" id="resources">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Download Success Banner */}
        {downloadSuccessNote && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2 animate-fade-in shadow-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
              <span>{downloadSuccessNote} Check your browser downloads folder.</span>
            </div>
            <button
              onClick={() => setDownloadSuccessNote(null)}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Study Notes & Course Syllabi Downloads */}
        <div>
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary-soft px-3.5 py-1 rounded-full">
              Syllabus & Topic Notes
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-on-surface mt-2.5">
              Download Course Syllabi & Study Notes
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl mx-auto mt-2 leading-relaxed">
              Inquirers and students can download official curriculum syllabi, module breakdowns, prerequisites, and developer notes directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((res, idx) => {
              const isAlt = idx % 2 === 1;
              return (
                <div
                  key={res.id || idx}
                  className="p-5 rounded-2xl bg-surface-subtle border border-border-subtle hover:border-[#0052FF]/30 hover:shadow-sm transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isAlt ? 'bg-secondary-soft text-secondary' : 'bg-primary-light text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px]">
                        {res.type === 'notes' ? 'description' : res.type === 'guide' ? 'menu_book' : 'code_blocks'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-heading font-bold text-sm sm:text-base text-on-surface group-hover:text-primary transition-colors leading-snug">
                        {res.title}
                      </h3>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {res.fileFormat} · {res.fileSize}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                    {res.description}
                  </p>

                  <div className="pt-2 border-t border-border-subtle flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-border-subtle">
                      {res.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDownloadResource(res)}
                      className="h-8 px-3.5 rounded-lg bg-gradient-to-r from-[#0052FF] to-[#0066FF] hover:from-[#0047E0] hover:to-[#0057E0] text-white font-bold text-[11px] flex items-center gap-1.5 active:scale-95 transition-all shadow-2xs"
                      title="Download official PDF syllabus"
                    >
                      <span className="material-symbols-outlined text-[15px]">download</span>
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Articles & Blog (No author names displayed per user instruction) */}
        {blogPosts && blogPosts.length > 0 && (
          <div className="pt-8 border-t border-border-subtle">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary-soft px-3 py-0.5 rounded-full">
                  Technical Knowledge Base
                </span>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-on-surface mt-2">
                  Technical Articles & Curriculum Roadmaps
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Click "Read Article" on any topic to explore architectural insights, roadmap breakdowns, and engineering concepts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {blogPosts.map((post, idx) => (
                <article
                  key={post.id || idx}
                  onClick={() => handleOpenArticle(post)}
                  className="bg-white rounded-2xl border border-border-subtle overflow-hidden shadow-xs hover:shadow-md hover:border-[#0052FF]/30 transition-all flex flex-col group cursor-pointer"
                >
                  <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 2).map((t, ti) => (
                        <span
                          key={ti}
                          className="text-[10px] font-bold text-white bg-slate-900/75 backdrop-blur-xs px-2.5 py-0.5 rounded-md shadow-xs"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <h4 className="font-heading font-bold text-base sm:text-lg text-on-surface group-hover:text-primary transition-colors leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant mt-2 leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Author names strictly removed per user prompt; clean editorial tag shown instead */}
                    <div className="flex items-center justify-between text-[11px] text-text-muted pt-3 border-t border-border-subtle">
                      <span className="flex items-center gap-1 font-medium text-slate-500">
                        <span className="material-symbols-outlined text-[14px] text-[#0052FF]">menu_book</span>
                        <span>Technical Guide · 5 Min Read</span>
                      </span>
                      <span className="font-bold text-[#0052FF] group-hover:text-[#0047E0] inline-flex items-center gap-1 transition-colors">
                        <span>Read Article</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Syllabus / Notes Viewer Modal */}
      <SyllabusModal
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
        onEnquire={handleEnquireTopic}
      />

      {/* Article Reader Modal */}
      <ArticleReaderModal
        post={readingPost}
        onClose={() => setReadingPost(null)}
        onEnquire={handleEnquireTopic}
      />
    </section>
  );
};
