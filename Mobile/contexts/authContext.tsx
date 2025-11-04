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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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

  // 🔹 Login — limpa dados antigos antes de salvar o novo usuário
  async function login(email: string, password: string) {
    try {
      await AsyncStorage.clear(); // limpa sessão anterior

      const response = await axios.post("https://seu-backend.onrender.com/auth/login", {
        email,
        password,
      });

      const user = response.data.user;
      const token = response.data.token;

      if (!user || !token) {
        throw new Error("Login inválido — dados incompletos do servidor");
      }

      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("token", token);
      setUser(user);

      console.log("✅ Login bem-sucedido:", user.role);

    } catch (error: any) {
      console.error("LOGIN ERROR ->", error.response?.data || error.message);
      throw error;
    }
  }

  // 🔹 Logout — limpa tudo e reseta o estado
  async function logout() {
    await AsyncStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, updateUser, login, logout }}
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
