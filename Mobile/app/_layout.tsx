import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";
import { Stack, router, useSegments } from "expo-router";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const segments = useSegments(); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        setIsLoggedIn(!!token);
      } catch (e) {
        console.log("Erro ao checar autenticação:", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {

    if (isLoading) {
      return;
    }

    const inTabsGroup = segments[0] === "(tabs)";

    if (isLoggedIn && !inTabsGroup) {

      router.replace("/(tabs)"); 
    } else if (!isLoggedIn && inTabsGroup) {

      router.replace("/"); 
    }
  }, [isLoading, isLoggedIn, segments, router]); 

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>

      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="index" />

    </Stack>
  );
}