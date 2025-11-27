import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/authContext";
import ToastManager from "toastify-react-native";

export default function LayoutGeral() {
  return (
    <AuthProvider>

      <ToastManager position="bottom" duration={3000} />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}
