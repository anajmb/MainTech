import { Text, View, Button, Modal} from "react-native";
import {CameraView, useCameraPermissions} from "expo-camera"
import { useState } from "react";

export default function QRCode() {

    const [modalIsVisible, setModalIsVisible] = useState(false)
    return (
        <View>
           {/* <Button title="Ler QRCode" style={{top: 100}}  /> */}

           <Modal visible={modalIsVisible}>
            <CameraView style={{flex: 1}} facing="back" />

            <View>
              <Button onPress={() => setModalIsVisible(false)} title="Cancelar" />  
            </View>
           </Modal>
        </View>
    )
}