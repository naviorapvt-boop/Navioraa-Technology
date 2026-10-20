import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../lib/auth-context';
import { AdminUser, Role } from '../../lib/types';

export const AdminUsers: React.FC = () => {
  const { isOwner, currentUser, role } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // New admin input
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<Role>('admin');
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const loadAdmins = async () => {
    try {
      const snap = await getDocs(collection(db, 'admins'));
      const list: AdminUser[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({
          uid: d.id,
          email: data.email || '',
          displayName: data.displayName || data.email?.split('@')[0] || 'Team Admin',
          role: data.role || 'admin',
          createdAt: data.createdAt,
        });
      });

      // Always ensure bootstrap owner is visible
      if (!list.some((a) => a.email.toLowerCase() === 'naviora.pvt@gmail.com')) {
        list.unshift({
          uid: 'bootstrap-owner',
          email: 'naviora.pvt@gmail.com',
          displayName: 'Shubham (Founder & CEO)',
          role: 'owner',
        });
      }

      setAdmins(list);
    } catch (err) {
      console.warn('Error reading admins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      alert('Only the Super Admin / Owner can assign new administrator roles.');
      return;
    }

    if (!newEmail.trim()) return;

    setSaving(true);
    setStatusMsg(null);
    try {
      const pseudoId = 'admin_' + newEmail.trim().replace(/[^a-zA-Z0-9]/g, '_');
      await setDoc(doc(db, 'admins', pseudoId), {
        email: newEmail.trim().toLowerCase(),
        displayName: newName.trim() || newEmail.split('@')[0],
        role: newRole,
        createdAt: new Date().toISOString(),
      });

      setStatusMsg(`Permissions granted to ${newEmail} as ${newRole.toUpperCase()}.`);
      setNewEmail('');
      setNewName('');
      await loadAdmins();
    } catch (err) {
      alert('Failed to grant role: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeRole = async (uid: string, email: string) => {
    if (!isOwner) {
      alert('Only the Owner can revoke administrative privileges.');
      return;
    }
    if (email.toLowerCase() === 'naviora.pvt@gmail.com') {
      alert('Cannot revoke primary founder / owner permissions.');
      return;
    }
    if (!window.confirm(`Revoke admin privileges for ${email}?`)) return;

    try {
      await deleteDoc(doc(db, 'admins', uid));
      await loadAdmins();
    } catch (err) {
      alert('Revoke error: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-on-surface">
          Team Access Control & Role Permissions
        </h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Attribute-Based Access Control (ABAC). Only the Owner (Shubham) has unrestricted privileges to assign roles.
        </p>
      </div>

      {statusMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Add New Admin (Owner Only) */}
      <div className="bg-white rounded-3xl p-6 border border-border-subtle shadow-2xs space-y-4">
        <h2 className="font-heading font-bold text-sm text-primary uppercase tracking-wider">
          Authorize New Team Member
        </h2>
        {isOwner ? (
          <form onSubmit={handleAddAdmin} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="sm:col-span-1">
              <label className="block font-bold text-on-surface mb-1">Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Sakshi"
                className="w-full h-10 px-3 rounded-xl border border-border-medium"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-on-surface mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="teammember@navioraa.com"
                className="w-full h-10 px-3 rounded-xl border border-border-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-on-surface mb-1">Role Permission</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as Role)}
                className="w-full h-10 px-3 rounded-xl border border-border-medium"
              >
                <option value="admin">Admin (Full Content + CRM)</option>
                <option value="editor">Editor (Content Only)</option>
                <option value="owner">Super Admin (Owner)</option>
              </select>
            </div>

            <div className="sm:col-span-4 flex justify-end pt-1">
              <button
                type="submit"
                disabled={saving}
                className="h-10 px-6 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">security</span>
                <span>{saving ? 'Granting Access...' : 'Authorize Member'}</span>
              </button>
            </div>
          </form>
        ) : (
          <p className="text-xs text-text-muted bg-surface-subtle p-3 rounded-xl border border-border-subtle">
            Only accounts with the <span className="font-bold text-secondary">Owner / Super Admin</span> role can authorize new administrators. Your current active role is: <span className="font-bold text-primary">{role?.toUpperCase()}</span>.
          </p>
        )}
      </div>

      {/* Current Authorized List */}
      <div className="bg-white rounded-3xl border border-border-subtle shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-border-subtle">
          <h2 className="font-heading font-bold text-sm text-on-surface uppercase tracking-wider">
            Active Administrative Roster
          </h2>
        </div>

        <div className="divide-y divide-border-subtle text-xs">
          {admins.map((adm) => (
            <div key={adm.uid} className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center font-extrabold">
                  {adm.displayName?.slice(0, 2).toUpperCase() || 'AD'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-on-surface text-sm">{adm.displayName}</p>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        adm.role === 'owner'
                          ? 'bg-red-100 text-red-800'
                          : adm.role === 'admin'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {adm.role === 'owner' ? 'Super Admin (Owner)' : adm.role}
                    </span>
                  </div>
                  <p className="text-text-muted text-[11px] mt-0.5">{adm.email}</p>
                </div>
              </div>

              {isOwner && adm.email.toLowerCase() !== 'naviora.pvt@gmail.com' && (
                <button
                  onClick={() => handleRevokeRole(adm.uid, adm.email)}
                  className="h-8 px-3 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 font-semibold text-xs"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
