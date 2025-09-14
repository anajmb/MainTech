import { Stack } from "expo-router";

export default function QrcodeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "QRCode" }} />
        
    </Stack>
  );
}
