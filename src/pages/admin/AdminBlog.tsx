import React, { useState, useEffect } from 'react';
import { getBlogPosts, saveBlogPost, deleteBlogPost } from '../../lib/data-service';
import { BlogPost } from '../../lib/types';

export const AdminBlog: React.FC = () => {
  const [posts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const loadData = async () => {
    try {
      const data = await getBlogPosts(false);
      setBlogPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      author: 'NAVIORAA Technical Faculty',
      tags: ['Engineering', 'Tutorial'],
      published: true,
    });
    setTagInput('');
  };

  const handleOpenEdit = (post: BlogPost) => {
    setIsNew(false);
    setEditingPost({ ...post });
    setTagInput('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editingPost.title) return;

    setSaving(true);
    try {
      await saveBlogPost(editingPost);
      setEditingPost(null);
      await loadData();
    } catch (err) {
      alert('Save failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete post "${title}"?`)) return;
    try {
      await deleteBlogPost(id);
      await loadData();
    } catch (err) {
      alert('Delete failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-on-surface">
            Technical Articles & Blog Editorial
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Author engineering tutorials, career roadmaps, and pedagogical insights for students.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">post_add</span>
          <span>New Article</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {posts.map((post, idx) => (
          <div
            key={post.id || idx}
            className="bg-white rounded-3xl border border-border-subtle shadow-2xs hover:shadow-xs transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover opacity-90"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <span className="absolute top-3 left-3 bg-white/95 text-primary font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-md">
                  {post.tags[0] || 'Technical'}
                </span>
                <span className="absolute top-3 right-3 bg-black/60 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-md">
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-heading font-bold text-base text-on-surface">{post.title}</h3>
                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                <p className="text-[11px] text-text-muted">
                  Faculty: {post.author && !post.author.toLowerCase().includes('sakshi') && !post.author.toLowerCase().includes('sandip') ? post.author : 'NAVIORAA Technical Faculty'}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-border-subtle bg-surface-subtle flex items-center justify-between">
              <span className="text-xs text-text-muted">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(post)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-200 text-primary flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
                  className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-600 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingPost && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 border border-border-subtle shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h2 className="font-heading font-extrabold text-lg text-on-surface">
                {isNew ? 'Create Article' : `Edit: ${editingPost.title}`}
              </h2>
              <button
                onClick={() => setEditingPost(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-on-surface mb-1">Headline *</label>
                <input
                  type="text"
                  required
                  value={editingPost.title || ''}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setEditingPost({ ...editingPost, title, slug });
                  }}
                  className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Author Name</label>
                  <input
                    type="text"
                    value={editingPost.author || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={editingPost.coverImage || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Excerpt (Summary)</label>
                <textarea
                  rows={2}
                  value={editingPost.excerpt || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-border-medium text-xs text-on-surface resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Content (Markdown / Body)</label>
                <textarea
                  rows={8}
                  value={editingPost.content || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-border-medium text-xs text-on-surface font-mono resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-border-subtle">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-on-surface">
                  <input
                    type="checkbox"
                    checked={editingPost.published ?? true}
                    onChange={(e) => setEditingPost({ ...editingPost, published: e.target.checked })}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>Publish to Public Articles</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPost(null)}
                    className="h-10 px-4 rounded-xl border border-border-medium font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold uppercase tracking-wider shadow-xs"
                  >
                    {saving ? 'Saving...' : 'Save Article'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
