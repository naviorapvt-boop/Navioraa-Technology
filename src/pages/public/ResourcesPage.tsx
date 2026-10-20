import React, { useState, useEffect } from 'react';
import { getResources, getBlogPosts } from '../../lib/data-service';
import { ResourceItem, BlogPost } from '../../lib/types';
import { ResourcesSection } from '../../components/public/ResourcesSection';

export const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    async function load() {
      const [res, posts] = await Promise.all([getResources(true), getBlogPosts(true)]);
      setResources(res);
      setBlogPosts(posts);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-b from-primary-light/50 via-white to-surface px-4 py-16 border-b border-border-subtle text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3.5 py-1 rounded-full">
            Knowledge Base
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-on-surface mt-3">
            Open Educational Resources & Technical Articles
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant mt-3 leading-relaxed">
            Free developer handbooks, interview cheat sheets, starter repositories, and insightful tech articles.
          </p>
        </div>
      </section>

      <ResourcesSection
        resources={resources}
        blogPosts={blogPosts}
        onOpenResource={(res) => {
          alert(`Downloading resource: ${res.title} (${res.fileFormat})`);
        }}
      />
    </div>
  );
};
