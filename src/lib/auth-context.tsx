import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, getDocs, collection } from 'firebase/firestore';
import { auth, db } from './firebase';
import { AdminUser, Role } from './types';

interface AuthContextType {
  currentUser: User | null;
  adminProfile: AdminUser | null;
  role: Role | null;
  isOwner: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  bootstrapOwnerAccount: (name?: string) => Promise<{ success: boolean; message: string }>;
  refreshAdminProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BOOTSTRAP_ADMIN_EMAILS = [
  'shubhammahadik3228@gmail.com',
  'naviora.pvt@gmail.com',
  'shubham@navioraa.com',
  'admin@navioraa.com'
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminProfile = async (user: User) => {
    try {
      // Check admins doc with 2500ms timeout guard
      const adminDocRef = doc(db, 'admins', user.uid);
      const adminSnap = await Promise.race([
        getDoc(adminDocRef),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Firestore getDoc timeout')), 2500))
      ]);

      const emailLower = user.email ? user.email.toLowerCase() : '';
      const isKnownBootstrapEmail = emailLower ? BOOTSTRAP_ADMIN_EMAILS.includes(emailLower) : false;

      if (adminSnap.exists()) {
        const data = adminSnap.data();
        const role = (data.role as Role) || (isKnownBootstrapEmail ? 'owner' : 'admin');
        const displayName = data.displayName || (emailLower.includes('shubham') ? 'Shubham Mahadik' : user.displayName || user.email?.split('@')[0] || 'Admin');
        setAdminProfile({
          uid: user.uid,
          email: user.email || '',
          displayName,
          role,
          photoURL: user.photoURL || undefined,
        });
      } else if (isKnownBootstrapEmail) {
        // Automatically link bootstrap admin email
        const displayName = emailLower.includes('shubham') ? 'Shubham Mahadik' : (user.displayName || 'Super Admin');
        const autoProfile: AdminUser = {
          uid: user.uid,
          email: user.email || '',
          displayName,
          role: 'owner',
          photoURL: user.photoURL || undefined,
          createdAt: new Date().toISOString(),
        };
        try {
          await setDoc(adminDocRef, {
            email: user.email,
            displayName,
            role: 'owner',
            createdAt: new Date().toISOString(),
          });
        } catch (e) {
          console.warn('Could not auto-write admin doc (permission or initial state):', e);
        }
        setAdminProfile(autoProfile);
      } else {
        setAdminProfile(null);
      }
    } catch (err) {
      console.warn('Error reading admin profile:', err);
      if (user.email && BOOTSTRAP_ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        const displayName = user.email.toLowerCase().includes('shubham') ? 'Shubham Mahadik' : 'Super Admin';
        setAdminProfile({
          uid: user.uid,
          email: user.email,
          displayName,
          role: 'owner',
        });
      } else {
        setAdminProfile(null);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchAdminProfile(user);
      } else {
        setAdminProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      await fetchAdminProfile(result.user);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const res = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      if (res.user) {
        await fetchAdminProfile(res.user);
      }
    } catch (err: any) {
      // If user does not yet exist in Firebase Auth for this project and matches bootstrap super admin
      if (
        (err?.code === 'auth/user-not-found' ||
         err?.code === 'auth/invalid-credential' ||
         err?.code === 'auth/invalid-login-credentials') &&
        (BOOTSTRAP_ADMIN_EMAILS.includes(cleanEmail) || cleanEmail === 'shubhammahadik3228@gmail.com')
      ) {
        try {
          const createRes = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
          if (createRes.user) {
            await fetchAdminProfile(createRes.user);
            return;
          }
        } catch (createErr) {
          console.warn('Auto create bootstrap user error:', createErr);
        }
      }
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setAdminProfile(null);
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim().toLowerCase());
  };

  const refreshAdminProfile = async () => {
    if (currentUser) {
      await fetchAdminProfile(currentUser);
    }
  };

  const bootstrapOwnerAccount = async (name = 'Shubham'): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) {
      return { success: false, message: 'Must be logged in to initialize owner account.' };
    }

    try {
      const adminRef = doc(db, 'admins', currentUser.uid);
      const userRef = doc(db, 'users', currentUser.uid);

      const ownerData = {
        email: currentUser.email || '',
        displayName: name,
        role: 'owner',
        createdAt: new Date().toISOString(),
      };

      await setDoc(adminRef, ownerData, { merge: true });
      await setDoc(userRef, ownerData, { merge: true });

      setAdminProfile({
        uid: currentUser.uid,
        email: currentUser.email || '',
        displayName: name,
        role: 'owner',
        photoURL: currentUser.photoURL || undefined,
      });

      return { success: true, message: `Owner account initialized for ${currentUser.email} with Super Admin role.` };
    } catch (err) {
      console.error('Bootstrap error:', err);
      return { success: false, message: err instanceof Error ? err.message : 'Bootstrap failed' };
    }
  };

  const role = adminProfile?.role || null;
  const isOwner = role === 'owner';
  const isAdmin = role === 'owner' || role === 'admin';
  const isStaff = isAdmin || role === 'editor';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        adminProfile,
        role,
        isOwner,
        isAdmin,
        isStaff,
        loading,
        loginWithGoogle,
        loginWithEmail,
        logout,
        sendPasswordReset,
        bootstrapOwnerAccount,
        refreshAdminProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
