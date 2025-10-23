import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Relatorio } from "./telaRelatorio";

export default function OrdemServico() {
    return (
        <ScrollView style={TabsStyles.container}>
            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Ordem de Serviço 100 - Manutenção Corretiva</Text>
                </View>
            </View>
            <Relatorio />

            <View style={styles.botoesContainer}>
                <TouchableOpacity style={styles.btnPrincipal}>
                    <Text style={styles.botaoumText}>Salvar Alterações</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSecundario}>
                    <Text style={styles.botaoText}>Rejeitar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    botoesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 25,
        marginBottom: 20,
        gap: 12,
    },
    btnPrincipal: {
    backgroundColor: '#A50702',
    borderRadius: 10, // quadrado
    paddingVertical: 10,
    width: 150, // menor
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
},
btnSecundario: {
    backgroundColor: "#C5C5C5",
    borderRadius: 10, // quadrado
    paddingVertical: 10,
    width: 150, // menor
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
},
    botaoText: {
        color: "#5C5C5C",
        fontSize: 15,
        fontWeight: "400",
    },
    botaoumText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "400",

    },
});