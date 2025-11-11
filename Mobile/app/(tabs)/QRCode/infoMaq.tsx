import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../../lib/axios";
import { useAuth } from "@/contexts/authContext";
import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";

interface MachineTask {
  id: number;
  title: string;
  description: string;
  inspectorId: number;
  machineId: number;
  status: string;
  expirationDate: string;
  createDate: string;
  updateDate: string;
}

interface MachineSet {
  id: number;
  name: string;
  machineId: number | null;
  createDate: string;
  updateDate: string;
}

interface Machines {
  id: number;
  name: string;
  description: string;
  location: string;
  qrCode: string;
  temperature: number | null;
  createDate: string;
  updateDate: string;
  sets: MachineSet[];   // Array de MachineSet
  tasks: MachineTask[]; // Array de MachineTask
}

export default function InfosMaquina() {
  const { user } = useAuth();
  const { codigo } = useLocalSearchParams();
  const info = codigo ? JSON.parse(codigo as string) : {};

  const [selectedSet, setSelectedSet] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [machineData, setMachineData] = useState<Machines | null>(null);

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
      <View style={TabsStyles.headerPrincipal}>
        <SetaVoltar />
        <View style={TabsStyles.conjHeaderPrincipal}>
          <Text style={TabsStyles.tituloPrincipal}>Informações da máquina</Text>
          <Text style={TabsStyles.subtituloPrincipal}>Atualize suas informações</Text>
        </View>
      </View>
      {machineData ? (
        <>
          {/* Mudei aqui: card agora segue padrão dos outros cards do app */}
          <View style={styles.cardInfoMaquina}>
            <Text style={styles.fieldsTitle}>Nome da máquina</Text>
            <Text style={styles.fieldsContent}>{machineData.name}</Text>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 1, padding: 5 }}>
              <View style={{ alignItems: "center", width: "50%" }}>
                <Text style={styles.fieldsTitle} >Ultima atualização</Text>
                <Text style={styles.fieldsContent}>
                  {new Date(machineData.updateDate).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </Text>
              </View>
              <View style={{ alignItems: "center", width: "50%" }}>
                <Text style={styles.fieldsTitle}>Conjuntos</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Text style={styles.fieldsContentInspe}>
                    {selectedSet ? selectedSet.name : `Ver conjuntos`}
                  </Text>
                </TouchableOpacity>
                <Modal
                  visible={modalVisible}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setModalVisible(false)}
                >
                  <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.3)"
                  }}>
                    <View style={{
                      backgroundColor: "#eeeeeee", // Mudei aqui: fundo branco igual aos outros cards
                      borderRadius: 16,        // Mudei aqui: borda arredondada igual aos outros cards
                      padding: 24,
                      minWidth: 270,
                      maxHeight: 340,
                      elevation: 4,
                      shadowColor: "#000",
                      shadowOpacity: 0.08,
                      shadowRadius: 8,
                    }}>
                      <Text style={{ fontSize: 20, marginBottom: 10 }}>Conjuntos desta máquina:</Text>
                      <ScrollView>
                        {machineData.sets.map((set: any) => (
                          <View
                            key={set.id}
                            style={{
                              padding: 10,
                              borderBottomWidth: 1,
                              borderColor: "#e6e6e6",
                            }}
                          >
                            <Text style={{ fontSize: 15 }}>{set.name}</Text>
                          </View>
                        ))}
                      </ScrollView>
                      <TouchableOpacity
                        style={{
                          marginTop: 16,
                          alignSelf: "center",
                          backgroundColor: "#A50702",
                          paddingVertical: 12, // aumentei a altura do botão
                          paddingHorizontal: 32, // aumentei a largura do botão
                          borderRadius: 12,
                        }}
                        onPress={() => setModalVisible(false)}
                      >
                        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Fechar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>

            <Text style={styles.fieldsTitle}>Descrição:</Text>
            <Text style={styles.fieldsContent}>{machineData.description}</Text>

            <Text style={styles.fieldsTitle}>Temperatura:</Text>
            <Text style={styles.fieldsContent}>{machineData.temperature} °C</Text>

            {machineData.tasks && machineData.tasks.length > 0 ? (
              <>
                <Text style={styles.fieldsTitle}>Tarefas Pendentes</Text>
                {user?.role === "INSPECTOR" ? (
                  <Link
                    href={{
                      pathname: '/(tabs)/tarefas/fazerTarefaInspe',
                      params: { codigo: codigo }
                    }}
                    asChild
                  >
                    <TouchableOpacity>
                      <Text style={styles.fieldsContentInspe}>
                        Clique aqui para realizar {machineData.tasks.length > 1 ? "tarefas" : "tarefa"}
                      </Text>
                    </TouchableOpacity>
                  </Link>
                ) : (
                  <View style={{ alignItems: "center" }}>
                    {machineData.tasks.map((task) => (
                      <Text key={task.id} style={styles.fieldsContent}>
                        {task.title}
                      </Text>
                    ))}
                  </View>
                )}
              </>
            ) : (
              <Text style={styles.fieldsTitle}>Nenhuma Tarefa Pendente</Text>
            )}
          </View>
        </>
      ) : (
        <Text style={{ alignSelf: "center" }}>Carregando...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    padding: 22,
  },
  cardInfoMaquina: {
    backgroundColor: "#eeeeee",
    borderRadius: 16,
    padding: 18,
    marginVertical: 12,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 4,
    elevation: 3,
  },
  fieldsTitle: {
    fontSize: 16,
    alignSelf: "center",
    marginBottom: 12,
  },
  fieldsContent: {
    backgroundColor: "#e6e6e6",
    color: "rgba(0,0,0,0.44)",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 15,
    alignSelf: "center",
    textAlign: "center",
    width: "80%",
    flexDirection: "row",
  },
  fieldsContentInspe: {
    backgroundColor: "#A50702",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 15,
    alignSelf: "center",
    textAlign: "center",
    width: "80%",
    flexDirection: "row",
  }
});
