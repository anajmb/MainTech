import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function FazerTarefa() {
    return (
        <ScrollView style={TabsStyles.container}>
            {/* header */}
            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Tarefa</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>Detalhes da tarefa</Text>
                </View>
            </View>

            <View style={styles.todosCard}>
                <View style={styles.cardName}>
                    <Text style={styles.cardTitle}>Nome da máquina:</Text>
                    <Text style={styles.cardSubtitle}>Máquina fresadora 1</Text>
                </View>
                <View style={styles.cardMaq}>
                    <Text style={styles.titleOficina}>Oficina:</Text>
                    <Text style={styles.subOficina}>Manutenção - Principal</Text>
                </View>
                <View style={styles.cardMaq}>
                    <Text style={styles.titleConjuntos}>Conjuntos:</Text>
                    
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create ({

    todosCard: {
        gap: 30,
        paddingBottom: 90,
    },
    cardName: {
        backgroundColor: '#eeeeee',
        padding: 40,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4
    },
    cardTitle: {
         fontSize: 20,
        textAlign: "center",
        color: "#6c6c6c",
        
    },
    cardSubtitle: {
        fontSize: 25,
        textAlign: "center",
        color: "#000000",
        marginTop: 10,
        fontWeight: "bold"
    },
    cardMaq:{
        backgroundColor: '#eeeeee',
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4
    },
    titleOficina: {
        fontSize: 18,
       textAlign: "center",
       color: "#6c6c6c",
    },
    subOficina: {
        fontSize: 20,
        textAlign: "center",
        color: "#000000",
        marginTop: 10,
    },
    titleConjuntos:{
         fontSize: 18,
       textAlign: "center",
       color: "#6c6c6c",
       fontWeight: "bold"
    }
})