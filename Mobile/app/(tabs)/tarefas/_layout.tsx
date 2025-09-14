import { Stack } from "expo-router";

export default function TarefasLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Tarefas" }} />
      <Stack.Screen name="novaTarefa" options={{ title: "Nova Tarefa" }} />
    </Stack>
  );
}
