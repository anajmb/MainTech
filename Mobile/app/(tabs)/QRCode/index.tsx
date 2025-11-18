import { Text, View, Button, Modal, StyleSheet, Alert, TextInput } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera"
import React, { useState, useRef, useEffect } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { IdCard, Scan, ScanBarcode } from "lucide-react-native";
import { useAuth } from "@/contexts/authContext";
import { api } from "@/lib/axios";


export default function QRCode() {

  const [modalIsVisible, setModalIsVisible] = useState(false)
  const [permission, requestPermission] = useCameraPermissions()
  const [idModalVisible, setIdModalVisible] = useState(false);
  const [idInput, setIdInput] = useState("");

  const qrCodeLock = useRef(false)
  const router = useRouter();
   const { user } = useAuth();

  async function handleOpenCamera() {
    try {
      const { granted } = await requestPermission()
      if (!granted) {
        return Alert.alert("Camera", "Voce precisa habilitar o uso da camera")
      }
      setModalIsVisible(true)
      qrCodeLock.current = false
    } catch (error) {
      console.log(error)
    }
  }


 async function handdleQRCodeRead(data: string) {
  setModalIsVisible(false);

  let jsonData: any = {};
  try {
    jsonData = JSON.parse(data);
  } catch {
    jsonData = { value: data };
  }

  try {
    if (user) {
      await api.post("/history/create", {
        userId: user.id,
        entityId: jsonData.id || null, // 🔹 Agora pega o id da máquina
        entityType: "Escaneado",          // 🔹 Bate com o backend (Task, QRCode ou ServiceOrder)
        action: "Escaneou máquina",    // 🔹 Texto legível
        description: `Usuário escaneou o QR  da   ${jsonData.name || "desconhecida"}`,
      });
      console.log("Histórico registrado com sucesso!");
    } else {
      console.warn("Usuário não autenticado — histórico não registrado.");
    }
  } catch (error: any) {
    console.error("Erro ao registrar histórico:", error.response?.data || error.message);
  }

  // Continua fluxo normal
  router.push({
    pathname: "../QRCode/infoMaq",
    params: { codigo: data },
  });
}


  useFocusEffect(
    React.useCallback(() => {
      handleOpenCamera();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Modal visible={modalIsVisible} style={{ flex: 1 }} animationType="slide">
        <CameraView   style={{ flex: 1 }} facing="back"
          onBarcodeScanned={({ data }) => {
            if (data && !qrCodeLock.current) {
              qrCodeLock.current = true
              setTimeout(() => handdleQRCodeRead(data), 100)
            }
          }} />
        <View style={styles.footer}>
          <View style={styles.containerQrcode}>
            <View style={styles.buttonCancelar}>
              <Button color={'#fff'} onPress={() => { setModalIsVisible(false); router.replace("/home") }} title="Cancelar" />
            </View>
            <View style={styles.idCode}>
              <ScanBarcode strokeWidth={1.7} size={35} color={"#d10b03"} onPress={() => { setModalIsVisible(false); router.push("/(tabs)/QRCode/id") }} />
            </View>
          </View>
        </View>
      </Modal >
    </View >
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonQRCode: {
    top: 100
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 32,
    right: 32,
  },
  containerQrcode: {
    flexDirection: "row"
  },
  buttonCancelar: {
    alignItems: "center",
    left: 135,
    backgroundColor: "transparent"
  },
  idCode: {
    top: -20,
    backgroundColor: "#fff",
    borderRadius: 10,
    left: 210,
    padding: 10,

  }
});