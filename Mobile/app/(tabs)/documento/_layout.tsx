import { Stack } from "expo-router";

export default function DocumentoLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Documento" }} />
    </Stack>
  );
}
