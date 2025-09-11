import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Search } from "lucide-react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function Tarefas() {
    return (
        <View style={TabsStyles.container}>
            {/* Logo */}

            <View style={styles.header}>
                <SetaVoltar />

                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Documentos</Text>
                </View>
            </View>

            <View>
                <Search/>
                <TextInput placeholderTextColor={'#9D9D9D'} placeholder="Buscar documentos" style={styles.input} />
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
    header: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        backgroundColor: '#E6E6E6',
        padding: 10,
        position: 'relative',
        borderRadius: 10,
        textAlign: 'auto'
    },
    filtro: {

    },
    filtroTitulo: {

    },
})