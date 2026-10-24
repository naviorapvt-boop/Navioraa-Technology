import React from 'react';
import { ResourceItem, BlogPost } from '../../lib/types';

interface ResourcesSectionProps {
  resources: ResourceItem[];
  blogPosts: BlogPost[];
  onOpenResource: (resource: ResourceItem) => void;
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({
  resources,
  blogPosts,
  onOpenResource,
}) => {
  return (
    <section className="px-4 py-12 bg-white border-b border-border-subtle scroll-mt-20" id="resources">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Study Notes & Guides */}
        <div>
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3.5 py-1 rounded-full">
              Open Source & Starters
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-on-surface mt-2.5">
              Student Learning Resources & Starters
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl mx-auto mt-2 leading-relaxed">
              Accelerate your engineering journey with free downloadable cheat sheets, setup guides, and project templates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {resources.map((res, idx) => {
              const isAlt = idx % 2 === 1;
              return (
                <div
                  key={res.id || idx}
                  className="p-5 rounded-2xl bg-surface-subtle border border-border-subtle hover:border-border-medium hover:shadow-xs transition-all flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isAlt ? 'bg-secondary-soft text-secondary' : 'bg-primary-light text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px]">
                        {res.type === 'notes' ? 'description' : res.type === 'guide' ? 'download_for_offline' : 'code_blocks'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-heading font-bold text-sm sm:text-base text-on-surface">
                        {res.title}
                      </h3>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {res.fileFormat} · {res.fileSize}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {res.description}
                  </p>

                  <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-border-subtle">
                      {res.category}
                    </span>
                    <button
                      onClick={() => onOpenResource(res)}
                      className="h-9 px-4 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs"
                    >
                      <span>Get Resource</span>
                      <span className="material-symbols-outlined text-[15px]">download</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Articles & Blog */}
        {blogPosts && blogPosts.length > 0 && (
          <div className="pt-8 border-t border-border-subtle">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary-soft px-3 py-0.5 rounded-full">
                  Editorial & Insights
                </span>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-on-surface mt-2">
                  Technical Knowledge & Insights
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {blogPosts.map((post, idx) => (
                <article
                  key={post.id || idx}
                  className="bg-white rounded-2xl border border-border-subtle overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                >
                  <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {post.tags.slice(0, 2).map((t, ti) => (
                          <span
                            key={ti}
                            className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <h4 className="font-heading font-bold text-base sm:text-lg text-on-surface group-hover:text-primary transition-colors leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant mt-2 leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-text-muted pt-3 border-t border-border-subtle">
                      <span>By {post.author}</span>
                      <span className="font-semibold text-primary">Read Article →</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
