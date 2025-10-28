import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useAuth() {
  const [user, setUser] = useState<{ role: "ADMIN" | "INSPECTOR" | "MAINTAINER" } | null>(null);

  useEffect(() => {
    async function loadUser() {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    loadUser();
  }, []);

  return { user };
}