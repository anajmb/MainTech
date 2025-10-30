import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export function useAuth() {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    async function loadUser() {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }
    loadUser();
  }, []);

  async function updateUser(updatedData: Partial<UserType>) {
    if (!user) return;
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
  }

  return { user, updateUser };
}