import { useEffect } from "react";
import { router } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { InteractionManager } from "react-native";

export default function Index() {
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      router.replace("/splash");
    });

    return () => task.cancel();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'transparent' }}>
      <ActivityIndicator color="white" size="large" />
    </View>
  );
}
