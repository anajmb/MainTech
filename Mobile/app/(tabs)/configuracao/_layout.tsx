import { Stack } from "expo-router";

export default function ConfiguracaoLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Configurações" }} />
      <Stack.Screen name="editarPerfil" options={{ title: "Editar Perfil" }} />
      <Stack.Screen name="privacidade" options={{ title: "Privacidade" }} />
    </Stack>
  );
}
