import { Search } from "lucide-react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function Tarefas() {
    return (
        <View style={styles.container}>
            {/* Logo */}

            <View style={styles.header}>
                <Text style={styles.titulo}>Documentos</Text>
            </View>

            <View>
                <Search />
                <TextInput placeholder="Buscar documentos" style={styles.input} />
            </View>

            <View style={styles.filtro}>
                <Text style={styles.filtroTitulo}>Todas</Text>
                <Text style={styles.filtroTitulo}>Em análise</Text>
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
    input: {

    },
    filtro: {

    },
    filtroTitulo: {
    
    },
})