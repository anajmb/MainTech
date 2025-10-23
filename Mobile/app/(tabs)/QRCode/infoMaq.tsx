import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../../lib/axios";
import { BleManager, Device } from 'react-native-ble-plx';
import * as ExpoDevice from 'expo-device';
import { Buffer } from 'buffer';
import {Platform, PermissionsAndroid } from "react-native";

const SERVICE_UUID = "19B10000-E8F2-537E-4F6C-D104768A1214";
const CHARACTERISTIC_UUID = "19B10001-E8F2-537E-4F6C-D104768A1214";

const manager = new BleManager();

export default function InfosMaquina() {
  const { codigo } = useLocalSearchParams();
  const info = codigo ? JSON.parse(codigo as string) : {};

  const [selectedSet, setSelectedSet] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [machineData, setMachineData] = useState<any>(null);

  const [temperature, setTemperature] = useState<string>("---");
  const [bleStatus, setBleStatus] = useState<string>("Iniciando...");

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

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      if (ExpoDevice.osApiLevel >= 31) { // Android 12+
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);
        return (granted['android.permission.BLUETOOTH_CONNECT'] === 'granted' &&
          granted['android.permission.BLUETOOTH_SCAN'] === 'granted');
      } else { // Android < 12
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return (granted === PermissionsAndroid.RESULTS.GRANTED);
      }
    }
    return true; // iOS (permissões são no info.plist)
  };

  // [NOVO] Função para se inscrever nas notificações de temperatura
  const subscribeToTemperature = (device: Device) => {
    setBleStatus("Conectado. Lendo sensor...");

    // Configura um listener para desconexão
    manager.onDeviceDisconnected(device.id, (error, disconnectedDevice) => {
      setBleStatus("Dispositivo desconectado");
      setTemperature("---");
      if (error) {
        console.log("Erro ao desconectar:", error);
      }
      // Tenta reconectar
      scanAndConnect();
    });

    // Monitora (se inscreve) na característica
    device.monitorCharacteristicForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      (error, characteristic) => {
        if (error) {
          setBleStatus(`Erro ao monitorar: ${error.message}`);
          return;
        }
        if (characteristic?.value) {
          // Decodifica o valor (vem em Base64)
          const tempString = Buffer.from(characteristic.value, 'base64').toString('ascii');
          // Formata para 2 casas decimais
          setTemperature(parseFloat(tempString).toFixed(2));
        }
      }
    );
  };

  // [NOVO] Função para escanear e conectar
  const scanAndConnect = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      setBleStatus("Permissão negada");
      return;
    }

    setBleStatus("Procurando ESP32...");
    manager.startDeviceScan([SERVICE_UUID], null, (error, device) => {
      if (error) {
        setBleStatus(`Erro no scan: ${error.message}`);
        manager.stopDeviceScan();
        return;
      }

      // Filtro opcional pelo nome (ajuste se o nome for outro)
      // if (device && device.name === "ESP32_LM35_BLE") {

      if (device) { // Conecta ao primeiro dispositivo que encontrar com o Serviço
        setBleStatus(`Encontrado: ${device.name}`);
        manager.stopDeviceScan();

        device.connect()
          .then((device) => {
            setBleStatus(`Conectando...`);
            return device.discoverAllServicesAndCharacteristics();
          })
          .then((device) => {
            subscribeToTemperature(device);
          })
          .catch((err) => {
            setBleStatus(`Erro ao conectar`);
            console.log("Erro de conexão:", err);
            // Tenta novamente após 5 segundos
            setTimeout(scanAndConnect, 5000);
          });
      }
    });
  };

  // [NOVO] useEffect para controlar o ciclo de vida do BLE
  useEffect(() => {
    // Escuta o estado do Bluetooth (ligado/desligado)
    const subscription = manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        scanAndConnect();
      } else {
        setBleStatus("Bluetooth desligado");
        setTemperature("---");
      }
    }, true);

    return () => {
      subscription.remove();
      manager.stopDeviceScan();
      // Não usamos manager.destroy() aqui para permitir reconexão
      // se o usuário navegar para outra tela e voltar.
      // Se quiser desligar totalmente, descomente:
      // manager.destroy(); 
    };
  }, [manager]);

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
            <Text style={styles.fieldsContent}>{temperature} °C</Text>

            {/* [NOVO] Status da conexão BLE (opcional, mas recomendado) */}
            <Text style={{ alignSelf: 'center', fontSize: 12, color: 'gray', marginTop: -10, marginBottom: 10 }}>
              Status BLE: {bleStatus}
            </Text>

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