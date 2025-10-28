import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../../lib/axios";


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
      <Text style={{ fontWeight: "bold", fontSize: 18, alignSelf: "center" }}>Informações da máquina</Text>
      {machineData ? (
        <>
          <View style={styles.dataContainer}>
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
                <TouchableOpacity
                  style={styles.fieldsContent}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={{ textAlign: "center", color: "rgba(0,0,0,0.44)", }}>
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
                      backgroundColor: "#e6e6e6",
                      borderRadius: 10,
                      padding: 20,
                      minWidth: 250,
                      maxHeight: 300
                    }}>
                      <Text style={{ fontSize: 20, marginBottom: 10 }}>Conjuntos desta máquina:</Text>

                      <ScrollView>
                        {machineData.sets.map((set: any) => (
                          <View
                            key={set.id}
                            style={{
                              padding: 10,
                              borderWidth: 1,
                              borderColor: "#e6e6e6ff",
                            }}
                          >
                            <Text style={{ fontSize: 15 }}>{set.name}</Text>
                          </View>
                        ))}
                      </ScrollView>
                      <TouchableOpacity
                        style={{ marginTop: 10, alignSelf: "center", backgroundColor: "#ce221e", padding: 5, borderRadius: 5, }}
                        onPress={() => setModalVisible(false)}
                      >
                        <Text style={{ color: "#fff" }}>Fechar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>

            </View>

            <Text style={styles.fieldsTitle}>Descrição:</Text>
            <Text style={styles.fieldsContent}>{machineData.description}</Text>

            <Text style={styles.fieldsTitle}>Localização:</Text>
            <Text style={styles.fieldsContent}>{machineData.location}</Text>

            <Text style={styles.fieldsTitle}>Temperatura:</Text>
            <Text style={styles.fieldsContent}>{machineData.temperature}</Text>


            {machineData.tasks && machineData.tasks.length > 0 ? (
              <>
                <Text style={styles.fieldsTitle}>Tarefas Pendentes</Text>

                <Link
                  href={{
                    pathname: '/(tabs)/outros/conjuntos',
                    params: { codigo: codigo } 
                  }}
                  asChild
                >
                  <TouchableOpacity >

                    <Text style={styles.fieldsContent}>
                      {`clique para realizar ${machineData.tasks.length} ${machineData.tasks.length > 1 ? "tarefas" : "tarefa"
                        }`}
                    </Text>
                  </TouchableOpacity>
                </Link>
              </>
            ) : (
              <>  
              <Text style={styles.fieldsTitle}>Nenhuma Tarefa Pendente</Text>
              </>
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
    justifyContent: "center",
    padding: 22,
  },
  dataContainer: {
    justifyContent: "space-between",
    backgroundColor: "#f1f1f1",
    borderRadius: 9,
    padding: 12,
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  }
});