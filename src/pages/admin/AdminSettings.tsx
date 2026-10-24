import React, { useState, useEffect } from 'react';
import { getSiteSettings, saveSiteSettings } from '../../lib/data-service';
import { SiteSettings } from '../../lib/types';
import { useAuth } from '../../lib/auth-context';

export const AdminSettings: React.FC = () => {
  const { isOwner } = useAuth();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Email test & diagnostic state
  const [emailDiag, setEmailDiag] = useState<{
    provider: string;
    readyToSend: boolean;
    recipient: string;
    from: string;
    missingSecrets: string[];
    checks: Record<string, boolean>;
  } | null>(null);
  const [testEmailStatus, setTestEmailStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [testingEmail, setTestingEmail] = useState(false);

  const fetchEmailStatus = async () => {
    try {
      const res = await fetch('/api/email-status');
      if (res.ok) {
        const data = await res.json();
        setEmailDiag(data);
      }
    } catch (e) {
      console.warn('Could not read email diagnostics:', e);
    }
  };

  useEffect(() => {
    getSiteSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    });
    fetchEmailStatus();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSaveMessage(null);
    try {
      await saveSiteSettings(settings);
      setSaveMessage('Site settings updated and synced with public website!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      alert('Save failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    setTestEmailStatus(null);
    try {
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const noteSuffix = data.note ? ` Note: ${data.note}.` : '';
        setTestEmailStatus({
          success: true,
          message: `Live test email dispatched successfully via ${data.provider.toUpperCase()} to ${data.recipient}.${noteSuffix} (Message ID: ${data.messageId})`,
        });
      } else {
        setTestEmailStatus({
          success: false,
          message: data.error || 'Email dispatch failed. Please check provider credentials.',
        });
      }
      await fetchEmailStatus();
    } catch (err) {
      setTestEmailStatus({
        success: false,
        message: 'Could not connect to server test email endpoint. Please verify server is running.',
      });
    } finally {
      setTestingEmail(false);
    }
  };

  if (loading || !settings) {
    return <div className="p-8 text-center text-xs text-text-muted">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-on-surface">
          Global Institute & Website Settings
        </h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Configure official company branding, contact routing, WhatsApp numbers, statistics display, and email integrations.
        </p>
      </div>

      {saveMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{saveMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Identity */}
        <div className="bg-white rounded-3xl p-6 border border-border-subtle shadow-2xs space-y-4">
          <h2 className="font-heading font-bold text-sm text-primary uppercase tracking-wider">
            Brand Identity & Tagline
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-on-surface mb-1">Company Name</label>
              <input
                type="text"
                required
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-border-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-on-surface mb-1">Company Tagline</label>
              <input
                type="text"
                required
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-border-medium"
              />
            </div>
          </div>
        </div>

        {/* Contact & Inquiries Channels */}
        <div className="bg-white rounded-3xl p-6 border border-border-subtle shadow-2xs space-y-4">
          <h2 className="font-heading font-bold text-sm text-primary uppercase tracking-wider">
            Admissions & Communication Channels
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-on-surface mb-1">Official Admissions Email</label>
              <input
                type="email"
                required
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-border-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-on-surface mb-1">Primary Campus Phone</label>
              <input
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-border-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-on-surface mb-1">WhatsApp Business Number</label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="+919890187383"
                className="w-full h-10 px-3 rounded-xl border border-border-medium"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-on-surface mb-1">Campus Hubs Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-border-medium"
            />
          </div>
        </div>

        {/* Institutional Statistics Visibility (Strict Requirement) */}
        <div className="bg-white rounded-3xl p-6 border border-border-subtle shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-sm text-primary uppercase tracking-wider">
                Institutional Statistics & Metrics Display
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Per governance guidelines: fabricated numbers are hidden by default unless verified by an administrator.
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-on-surface">
              <input
                type="checkbox"
                checked={settings.stats?.showStats ?? false}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    stats: { ...(settings.stats || {}), showStats: e.target.checked },
                  })
                }
                className="w-4 h-4 text-primary rounded"
              />
              <span>Display Stats in UI</span>
            </label>
          </div>

          {settings.stats?.showStats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
              <div>
                <label className="block font-bold text-on-surface mb-1">Students Enrolled</label>
                <input
                  type="text"
                  value={settings.stats.studentsEnrolled || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      stats: { ...settings.stats!, studentsEnrolled: e.target.value },
                    })
                  }
                  className="w-full h-9 px-3 rounded-lg border border-border-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-on-surface mb-1">Active Projects</label>
                <input
                  type="text"
                  value={settings.stats.activeProjects || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      stats: { ...settings.stats!, activeProjects: e.target.value },
                    })
                  }
                  className="w-full h-9 px-3 rounded-lg border border-border-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-on-surface mb-1">Mentorship Hours</label>
                <input
                  type="text"
                  value={settings.stats.mentorshipHours || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      stats: { ...settings.stats!, mentorshipHours: e.target.value },
                    })
                  }
                  className="w-full h-9 px-3 rounded-lg border border-border-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-on-surface mb-1">Lab Sessions</label>
                <input
                  type="text"
                  value={settings.stats.labSessions || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      stats: { ...settings.stats!, labSessions: e.target.value },
                    })
                  }
                  className="w-full h-9 px-3 rounded-lg border border-border-medium"
                />
              </div>
            </div>
          )}
        </div>

        {/* Email Notification Provider Diagnostics & Testing */}
        <div className="bg-white rounded-3xl p-6 border border-border-subtle shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-sm text-primary uppercase tracking-wider">
                Email Notification Provider & Secrets
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Secure server-side email dispatch for public website admissions and project enquiries.
              </p>
            </div>
            {emailDiag && (
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  emailDiag.readyToSend
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {emailDiag.readyToSend ? `${emailDiag.provider.toUpperCase()} Ready` : 'Setup Required'}
              </span>
            )}
          </div>

          {/* Diagnostic Status Cards */}
          {emailDiag && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-surface-subtle rounded-xl border border-border-subtle">
                <span className="text-text-muted block text-[10px] font-bold uppercase">Primary Provider</span>
                <span className="font-bold text-on-surface text-sm capitalize">
                  {emailDiag.provider === 'none' ? 'None Configured' : emailDiag.provider}
                </span>
              </div>
              <div className="p-3 bg-surface-subtle rounded-xl border border-border-subtle">
                <span className="text-text-muted block text-[10px] font-bold uppercase">Notification Target</span>
                <span className="font-bold text-on-surface truncate block" title={emailDiag.recipient}>
                  {emailDiag.recipient}
                </span>
              </div>
              <div className="p-3 bg-surface-subtle rounded-xl border border-border-subtle">
                <span className="text-text-muted block text-[10px] font-bold uppercase">Sender Identity</span>
                <span className="font-bold text-on-surface truncate block" title={emailDiag.from}>
                  {emailDiag.from}
                </span>
              </div>
            </div>
          )}

          {/* Secrets Checklist Table */}
          {emailDiag && (
            <div className="p-4 bg-surface-subtle rounded-2xl border border-border-subtle space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-on-surface text-xs block">Email Routing & Provider Credentials:</span>
                <span className="text-[11px] text-text-muted">Routing: naviora.pvt@gmail.com &rarr; navioraa.technology@gmail.com</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-border-subtle">
                  <div>
                    <span className="font-mono text-slate-800 font-semibold block">SMTP_PASS / App Password</span>
                    <span className="text-[10px] text-slate-500">Google App Password for naviora.pvt@gmail.com</span>
                  </div>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${emailDiag.checks.hasSmtpPass ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {emailDiag.checks.hasSmtpPass ? 'Configured' : 'Missing'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-border-subtle">
                  <div>
                    <span className="font-mono text-slate-800 font-semibold block">RESEND_API_KEY</span>
                    <span className="text-[10px] text-slate-500">Optional alternative API provider</span>
                  </div>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${emailDiag.checks.hasResendApiKey ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {emailDiag.checks.hasResendApiKey ? 'Configured' : 'Not Set'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-border-subtle">
                  <div>
                    <span className="font-mono text-slate-800 font-semibold block">NOTIFICATION_RECIPIENT</span>
                    <span className="text-[10px] text-slate-500">Default: navioraa.technology@gmail.com</span>
                  </div>
                  <span className="font-bold px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-border-subtle">
                  <div>
                    <span className="font-mono text-slate-800 font-semibold block">EMAIL_FROM</span>
                    <span className="text-[10px] text-slate-500">Default: naviora.pvt@gmail.com</span>
                  </div>
                  <span className="font-bold px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700">
                    Active
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Test Feedback Notice */}
          {testEmailStatus && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-medium flex items-start gap-2.5 ${
                testEmailStatus.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] flex-shrink-0 mt-0.5">
                {testEmailStatus.success ? 'check_circle' : 'error'}
              </span>
              <div>
                <p className="font-bold">{testEmailStatus.success ? 'Test Successful' : 'Test Failed'}</p>
                <p className="mt-0.5 leading-relaxed">{testEmailStatus.message}</p>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-text-muted">
              Sends an immediate real ping to test provider credentials and recipient delivery.
            </span>
            <button
              type="button"
              onClick={handleTestEmail}
              disabled={testingEmail}
              className="h-10 px-5 rounded-xl border border-border-medium hover:bg-slate-50 font-bold text-xs text-primary flex items-center gap-1.5 shadow-2xs"
            >
              <span className="material-symbols-outlined text-[18px]">
                {testingEmail ? 'progress_activity' : 'send'}
              </span>
              <span>{testingEmail ? 'Testing Provider...' : 'Send Live Test Email'}</span>
            </button>
          </div>
        </div>

        {/* Submit Changes */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="h-12 px-8 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
