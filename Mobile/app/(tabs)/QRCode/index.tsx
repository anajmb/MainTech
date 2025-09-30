import { Text, View, Button, Modal, StyleSheet, Alert} from "react-native";
import {CameraView, useCameraPermissions} from "expo-camera"
import { useState, useRef } from "react";
import { useRouter } from "expo-router";

export default function QRCode() {

    const [modalIsVisible, setModalIsVisible] = useState(false)
    const [permission, requestPermission] = useCameraPermissions()

    const qrCodeLock = useRef(false)
    const router = useRouter();

     async function handleOpenCamera() {
      try {
        const { granted } = await requestPermission()
        if(!granted) {
          return Alert.alert("Camera", "Voce precisa habilitar o uso da camera")
        }


        setModalIsVisible(true)
        qrCodeLock.current = false
      } catch (error) {
        console.log(error)
      }
    }

    // function handdleQRCodeRead(data: string) {
    //   setModalIsVisible(false)
    //   Alert.alert("QRCode", `O código lido foi: ${data}`)
    // }
    function handdleQRCodeRead(data: string) {
  setModalIsVisible(false);
  router.push({
    pathname: "/QRCode/infoMaq",
    params: { codigo: data }
  });
}
    
    return (
        <View style={styles.container}>
            <Button title="Ler QRCode" onPress={handleOpenCamera}/> 

           <Modal visible={modalIsVisible} style={{flex: 1}} animationType="slide">
            <CameraView style={{flex: 1}} facing="back"
             onBarcodeScanned={({ data}) => {
              if (data && !qrCodeLock.current) {
                qrCodeLock.current = true
                setTimeout(() => handdleQRCodeRead(data), 1000)
             }}}/>

            <View style={styles.footer}>
              <Button onPress={() => setModalIsVisible(false)} title="Cancelar" />  
            </View>
           </Modal>
        </View>
    )
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff"
    },
    buttonQRCode: {
      top: 100
    },
    footer: {
      position: "absolute",
      bottom: 32,
      left: 32,
      right: 32,
    }
  });