import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { CheckCircle } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Historico() {
    return (
        <ScrollView style={TabsStyles.container}>

            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar/>
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Histórico</Text>
                   <Text style={TabsStyles.subtituloPrincipal}>Suas atividades recentes  </Text>

                </View>

            </View>

            <View style={style.cardStats}>
                <View style={style.statsItem}>
                    <Text style={style.statsNum}>24</Text>
                    <Text style={style.statsTexto}>Hoje</Text>

                </View> 
                <View style={style.statsItem}>
                    <Text style={style.statsNum}>158</Text>
                    <Text style={style.statsTexto}>Esta semana</Text>
                </View>
                <View style={style.statsItem}>
                    <Text style={style.statsNum}>894</Text>
                    <Text style={style.statsTexto}>Total</Text>
                </View>

               
                </View>


                /* card de historico informacoes */

                <View style={style.cardHistorico}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <CheckCircle color="#6FCF97" size={28} />
                    <View style={{ flex: 1 }}>
                        <Text style={style.tituloHistorico}>Sangrador pneumático de freios</Text>
                        <Text style={style.subtituloHistorico}>Tarefa concluída</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6, gap: 8 }}>
                            <Text style={style.dataHistorico}>15/07/2025</Text>
                            <Text style={style.dataHistorico}>15:30</Text>
                        </View>
                    </View>
                    <View style={style.statusConcluido}>
                        <Text style={style.statusConcluidoText}>Concluído</Text>
                    </View>
                </View>
            </View>
            

        </ScrollView>
    )

}

const style = StyleSheet.create({
  cardStats: {
        backgroundColor: "#fff",
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 18,
        paddingHorizontal: 24,
        marginHorizontal: 8,
        marginTop: 18,
        marginBottom: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 4,
        elevation: 3,
    },
    statsItem: {
        alignItems: "center",
        flex: 1,
    },
    statsNum: {
        fontSize: 22,
        fontWeight: 400,
        color: "#CE221E",
        marginBottom: 2,
    },


    
    statsTexto: {
        fontSize: 14,
        color: "#888",
    },
    cardHistorico: {
        backgroundColor: "#F6FFF7",
        borderRadius: 16,
        padding: 18,
        marginHorizontal: 8,
        marginBottom: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 4,
        elevation: 3,
    },
    tituloHistorico: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#222",
    },
    subtituloHistorico: {
        fontSize: 14,
        color: "#888",
        marginTop: 2,
    },
    dataHistorico: {
        fontSize: 13,
        color: "#888",
    },
    statusConcluido: {
        backgroundColor: "#CE221E",
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 6,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
    },
    statusConcluidoText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "bold",
    },
});


