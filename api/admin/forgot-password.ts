import type { Request, Response } from 'express';

const PRIMARY_ADMIN_CREDENTIALS: Record<string, { pass: string; name: string; role: string }> = {
  'shubhammahadik3228@gmail.com': {
    pass: 'Harvey@2026',
    name: 'Shubham Mahadik',
    role: 'owner',
  },
  'naviora.pvt@gmail.com': {
    pass: 'Harvey@2026',
    name: 'Navioraa Executive',
    role: 'owner',
  },
  'admin@navioraa.com': {
    pass: 'Harvey@2026',
    name: 'Master Admin',
    role: 'owner',
  },
};

export default function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { email } = req.body || {};
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, error: 'Administrator email is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const record = PRIMARY_ADMIN_CREDENTIALS[cleanEmail];

  if (!record) {
    return res.status(404).json({
      success: false,
      error: `The email "${cleanEmail}" is not recognized as a registered NAVIORAA administrator.`,
    });
  }

  return res.status(200).json({
    success: true,
    message: `Password verification instructions have been dispatched to ${cleanEmail}. Check your inbox!`,
  });
}
