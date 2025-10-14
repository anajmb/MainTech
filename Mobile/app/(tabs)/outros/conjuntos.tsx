import React, { useState } from "react";
import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet, Switch } from "react-native";

export default function Conjuntos() {
    const [showChecklist, setShowChecklist] = useState(false);
    const [trocar, setTrocar] = useState([false, false]);
    const [reparar, setReparar] = useState([false, false]);

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
                <TouchableOpacity
                    style={styles.opcao}
                    onPress={() => setShowChecklist(false)}
                >
                    <Text style={styles.textoVerde}>Perfeito estado</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.opcao}
                    onPress={() => setShowChecklist(true)}
                >
                    <Text style={styles.textoVermelho}>Avariado</Text>
                </TouchableOpacity>

                {showChecklist && (
                    <View style={styles.checklistContainer}>
                        <View style={styles.checklistCol}>
                            <Text style={styles.checklistTitulo}>Trocar</Text>
                            <View style={styles.checkItem}>
                                <Switch
                                    value={trocar[0]}
                                    onValueChange={v => setTrocar([v, trocar[1]])}
                                />
                                <Text style={styles.checkLabel}>Tampa</Text>
                            </View>
                            <View style={styles.checkItem}>
                                <Switch
                                    value={trocar[1]}
                                    onValueChange={v => setTrocar([trocar[0], v])}
                                />
                                <Text style={styles.checkLabel}>Filtro</Text>
                            </View>
                        </View>
                        <View style={styles.divisor} />
                        <View style={styles.checklistCol}>
                            <Text style={styles.checklistTitulo}>Reparar</Text>
                            <View style={styles.checkItem}>
                                <Switch
                                    value={reparar[0]}
                                    onValueChange={v => setReparar([v, reparar[1]])}
                                />
                                <Text style={styles.checkLabel}>Vazamentos</Text>
                            </View>
                            <View style={styles.checkItem}>
                                <Switch
                                    value={reparar[1]}
                                    onValueChange={v => setReparar([reparar[0], v])}
                                />
                                <Text style={styles.checkLabel}>Nível de óleo</Text>
                            </View>
                        </View>
                    </View>
                )}
                {showChecklist && (
                    <Text style={styles.obsCheck}>*Selecione mais de uma opção se necessário</Text>
                )}
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
        fontSize: 18,
        fontWeight: "500",
        color: "#222",
        marginBottom: 20,
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
    checklistContainer: {
        flexDirection: "row",
        width: "100%",
        marginTop: 18,
        marginBottom: 8,
        justifyContent: "center",
    },
    checklistCol: {
        flex: 1,
        alignItems: "flex-start",
        paddingHorizontal: 8,
    },
    checklistTitulo: {
        fontSize: 14,
        fontWeight: "400",
        marginBottom: 8,
        color: "#222",
        justifyContent: "center",
        marginLeft: 30,

    },
    checkItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    checkLabel: {
        fontSize: 13,
        color: "#444",
        marginLeft: 6,
    },
    divisor: {
        width: 1,
        backgroundColor: "#E0E0E0",
        marginHorizontal: 10,
    },
    obsCheck: {
        fontSize: 11,
        color: "#888",
        marginTop: 4,
        alignSelf: "flex-start",
    },
    botaoConfirmar: {
       backgroundColor: "#CE221E",
        borderRadius: 8,
        paddingVertical: 9,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        width: 230,
        alignSelf: "center",
    },
    textoBotao: {
         color: "#fff",
        fontSize: 15,
        fontWeight: "500",
    },
});