"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import { app } from "./Firebase";

// ✅ Initialize Firebase Auth
const auth = getAuth(app);

// ✅ Define Context Type
interface AuthContextType {
  user: User | null;
}

// ✅ Create Context with default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Auth Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

// ✅ Custom Hook for using Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
