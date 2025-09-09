import SetaVoltar from "@/components/setaVoltar";
import { CircleArrowLeft, CirclePlus } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

export default function Tarefas() {
    return (
        <View style={styles.container}>
            {/* Logo */}

            <View style={styles.header}>
                <SetaVoltar/>
                <Text style={styles.titulo}>Tarefas</Text>
                <Text style={styles.subtitulo}>3 tarefas</Text>
                <CirclePlus />
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