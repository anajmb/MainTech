import SetaVoltar from "@/components/setaVoltar";
import { Plus } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

export default function Tarefas() {
    return (
        <View style={styles.container}>
            {/* Logo */}

            <View style={styles.header}>
                <SetaVoltar />
                <Text style={styles.titulo}>Tarefas</Text>
                <Text style={styles.subtitulo}>3 tarefas</Text>
                <Plus color={"#fff"} strokeWidth={1.8} size={30} style={{ backgroundColor: "#D10B03", borderRadius: "50%", padding: 8 }} />
            </View>

            <View style={styles.filtro}>
                <Text style={styles.filtroTitulo}>Todas</Text>
                <Text style={styles.filtroTitulo}>Pendentes</Text>
                <Text style={styles.filtroTitulo}>Concluídas</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        top: "8%",
    },
    header: {

    },
    titulo: {

    },
    subtitulo: {

    },
    filtro: {

    },
    filtroTitulo: {

    },
})