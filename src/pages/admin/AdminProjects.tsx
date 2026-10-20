import React, { useState, useEffect } from 'react';
import { getProjects, saveProject, deleteProject } from '../../lib/data-service';
import { ProjectItem } from '../../lib/types';

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProj, setEditingProj] = useState<Partial<ProjectItem> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState('');

  const loadData = async () => {
    try {
      const data = await getProjects(false);
      setProjects(data);
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
    setEditingProj({
      title: '',
      slug: '',
      category: 'Web Application',
      description: '',
      fullCaseStudy: '',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      technologies: ['React', 'Node.js', 'PostgreSQL'],
      statusBadge: 'Production Deployed',
      externalUrl: '',
      githubUrl: '',
      featured: true,
      published: true,
      displayOrder: projects.length + 1,
    });
    setTechInput('');
  };

  const handleOpenEdit = (proj: ProjectItem) => {
    setIsNew(false);
    setEditingProj({ ...proj });
    setTechInput('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProj || !editingProj.title) return;

    setSaving(true);
    try {
      await saveProject(editingProj);
      setEditingProj(null);
      await loadData();
    } catch (err) {
      alert('Save failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete project "${title}"?`)) return;
    try {
      await deleteProject(id);
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
            Live Projects & Incubator Portfolio
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Showcase live student projects, enterprise client deliverables, and case studies.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj, idx) => (
          <div
            key={proj.id || idx}
            className="bg-white rounded-3xl border border-border-subtle shadow-2xs hover:shadow-xs transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-40 w-full bg-slate-900 overflow-hidden">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-white/95 text-primary font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-md">
                  {proj.category}
                </span>
                <span className="absolute top-3 right-3 bg-black/60 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-md">
                  {proj.statusBadge}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-heading font-bold text-base text-on-surface">{proj.title}</h3>
                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>

                <div className="flex flex-wrap gap-1 pt-2">
                  {proj.technologies.map((t, ti) => (
                    <span
                      key={ti}
                      className="text-[10px] font-semibold bg-surface-subtle text-slate-700 px-2 py-0.5 rounded border border-border-subtle"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border-subtle bg-surface-subtle flex items-center justify-between">
              <span className={`text-[11px] font-bold ${proj.published ? 'text-emerald-700' : 'text-slate-400'}`}>
                {proj.published ? 'Published' : 'Hidden'}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(proj)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-200 text-primary flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(proj.id, proj.title)}
                  className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-600 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingProj && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-border-subtle shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h2 className="font-heading font-extrabold text-lg text-on-surface">
                {isNew ? 'Add Project' : `Edit: ${editingProj.title}`}
              </h2>
              <button
                onClick={() => setEditingProj(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProj.title || ''}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setEditingProj({ ...editingProj, title, slug });
                    }}
                    className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface mb-1">Category</label>
                  <input
                    type="text"
                    value={editingProj.category || ''}
                    onChange={(e) => setEditingProj({ ...editingProj, category: e.target.value })}
                    placeholder="e.g. Mobile Health, FinTech AI"
                    className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingProj.image || ''}
                  onChange={(e) => setEditingProj({ ...editingProj, image: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingProj.description || ''}
                  onChange={(e) => setEditingProj({ ...editingProj, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-border-medium text-xs text-on-surface resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Full Case Study & Architecture</label>
                <textarea
                  rows={4}
                  value={editingProj.fullCaseStudy || ''}
                  onChange={(e) => setEditingProj({ ...editingProj, fullCaseStudy: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-border-medium text-xs text-on-surface resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Status Badge</label>
                  <input
                    type="text"
                    value={editingProj.statusBadge || 'Production Deployed'}
                    onChange={(e) => setEditingProj({ ...editingProj, statusBadge: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface mb-1">Display Sequence Order</label>
                  <input
                    type="number"
                    min={1}
                    value={editingProj.displayOrder || 1}
                    onChange={(e) => setEditingProj({ ...editingProj, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface text-center font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-border-subtle">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-on-surface">
                  <input
                    type="checkbox"
                    checked={editingProj.published ?? true}
                    onChange={(e) => setEditingProj({ ...editingProj, published: e.target.checked })}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>Published on Website</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProj(null)}
                    className="h-10 px-4 rounded-xl border border-border-medium font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold uppercase tracking-wider shadow-xs"
                  >
                    {saving ? 'Saving...' : 'Save Project'}
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
