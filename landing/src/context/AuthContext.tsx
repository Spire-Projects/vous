"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as fbUpdateProfile,
  signOut as firebaseSignOut,
  signInAnonymously,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";
import type {
  AuthContextValue,
  AuthUser,
  UserProfile,
  UserRole,
  UserAddress,
} from "@/types/auth.types";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const tokenResult = await firebaseUser.getIdTokenResult();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: (tokenResult.claims["role"] as UserRole) ?? null,
          });

          // Fetch Firestore profile
          const snap = await getDoc(doc(getFirebaseDb(), "users", firebaseUser.uid));
          if (snap.exists()) {
            const data = snap.data();
            setUserProfile({
              uid: firebaseUser.uid,
              name: data["name"] ?? firebaseUser.displayName ?? "",
              email: firebaseUser.email,
              phone: data["phone"] ?? null,
              departamento: data["departamento"] ?? null,
              birthDate: data["birthDate"] ?? null,
              address: data["address"] ?? null,
              city: data["city"] ?? null,
              addressDetails: data["addressDetails"] ?? null,
              mapsLink: data["mapsLink"] ?? null,
              addresses: (data["addresses"] as UserProfile["addresses"]) ?? [],
              role: data["role"] ?? "customer",
              createdAt: data["createdAt"]?.toDate?.()?.toISOString() ?? null,
              updatedAt: data["updatedAt"]?.toDate?.()?.toISOString() ?? null,
            });
          } else {
            setUserProfile(null);
          }
        } else {
          // Sign in anonymously so Firestore reads work for unauthenticated visitors
          try {
            await signInAnonymously(getFirebaseAuth());
          } catch {
            // Anonymous auth may be disabled in Firebase Console — that's OK
          }
          setUser(null);
          setUserProfile(null);
        }
      } catch {
        setUser(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  };

  const createAccount = async (
    name: string,
    email: string,
    password: string,
    phone?: string,
    departamento?: string
  ) => {
    const { user: newUser } = await createUserWithEmailAndPassword(
      getFirebaseAuth(),
      email,
      password
    );
    await fbUpdateProfile(newUser, { displayName: name });

    // Create Firestore user document
    await setDoc(doc(getFirebaseDb(), "users", newUser.uid), {
      uid: newUser.uid,
      name,
      email,
      phone: phone ?? null,
      departamento: departamento ?? null,
      birthDate: null,
      role: "customer",
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const updateProfile = async (
    data: Partial<
      Pick<
        UserProfile,
        | "name"
        | "phone"
        | "departamento"
        | "birthDate"
        | "address"
        | "city"
        | "addressDetails"
        | "mapsLink"
      >
    >
  ) => {
    if (!user) return;
    const ref = doc(getFirebaseDb(), "users", user.uid);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
    if (data.name) {
      const currentUser = getFirebaseAuth().currentUser;
      if (currentUser) await fbUpdateProfile(currentUser, { displayName: data.name });
    }
    setUserProfile((prev) => (prev ? { ...prev, ...data } : prev));
  };

  const updateAddresses = async (addresses: UserAddress[]) => {
    if (!user) return;
    const ref = doc(getFirebaseDb(), "users", user.uid);
    await updateDoc(ref, { addresses, updatedAt: serverTimestamp() });
    setUserProfile((prev) => (prev ? { ...prev, addresses } : prev));
  };

  const signOut = async () => {
    await firebaseSignOut(getFirebaseAuth());
    setUser(null);
    setUserProfile(null);
  };

  const isWholesaler = userProfile?.role === "wholesaler" || user?.role === "wholesaler";

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isWholesaler,
        loading,
        signIn,
        createAccount,
        updateProfile,
        updateAddresses,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
