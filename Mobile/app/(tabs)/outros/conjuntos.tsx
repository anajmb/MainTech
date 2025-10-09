import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";

export default function Conjuntos() {
    return (
        <ScrollView style={TabsStyles.container}>
            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Unidade de Lubrificação</Text>
                </View>
            </View>

            <View style={styles.cardEstado}>
                <Text style={styles.pergunta}>Qual o estado da máquina?</Text>
                <TouchableOpacity style={styles.opcao}>
                    <Text style={styles.textoVerde}>Perfeito estado</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.opcao}>
                    <Text style={styles.textoVermelho}>Avariado</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.botaoConfirmar}>
                <Text style={styles.textoBotao}>Confirmar</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    cardEstado: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
        marginHorizontal: 18,
        marginTop: 40,
        marginBottom: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 8,
        elevation: 4,
    },
    pergunta: {
        fontSize: 15,
        color: "#444",
        marginBottom: 22,
        fontWeight: "400",
    },
    opcao: {
        backgroundColor: "#EAEAEA",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 32,
        marginBottom: 12,
        width: "90%",
        alignItems: "center",
    },
    textoVerde: {
        color: "#3CB371",
        fontSize: 13,
        fontWeight: "400",
    },
    textoVermelho: {
        color: "#CE221E",
        fontSize: 13,
        fontWeight: "400",
    },
    botaoConfirmar: {
        backgroundColor: "#A82A1C",
        borderRadius: 110,
        paddingVertical: 8,
        paddingHorizontal: 60,
        alignSelf: "center",
        marginTop: 12,
        marginBottom: 20,
    },
    textoBotao: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "400",
        textAlign: "center",

    },
});