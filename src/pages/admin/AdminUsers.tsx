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

      // Guarantee primary super admin Shubham Mahadik is visible
      if (!list.some((a) => a.email.toLowerCase() === 'shubhammahadik3228@gmail.com')) {
        list.unshift({
          uid: 'super-admin-shubham',
          email: 'shubhammahadik3228@gmail.com',
          displayName: 'Shubham Mahadik (Founder & Super Admin)',
          role: 'owner',
        });
      }

      // Guarantee naviora.pvt@gmail.com is visible
      if (!list.some((a) => a.email.toLowerCase() === 'naviora.pvt@gmail.com')) {
        list.unshift({
          uid: 'bootstrap-owner',
          email: 'naviora.pvt@gmail.com',
          displayName: 'Naviora Pvt (Executive)',
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

      setStatusMsg(`Permissions granted to ${newEmail} as ${newRole.toUpperCase()}. They can now sign in at /admin.`);
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
    const emailLower = email.toLowerCase();
    if (emailLower === 'shubhammahadik3228@gmail.com' || emailLower === 'naviora.pvt@gmail.com') {
      alert('Cannot revoke primary founder / super admin permissions.');
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
    <div className="space-y-6 max-w-4xl text-slate-100">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-white">
          Team Access Control & Role Permissions
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Attribute-Based Access Control (ABAC). Delegate site administration, course curriculum management, and inquiry follow-ups to your team members.
        </p>
      </div>

      {statusMsg && (
        <div className="p-3.5 bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Add New Admin (Owner Only) */}
      <div className="bg-[#131926] rounded-2xl p-6 border border-slate-800/80 shadow-lg space-y-4">
        <h2 className="font-heading font-bold text-sm text-[#00E5FF] uppercase tracking-wider">
          Authorize New Team Member
        </h2>
        {isOwner ? (
          <form onSubmit={handleAddAdmin} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="sm:col-span-1">
              <label className="block font-bold text-slate-300 mb-1">Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Sakshi"
                className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:border-[#0052FF]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-300 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="teammember@navioraa.com"
                className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:border-[#0052FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Role Permission</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as Role)}
                className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:border-[#0052FF]"
              >
                <option value="admin">Admin (Full Control)</option>
                <option value="editor">Editor (Content Only)</option>
                <option value="owner">Super Admin (Owner)</option>
              </select>
            </div>

            <div className="sm:col-span-4 flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="h-10 px-6 rounded-xl bg-[#0052FF] hover:bg-[#0040CC] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-[#0052FF]/20 active:scale-98 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">security</span>
                <span>{saving ? 'Granting Access...' : 'Authorize Member'}</span>
              </button>
            </div>
          </form>
        ) : (
          <p className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            Only accounts with the <span className="font-bold text-[#00E5FF]">Super Admin / Owner</span> role can authorize new administrators. Your current active role is: <span className="font-bold text-white">{role?.toUpperCase()}</span>.
          </p>
        )}
      </div>

      {/* Current Authorized List */}
      <div className="bg-[#131926] rounded-2xl border border-slate-800/80 shadow-lg overflow-hidden">
        <div className="p-5 border-b border-slate-800/80">
          <h2 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
            Active Administrative Roster
          </h2>
        </div>

        <div className="divide-y divide-slate-800/80 text-xs">
          {admins.map((adm) => {
            const isProtected = adm.email.toLowerCase() === 'shubhammahadik3228@gmail.com' || adm.email.toLowerCase() === 'naviora.pvt@gmail.com';
            return (
              <div key={adm.uid} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 text-[#00E5FF] border border-slate-700 flex items-center justify-center font-extrabold text-xs">
                    {adm.displayName?.slice(0, 2).toUpperCase() || 'AD'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white text-sm">{adm.displayName}</p>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          adm.role === 'owner'
                            ? 'bg-[#0052FF]/20 text-[#00E5FF] border-[#0052FF]/40'
                            : adm.role === 'admin'
                            ? 'bg-purple-900/30 text-purple-300 border-purple-700/40'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {adm.role === 'owner' ? 'SUPER ADMIN (OWNER)' : adm.role?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-400 font-mono text-[11px] mt-0.5">{adm.email}</p>
                  </div>
                </div>

                {isOwner && !isProtected && (
                  <button
                    onClick={() => handleRevokeRole(adm.uid, adm.email)}
                    className="h-8 px-3 rounded-lg border border-red-900/60 hover:bg-red-950/60 text-red-400 font-semibold text-xs transition-colors"
                  >
                    Revoke
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
