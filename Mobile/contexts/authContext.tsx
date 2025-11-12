import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Text, View } from "react-native";

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
  loginUser: (user: any) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [ loading, setLoading ] = useState(true);

useEffect(() => {
  (async () => {
    try {
      const keepConnected = await AsyncStorage.getItem("keepConnected");
      const storedUser = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");

      if (keepConnected === "true" && storedUser && token) {
        setUser(JSON.parse(storedUser));
        console.log("Sessão restaurada automaticamente.");
      } else {
        console.log("Login automático desativado.");
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("keepConnected");
      }
    } catch (error) {
      console.error("Erro ao restaurar sessão:", error);
    } finally {
      setLoading(false); // 🔹 marca que terminou de carregar
    }
  })();
}, []);

  // 🔹 Atualiza dados locais do usuário
  async function updateUser(updatedData: Partial<UserType>) {
    if (!user) return;
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
  }


  function loginUser(user: any) {
    setUser(user);

  }

  // 🔹 Logout — limpa tudo e reseta o estado
  async function logout() {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("keepConnected");
    setUser(null);
    console.log("Logout concluído — sessão limpa manualmente.");
  }

    if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Carregando...</Text>
      </View>
    );
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
