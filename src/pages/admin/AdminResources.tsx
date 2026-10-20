import React, { useState, useEffect } from 'react';
import { getResources, saveResource, deleteResource } from '../../lib/data-service';
import { ResourceItem } from '../../lib/types';

export const AdminResources: React.FC = () => {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRes, setEditingRes] = useState<Partial<ResourceItem> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const data = await getResources(false);
      setResources(data);
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
    setEditingRes({
      title: '',
      slug: '',
      category: 'Programming',
      type: 'notes',
      description: '',
      downloadUrl: '#',
      fileFormat: 'PDF',
      fileSize: '3.5 MB',
      displayOrder: resources.length + 1,
      published: true,
    });
  };

  const handleOpenEdit = (res: ResourceItem) => {
    setIsNew(false);
    setEditingRes({ ...res });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRes || !editingRes.title) return;

    setSaving(true);
    try {
      await saveResource(editingRes);
      setEditingRes(null);
      await loadData();
    } catch (err) {
      alert('Save failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete resource "${title}"?`)) return;
    try {
      await deleteResource(id);
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
            Student Learning Resources & Notes
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Manage downloadable cheat sheets, PDF lab guides, starter boilerplates, and interview preparation notes.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">upload_file</span>
          <span>Add Resource</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {resources.map((res, idx) => (
          <div
            key={res.id || idx}
            className="bg-white rounded-3xl p-5 border border-border-subtle shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">
                    {res.type === 'notes' ? 'description' : res.type === 'guide' ? 'download_for_offline' : 'code_blocks'}
                  </span>
                </span>
                <div>
                  <h3 className="font-heading font-bold text-sm text-on-surface">{res.title}</h3>
                  <p className="text-[11px] text-text-muted">{res.fileFormat} · {res.fileSize}</p>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-2">
                {res.description}
              </p>

              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                res.published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {res.published ? 'Live Download' : 'Draft'}
              </span>
            </div>

            <div className="pt-4 border-t border-border-subtle mt-4 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Order: #{res.displayOrder}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(res)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 text-primary flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(res.id, res.title)}
                  className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-600 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingRes && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-border-subtle shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h2 className="font-heading font-extrabold text-lg text-on-surface">
                {isNew ? 'Add Learning Resource' : `Edit: ${editingRes.title}`}
              </h2>
              <button
                onClick={() => setEditingRes(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-on-surface mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  value={editingRes.title || ''}
                  onChange={(e) => setEditingRes({ ...editingRes, title: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Type</label>
                  <select
                    value={editingRes.type || 'notes'}
                    onChange={(e) => setEditingRes({ ...editingRes, type: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                  >
                    <option value="notes">Study Notes & Cheatsheets</option>
                    <option value="guide">Lab & Setup Guide</option>
                    <option value="boilerplate">GitHub Starter Code</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-on-surface mb-1">Category</label>
                  <input
                    type="text"
                    value={editingRes.category || 'Programming'}
                    onChange={(e) => setEditingRes({ ...editingRes, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">File Format</label>
                  <input
                    type="text"
                    value={editingRes.fileFormat || 'PDF'}
                    onChange={(e) => setEditingRes({ ...editingRes, fileFormat: e.target.value })}
                    placeholder="PDF, ZIP, Git"
                    className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface mb-1">File Size</label>
                  <input
                    type="text"
                    value={editingRes.fileSize || '3.5 MB'}
                    onChange={(e) => setEditingRes({ ...editingRes, fileSize: e.target.value })}
                    placeholder="e.g. 3.5 MB"
                    className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Download / External File URL</label>
                <input
                  type="text"
                  value={editingRes.downloadUrl || '#'}
                  onChange={(e) => setEditingRes({ ...editingRes, downloadUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingRes.description || ''}
                  onChange={(e) => setEditingRes({ ...editingRes, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-border-medium text-xs text-on-surface resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-border-subtle">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-on-surface">
                  <input
                    type="checkbox"
                    checked={editingRes.published ?? true}
                    onChange={(e) => setEditingRes({ ...editingRes, published: e.target.checked })}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>Published & Downloadable</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingRes(null)}
                    className="h-10 px-4 rounded-xl border border-border-medium font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold uppercase tracking-wider shadow-xs"
                  >
                    {saving ? 'Saving...' : 'Save Resource'}
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
