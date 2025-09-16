import { Stack } from "expo-router";

export default function IndexLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} >
      <Stack.Screen name="index" options={{ title: "Inicio" }} />
      <Stack.Screen name="agenda" options={{ title: "Agenda" }} />
      <Stack.Screen name="calendario" options={{ title: "Calendario" }} />
      <Stack.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Stack.Screen name="equipes" options={{ title: "Equipes" }} />
    </Stack>
  );
}
