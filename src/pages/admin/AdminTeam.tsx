import React, { useState, useEffect } from 'react';
import { getTeamMembers, saveTeamMember, deleteTeamMember } from '../../lib/data-service';
import { TeamMember } from '../../lib/types';

export const AdminTeam: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadTeam = async () => {
    try {
      const data = await getTeamMembers(false);
      setTeam(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingMember({
      name: '',
      role: '',
      title: 'Managing Director (MD)',
      bio: '',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      order: team.length + 1,
      published: true,
      linkedinUrl: 'https://linkedin.com',
      email: '',
    });
  };

  const handleOpenEdit = (member: TeamMember) => {
    setIsNew(false);
    setEditingMember({ ...member });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.name || !editingMember.role) {
      alert('Name and role are required.');
      return;
    }

    setSaving(true);
    try {
      await saveTeamMember(editingMember);
      setEditingMember(null);
      await loadTeam();
    } catch (err) {
      alert('Save failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete profile for ${name}?`)) return;
    try {
      await deleteTeamMember(id);
      await loadTeam();
    } catch (err) {
      alert('Delete failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-on-surface">
            Faculty & Leadership Team Management
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Manage profiles, leadership biographies, roles, photos, and public visibility for Shubham, Sakshi, and leads.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>Add Faculty Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {team.map((m, idx) => (
          <div
            key={m.id || idx}
            className="bg-white rounded-3xl p-5 border border-border-subtle shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/20 bg-slate-100">
                  <img
                    src={m.photoUrl}
                    alt={m.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-bold text-base text-on-surface">{m.name}</h3>
                  <p className="text-xs font-bold text-primary">{m.role}</p>
                  <p className="text-[11px] text-text-muted mt-0.5">{m.title}</p>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3 mb-3">
                {m.bio}
              </p>

              <div className="flex items-center gap-2 text-[11px] text-text-muted">
                <span className="font-bold text-on-surface">Order: #{m.order}</span>
                <span>·</span>
                <span className={m.published ? 'text-emerald-700 font-bold' : 'text-slate-400 font-bold'}>
                  {m.published ? 'Published' : 'Hidden'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-border-subtle mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(m)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-primary flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button
                onClick={() => handleDelete(m.id, m.name)}
                className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-600 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-border-subtle shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h2 className="font-heading font-extrabold text-lg text-on-surface">
                {isNew ? 'Add Team Member' : `Edit: ${editingMember.name}`}
              </h2>
              <button
                onClick={() => setEditingMember(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingMember.name || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface mb-1">Role Designation *</label>
                  <input
                    type="text"
                    required
                    value={editingMember.role || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                    placeholder="e.g. Founder & CEO"
                    className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Title / Governance</label>
                <input
                  type="text"
                  value={editingMember.title || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, title: e.target.value })}
                  placeholder="e.g. Managing Director (MD)"
                  className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Photo Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={editingMember.photoUrl || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, photoUrl: e.target.value })}
                    className="flex-1 h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                  />
                  {editingMember.photoUrl && (
                    <img
                      src={editingMember.photoUrl}
                      alt="Preview"
                      className="w-10 h-10 rounded-full object-cover border border-border-subtle"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Professional Biography</label>
                <textarea
                  rows={3}
                  value={editingMember.bio || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-border-medium text-xs text-on-surface resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={editingMember.linkedinUrl || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, linkedinUrl: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface mb-1">Display Sequence Order</label>
                  <input
                    type="number"
                    min={1}
                    value={editingMember.order || 1}
                    onChange={(e) => setEditingMember({ ...editingMember, order: parseInt(e.target.value) || 1 })}
                    className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface text-center font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-border-subtle">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-on-surface">
                  <input
                    type="checkbox"
                    checked={editingMember.published ?? true}
                    onChange={(e) => setEditingMember({ ...editingMember, published: e.target.checked })}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>Show in Public Leadership List</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="h-10 px-4 rounded-xl border border-border-medium font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold uppercase tracking-wider shadow-xs"
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
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
