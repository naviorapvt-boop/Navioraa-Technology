import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getResources, getBlogPosts } from '../../lib/data-service';
import { ResourceItem, BlogPost } from '../../lib/types';
import { INITIAL_RESOURCES, INITIAL_BLOG_POSTS } from '../../lib/seed-data';
import { ResourcesSection } from '../../components/public/ResourcesSection';

export const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<ResourceItem[]>(() => INITIAL_RESOURCES.map((r, i) => ({ ...r, id: `seed-res-${i}` })));
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => INITIAL_BLOG_POSTS.map((b, i) => ({ ...b, id: `seed-blog-${i}` })));
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const [res, posts] = await Promise.all([getResources(true), getBlogPosts(true)]);
      setResources(res);
      setBlogPosts(posts);
    }
    load();
  }, []);

  const handleEnquire = (topic: string) => {
    navigate(`/#enquiry-form?program=${encodeURIComponent(topic)}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-b from-primary-light/50 via-white to-surface px-4 py-16 border-b border-border-subtle text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary-soft px-3.5 py-1 rounded-full">
            Technical Knowledge Base
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-on-surface mt-3">
            Downloadable Syllabi, Notes & Technical Articles
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant mt-3 leading-relaxed">
            Free developer syllabi, interview notes, starter architectures, and in-depth tech articles for students and inquirers.
          </p>
        </div>
      </section>

      <ResourcesSection
        resources={resources}
        blogPosts={blogPosts}
        onEnquire={handleEnquire}
      />
    </div>
  );
};
