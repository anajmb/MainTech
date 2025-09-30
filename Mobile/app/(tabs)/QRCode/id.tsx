import { Button } from "@react-navigation/elements";
import { View, StyleSheet, Text, TextInput } from "react-native";

export default function IdCode() {

    return (
       <View style={styles.container}>
        
         <View style={styles.card}>
        <Text style={styles.digiteId}>Id da Máquina</Text>
        <TextInput placeholder="Digite o id da máquina:" placeholderTextColor={"#6c6c6c"} style={styles.inputId}/>
        <Button color={"#fff"} style={styles.buttonOk}>Ok</Button>
         </View>
       </View> 
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
      alignItems: "center",
      justifyContent: "center" 
    },
    card: {
        backgroundColor: "#eee",
        padding: 100,
        borderRadius: 10,
        alignItems: "center",
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
    },
    digiteId: {
      top: -80,
      fontSize: 20,
      color: "#6C6C6C",
    },
    inputId: {
        backgroundColor: "#000",
        padding: 10,
        borderRadius: 10,
        bottom: 20
    },
    buttonOk: {
        backgroundColor: "#d10b03",
        borderRadius: 10,

    }
})