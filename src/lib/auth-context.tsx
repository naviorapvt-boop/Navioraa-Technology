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

const BOOTSTRAP_ADMIN_EMAILS = ['naviora.pvt@gmail.com', 'shubham@navioraa.com', 'admin@navioraa.com'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminProfile = async (user: User) => {
    try {
      // Check admins doc
      const adminDocRef = doc(db, 'admins', user.uid);
      const adminSnap = await getDoc(adminDocRef);

      const isKnownBootstrapEmail = user.email ? BOOTSTRAP_ADMIN_EMAILS.includes(user.email.toLowerCase()) : false;

      if (adminSnap.exists()) {
        const data = adminSnap.data();
        const role = (data.role as Role) || (isKnownBootstrapEmail ? 'owner' : 'admin');
        setAdminProfile({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'Admin',
          role,
          photoURL: user.photoURL || undefined,
        });
      } else if (isKnownBootstrapEmail) {
        // Automatically link bootstrap admin email
        const autoProfile: AdminUser = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Owner (Shubham)',
          role: 'owner',
          photoURL: user.photoURL || undefined,
          createdAt: new Date().toISOString(),
        };
        try {
          await setDoc(adminDocRef, {
            email: user.email,
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
        setAdminProfile({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Owner',
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
    const res = await signInWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      await fetchAdminProfile(res.user);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setAdminProfile(null);
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
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
