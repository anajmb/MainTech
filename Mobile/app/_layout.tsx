import { AuthProvider } from "@/contexts/authContext";
import { Stack } from "expo-router";

export default function LayoutGeral() {
  return (
    <AuthProvider>

    <Stack screenOptions={{ headerShown: false }}> </Stack>
    </AuthProvider>
  )
}