import Logo from "@/components/logo";
import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { CheckCircle } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Historico() {
    return (
        <ScrollView style={TabsStyles.container}>

            <Logo />

            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
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


            {/*card de historico informacoes */}

            <View style={style.cardHistorico}>
                <View >
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <View style={{ backgroundColor: "#E0F7EF", padding: 6, borderRadius: 50 }}>
                                <CheckCircle color="#6FCF97" size={21} />
                            </View>
                            <Text style={style.tituloHistorico}>Sangrador pneumático de freios</Text>
                        </View>
                        <Text style={style.subtituloHistorico}>Tarefa concluída</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6, gap: 8 }}>
                            <Text style={style.dataHistorico}>15/07/2025</Text>
                        </View>
                        <View>
                            <Text style={style.horaHistorico}>15:30</Text>

                        </View>
                    </View>
                </View>
                <View>
                    <Text style={style.ConcluidoText}>Concluído</Text>
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
        backgroundColor: "#fff",
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
        fontSize: 15,
        fontWeight: 400,
        color: "#222",
        marginTop: -10,
    },
    subtituloHistorico: {
        fontSize: 13,
        color: "#888",
        marginTop: -8,
        marginLeft: 51,
    },
    dataHistorico: {
        fontSize: 12,
        color: "#888",
        marginLeft: 51,
    },
    horaHistorico: {
        fontSize: 12,
        color: "#888",
        marginLeft: 115,
        marginTop: -11.5,
    },


    ConcluidoText: {
        color: "#CE221E",
        fontSize: 15,
        fontWeight: "400",
        marginLeft: 240,
    },
});


