import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Link } from "expo-router";
import { Flag } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ChavePrioridade = 'low' | 'medium' | 'high';

const prioridadeOpcao = [
    { key: 'low', label: 'Baixa', color: '#a8ceb8ff', bgColor: '#f5dbdd7c' },
    { key: 'medium', label: 'Média', color: '#f5db8fff', bgColor: '#f5dbdd7c' },
    { key: 'high', label: 'Alta', color: '#ec8c91ff', bgColor: '#f5dbdd7c' }
]

export default function FazerTarefa() {
    const [selectedPrioridade, setSelectedPrioridade] = useState<ChavePrioridade>('medium');
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

                    <TouchableOpacity style={styles.cardConjunto}>
                        {/* <Link href={'/'}/> */}
                        <Text style={styles.nameConjunto}>Unidade de Lubrificação</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cardConjunto}>
                        {/* <Link href={'/'}/> */}
                        <Text style={styles.nameConjunto}>Transmissão/Fusos Manual</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cardConjunto}>
                        {/* <Link href={'/'}/> */}
                        <Text style={styles.nameConjunto}>Sistemas de Proteção</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cardConjunto}>
                        {/* <Link href={'/'}/> */}
                        <Text style={styles.nameConjunto}>Motoredutores</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cardPrioridade}>
                    <View style={{ flexDirection: 'row' }}>
                        <Flag style={styles.flagIcon} />
                        <Text style={styles.titlePrioridade}>Prioridade:</Text>
                    </View>
                    <View style={styles.btnContainer}>
                        {prioridadeOpcao.map((option) => {
                            const isSelected = selectedPrioridade === option.key;

                            return (
                                <TouchableOpacity
                                    key={option.key}
                                    onPress={() => setSelectedPrioridade(option.key as ChavePrioridade)}
                                    style={[
                                        styles.prioridadeBtn,
                                        isSelected && {
                                            borderColor: "#00000013",
                                            backgroundColor: option.bgColor
                                        }
                                    ]}
                                >
                                    <View style={[styles.corCircle, { backgroundColor: option.color }]} />
                                    <Text style={styles.btnText}>{option.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </View>
            <TouchableOpacity>
            <View style={styles.confirmBtn}>Finalizar Checklist</View>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({

    todosCard: {
        gap: 20,
        paddingBottom: 30,
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
        color: "#0000007c",
        fontWeight: 500

    },
    cardSubtitle: {
        fontSize: 25,
        textAlign: "center",
        color: "#000000",
        marginTop: 10,
        fontWeight: 500
    },
    cardMaq: {
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
        color: "#0000007c",
        fontWeight: 500
    },
    subOficina: {
        fontSize: 15,
        textAlign: "center",
        color: "#000000",
        marginTop: 10,
        fontWeight: 500
    },
    titleConjuntos: {
        fontSize: 18,
        textAlign: "center",
        color: "#00000086",
        fontWeight: 500
    },
    cardConjunto: {
        backgroundColor: '#e6e6e6',
        padding: 20,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    nameConjunto: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: 600,
        color: "#00000065"

    },
    flagIcon: {
        width: 25,
        height: 25,
        color: '#0000007c',
        marginLeft: 10,
        marginTop: 10

    },
    titlePrioridade: {
        fontSize: 18,
        fontWeight: 500,
        color: "#0000007c",
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 20
    },
    prioridadeBtn: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        marginHorizontal: 5,
    },
    cardPrioridade: {
       backgroundColor: '#eeeeee',
        padding: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4
    },
    corCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginBottom: 8,
    },
    btnText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    confirmBtn: {
        backgroundColor: "#BF201C",
        borderRadius: 20,
        paddingVertical: 15,
        color: "#fff",
        alignSelf: "center",
        fontSize: 18,
        fontFamily: "System",
        fontWeight: "500",
        padding: 60,

    }
})