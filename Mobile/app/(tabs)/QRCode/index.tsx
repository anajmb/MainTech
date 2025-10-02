import { Text, View, Button, Modal, StyleSheet, Alert, TextInput } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera"
import React, { useState, useRef, useEffect } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { IdCard, ScanBarcode } from "lucide-react-native";

export default function QRCode() {

  const [modalIsVisible, setModalIsVisible] = useState(false)
  const [permission, requestPermission] = useCameraPermissions()
  const [idModalVisible, setIdModalVisible] = useState(false);
  const [idInput, setIdInput] = useState("");

  const qrCodeLock = useRef(false)
  const router = useRouter();

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

  function handdleQRCodeRead(data: string) {
    setModalIsVisible(false);

    let jsonData = {};
    try {
      jsonData = JSON.parse(data);
    } catch {
      // Se não for JSON, envie como string mesmo
      jsonData = { value: data };
    }

    router.push({
      pathname: "../QRCode/infoMaq",
      params: { codigo: data }
    });
  }

  useFocusEffect(
    React.useCallback(() => {
      handleOpenCamera();
    }, [])
  )

  return (
    <View style={styles.container}>
      <Modal visible={modalIsVisible} style={{ flex: 1 }} animationType="slide">
        <CameraView style={{ flex: 1 }} facing="back"
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
              <ScanBarcode size={35} color={"#d10b03"} onPress={() => { setModalIsVisible(false); router.replace("/(tabs)/QRCode/id") }} />
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
    left: 135
  },
  idCode: {
    top: -20,
    backgroundColor: "#fff",
    borderRadius: 10,
    left: 210,
    padding: 10,

  }
});