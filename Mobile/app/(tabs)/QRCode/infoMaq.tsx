import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function InfosMaquina() {
  const { codigo } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text>Informações da máquina: {codigo}</Text>
    </View>
  );
}

const styles= StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
})