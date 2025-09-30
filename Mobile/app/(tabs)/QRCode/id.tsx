import { View } from "lucide-react-native";
import { StyleSheet, Text, TextInput } from "react-native";

export default function QRCode() {

    return (
       <View style={styles.container}>
        <Text style={styles.digiteId}>Digite o id da máquina:</Text>
        <TextInput></TextInput>
       </View> 
    )
}

const styles = StyleSheet.create({
    container: {
        
    },
    digiteId: {
        alignItems: "center"
    }
})