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

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPass = String(password).trim();

  const record = PRIMARY_ADMIN_CREDENTIALS[cleanEmail];
  if (record && record.pass === cleanPass) {
    return res.status(200).json({
      success: true,
      user: {
        uid: `admin_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email: cleanEmail,
        displayName: record.name,
        role: record.role,
        photoURL: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAa_WSW8m4TWYjK86YTPjBEJw81ncR7hMWmutBNBrs_edazprH7gJ4AvsCoYPhs1XURNDk8BEqWhdJJRuhMxy-STstF8j-U6F429qxEb6L2GcjhkHp-MXiK2rVyiL1YRzZIqpl-NUVHBJinwHxnvZWJyVvRUGbB-n4sk7pKrTLLaw5H65iFU9SeniqfnXyPWAojTAplMKscGMI6MIvItz5L9qtLktxLRWv9u8urbJcoQ-oUQBCnEYZyZQ',
        token: `adm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      },
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid administrator email or password. Please verify credentials.',
  });
}
