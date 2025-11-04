import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export type UserType = {
  id: number;
  name: string;
  email: string;
  role: string;
  birthDate: string;
  cpf: string;
  phone: string;
  photo?: string;
  status?: string;
};

type AuthContextType = {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  updateUser: (data: Partial<UserType>) => Promise<void>;
  logout: () => Promise<void>;
  loginUser: (user:any) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);

  // 🔹 Carrega o usuário salvo ao iniciar
  useEffect(() => {
    (async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    })();
  }, []);

  // 🔹 Atualiza dados locais do usuário
  async function updateUser(updatedData: Partial<UserType>) {
    if (!user) return;
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
  }


  function loginUser (user:any) {
    setUser(user);

  }

  // 🔹 Logout — limpa tudo e reseta o estado
  async function logout() {
    await AsyncStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, updateUser, logout, loginUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
