import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { api } from "../../../lib/axios";

export default function InfosMaquina() {
  const { codigo } = useLocalSearchParams();
  const info = codigo ? JSON.parse(codigo as string) : {};

  const [machineData, setMachineData] = useState<any>(null);

  useEffect(() => {
    async function loadMachineById() {
      if (!info.id) return;
      try {
        const res = await api.get(`/machines/getUnique/${info.id}`);
        setMachineData(res.data);
      } catch (error) {
        console.log(error);
      }
    }

    loadMachineById();
  }, [info.id]);

  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>Informações da máquina:</Text>
      {machineData ? (
        <>
          <Text>Nome: {machineData.name}</Text>
          <Text>Descrição: {machineData.description}</Text>
          <Text>Localização: {machineData.location}</Text>

          <Text style={{ marginTop: 10, fontWeight: "bold" }}>Sets:</Text>
          {machineData.sets.map((set: any) => (
            <Text key={set.id}>{set.name}</Text>
          ))}

          <Text style={{ marginTop: 10, fontWeight: "bold" }}>Tasks:</Text>
          {machineData.tasks.map((task: any) => (
            <Text key={task.id}>{task.title}</Text>
          ))}

        </>
      ) : (
        <Text>Carregando...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
});