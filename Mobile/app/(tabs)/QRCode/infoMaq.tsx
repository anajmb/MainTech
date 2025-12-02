import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../../lib/axios";
import { useAuth } from "@/contexts/authContext";
import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";

// NOVA INTERFACE: Sub-conjuntos
interface Subset {
  id: number;
  name: string;
  changes: boolean;
  repairs: boolean;
}

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
  subsets: Subset[]; // Adicionado subsets
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
  sets: MachineSet[]; 
  tasks: MachineTask[];
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
        console.log("Erro ao carregar máquina:", error);
      }
    }

    loadMachineById();
  }, [info.id]);

  const pendingTasks = machineData?.tasks?.filter(task => task.status === "PENDING") || [];
  const hasPendingTasks = pendingTasks.length > 0;
  const firstPendingTask = hasPendingTasks ? pendingTasks[0] : null;

  useEffect(() => {
    if (firstPendingTask) {
        console.log("DEBUG: Tarefa PENDENTE encontrada. ID a ser enviado:", firstPendingTask.id);
    } else {
        console.log("DEBUG: Nenhuma tarefa PENDENTE encontrada para envio.");
    }
  }, [firstPendingTask]);


  let codigoComTaskId = codigo;
  if (firstPendingTask && info) {

    const updatedInfo = {
        ...info, 
        taskId: firstPendingTask.id 
    };

    codigoComTaskId = JSON.stringify(updatedInfo); 
    console.log("DEBUG: Novo 'codigo' (JSON string) com taskId:", codigoComTaskId);
  }

  return (
    <View style={styles.container}>
      <View style={TabsStyles.headerPrincipal}>
        <SetaVoltar />
        <View style={TabsStyles.conjHeaderPrincipal}>
          <Text style={TabsStyles.tituloPrincipal}>Informações da máquina</Text>
          <Text style={TabsStyles.subtituloPrincipal}>Atualize suas informações</Text>
        </View>
      </View>
      <ScrollView>
        {machineData ? (
          <>
            <View style={styles.cardInfoMaquina}>

              <View>
              <Text style={styles.fieldsTitle}>Nome da máquina</Text>
              <Text style={styles.fieldsContent}>{machineData.name}</Text>
              </View>

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
                        backgroundColor: "#eeeeee",
                        borderRadius: 16,
                        padding: 24,
                        minWidth: 270,
                        maxHeight: 340,
                        elevation: 4,
                        shadowColor: "#000",
                        shadowOpacity: 0.08,
                        shadowRadius: 8,
                      }}>
                        <Text style={{ textAlign: "center", fontSize: 20, marginBottom: 10 }}>Conjuntos desta máquina:</Text>
                        <ScrollView>
                          {machineData.sets.map((set: MachineSet) => ( 
                            <View
                              key={set.id}
                              style={{
                                padding: 10,
                                borderBottomWidth: 1,
                                borderColor: "#e6e6e6",
                              }}
                            >
                              <Text style={{ fontSize: 17 }}>{set.name}</Text>
                            </View>
                          ))}
                        </ScrollView>
                        <TouchableOpacity
                          style={{
                            marginTop: 16,
                            alignSelf: "center",
                            backgroundColor: "#A50702",
                            paddingVertical: 12,
                            paddingHorizontal: 32,
                            borderRadius: 12,
                          }}
                          onPress={() => setModalVisible(false)}
                        >
                          <Text style={{ marginBottom: -1, marginTop: -1, paddingVertical: 3, paddingHorizontal: 20, backgroundColor: "#A50702", color: "#fff", fontWeight: "400", fontSize: 16 }}>Fechar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </View>
              </View>

              <View>

              <Text style={styles.fieldsTitle}>Descrição:</Text>
              <Text style={styles.fieldsContent}>{machineData.description}</Text>
              </View>

              <View>

              <Text style={styles.fieldsTitle}>Temperatura:</Text>
              <Text style={styles.fieldsContent}>{machineData.temperature} °C</Text>
              </View>

              {hasPendingTasks ? (
                <>
                <View>
                  <Text style={styles.fieldsTitle}>Tarefas Pendentes</Text>
                  {user?.role === "INSPECTOR" ? (
                    <Link
                      href={{
                        pathname: '/(tabs)/tarefas/fazerTarefaInspe',
                        params: {
                          codigo: codigoComTaskId, 
                        }
                      }}
                      asChild
                    >
                      <TouchableOpacity>
                        <Text style={styles.fieldsContentInspe}>
                          Clique aqui para realizar {pendingTasks.length > 1 ? `as ${pendingTasks.length} tarefas` : "a tarefa"}
                        </Text>
                      </TouchableOpacity>
                    </Link>
                    
                  ) : (
                    <View style={{ alignItems: "center" }}>
                      {pendingTasks.map((task) => (
                        <Text key={task.id} style={styles.fieldsContent}>
                          {task.title}
                        </Text>
                      ))}
                    </View>
                  )}
                  </View>
                </>
              ) : (

                <Text style={styles.fieldsTitle}>Nenhuma Tarefa Pendente</Text>
              )}
            </View>
          </>
        ) : (
          <Text style={{ alignSelf: "center" }}>Carregando...</Text>
        )}
      </ScrollView>
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
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
  },
  fieldsTitle: {
    fontSize: 16,
    alignSelf: "center",
    marginBottom: 12,
    fontWeight: 'bold', 
    color: '#333',
  },
  fieldsContent: {
    backgroundColor: "#e6e6e6",
    color: "rgba(0,0,0,0.7)", 
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 15,
    alignSelf: "center",
    textAlign: "center",
    width: "80%",
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
  }
});