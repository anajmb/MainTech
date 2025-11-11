import { useLocalSearchParams, useRouter, Link } from "expo-router"; // Adicionado Link
import React, { useEffect, useState } from "react";
import { api } from "../../../lib/axios";

import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Flag } from "lucide-react-native";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

// --- Interfaces (Mantenha todas) ---
interface MachineTask {
    id: number;
    title: string;
    description: string;
    inspectorId: number;
    machineId: number;
    status: string;
    expirationDate: string;
    createDate: string;
    updateDate: string;
}

interface SubSet {
    id: number;
    name: string;
    changes: boolean;
    repairs: boolean;
}

interface MachineSet {
    id: number;
    name: string;
    machineId: number | null;
    createDate: string;
    updateDate: string;
    subsets: SubSet[];
}

interface Machines {
    id: number;
    name: string;
    description: string;
    location: string;
    qrCode: string;
    temperature: number | null;
    createDate: string;
    updateDate: string;
    sets: MachineSet[];
    tasks: MachineTask[];
    // Adicionei a oficina para bater com a imagem
    office?: string;
}

// --- Constantes ---
type ChavePrioridade = 'low' | 'medium' | 'high';

const prioridadeOpcao = [
    { key: 'low', label: 'Baixa', color: '#a8ceb8ff', bgColor: '#f5dbdd7c' },
    { key: 'medium', label: 'Média', color: '#f5db8fff', bgColor: '#f5dbdd7c' },
    { key: 'high', label: 'Alta', color: '#ec8c91ff', bgColor: '#f5dbdd7c' }
]

export default function FazerTarefa() {
    // --- Hooks ---
    // 'codigo' é o param inicial para carregar
    // 'updatedSelections' é o que recebemos DE VOLTA da página de inspeção
    const { codigo, updatedSelections } = useLocalSearchParams<{ codigo: string; updatedSelections?: string }>();
    const router = useRouter();

    // --- States ---
    const [machineData, setMachineData] = useState<Machines | null>(null);
    const [loading, setLoading] = useState(true);

    // !! ESTADO PRINCIPAL: Armazena os resultados de todas as inspeções !!
    const [selectionsBySet, setSelectionsBySet] = useState<
        Record<number, { changes: number[]; repairs: number[] }>
    >({});

    const [selectedPrioridade, setSelectedPrioridade] = useState<ChavePrioridade>('medium');

    // 1. Efeito para carregar os dados da máquina (só na primeira vez)
    useEffect(() => {
        async function loadMachineById() {
            if (!codigo) {
                setLoading(false);
                return;
            }
            try {
                const info = JSON.parse(codigo as string);
                if (!info.id) {
                    setLoading(false);
                    return;
                }
                const res = await api.get(`/machines/getUnique/${info.id}`);
                setMachineData(res.data || null);
            } catch (error) {
                console.log(error);
                Alert.alert("Erro", "Falha ao carregar dados da máquina.");
            } finally {
                setLoading(false);
            }
        }

        if (machineData && updatedSelections) {
            setLoading(false);
        }
        // Se NÃO temos os dados (primeira carga), buscamos na API.
        else if (!machineData) {
            loadMachineById();
        }

    }, [codigo, updatedSelections, machineData]);

    // 2. Efeito para ATUALIZAR o estado quando voltamos da página de inspeção
    useEffect(() => {
        if (updatedSelections) {
            try {
                // Atualiza o estado local com os dados que vieram da outra página
                const selections = JSON.parse(updatedSelections);
                setSelectionsBySet(selections);
            } catch (e) {
                console.error("Falha ao atualizar seleções:", e);
            }
        }
    }, [updatedSelections]);

    // --- Handler de Envio Final ---
    async function handleConfirm() {
        if (!machineData) return;

        // 1. Monta o payload final.
        // O 'selectionsBySet' já está 100% atualizado
        const result: {
            machineId: number;
            setId: number;
            subsetId: number;
            action: "change" | "repair";
        }[] = [];

        Object.keys(selectionsBySet).forEach((setIdStr) => {
            const setId = Number(setIdStr);
            const sel = selectionsBySet[setId];
            sel?.changes.forEach((subsetId) =>
                result.push({ machineId: machineData.id, setId, subsetId, action: "change" })
            );
            sel?.repairs.forEach((subsetId) =>
                result.push({ machineId: machineData.id, setId, subsetId, action: "repair" })
            );
        });

        // Validação: Checa se todos os conjuntos foram inspecionados
        if (Object.keys(selectionsBySet).length !== machineData.sets.length) {
            Alert.alert("Atenção", "Você precisa inspecionar todos os conjuntos antes de finalizar.");
            return;
        }

        console.log("Enviando:", {
            machineId: machineData.id,
            machineName: machineData.name, // <-- MUDANÇA MÍNIMA AQUI
            priority: selectedPrioridade,
            payload: result,
        });

        // 2. Envia para o backend
        try {
            // ATENÇÃO: Verifique o endpoint da sua API
            const res = await api.post("/serviceOrders/create", {
                machineId: machineData.id,
                machineName: machineData.name, // <-- MUDANÇA MÍNIMA AQUI
                priority: selectedPrioridade,
                payload: result,
            });

            Alert.alert("Sucesso", res.data?.msg || "Inspeção enviada com sucesso.");
            router.back();

        } catch (error: any) {
            console.log("Erro ao enviar:", error?.response ?? error);
            Alert.alert("Erro", error.response?.data?.msg || "Falha ao enviar dados.");
        }
    }

    // --- Render Loading / Error ---
    if (loading) {
        return (
            <View style={[TabsStyles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#ce221e" />
                <Text style={{ marginTop: 10 }}>Carregando...</Text>
            </View>
        );
    }

    if (!machineData) {
        return (
            <View style={[TabsStyles.container, styles.loadingContainer]}>
                <Text>Máquina não encontrada.</Text>
            </View>
        );
    }

    // --- Render Principal ---
    const sets = machineData.sets || [];

    return (
        <ScrollView style={TabsStyles.container}>

            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Tarefa</Text>
                </View>
            </View>

            <View style={styles.todosCard}>

                <View style={styles.cardName}>
                    <Text style={styles.cardTitle}>Nome da máquina:</Text>
                    <Text style={styles.cardSubtitle}>{machineData.name}</Text>
                </View>

                <View style={styles.cardOficina}>
                    <Text style={styles.cardTitle}>Oficina:</Text>
                    <Text style={styles.cardSubtitle}>{machineData.location}</Text>
                </View>

                <View style={styles.cardMaq}>
                    <Text style={styles.titleConjuntos}>Conjuntos</Text>

                    {sets.length > 0 ? (
                        sets.map((set) => {

                            const isInspected = selectionsBySet.hasOwnProperty(set.id);
                            const inspection = selectionsBySet[set.id];

                            let statusText = "Pendente";
                            let statusStyle = styles.statusPendente;
                            if (isInspected) {
                                if (inspection.changes.length === 0 && inspection.repairs.length === 0) {
                                    statusText = "Perfeito";
                                    statusStyle = styles.statusPerfeito;
                                } else {
                                    statusText = "Avariado";
                                    statusStyle = styles.statusAvariado;
                                }
                            }

                            return (
                                <Link
                                    key={set.id}
                                    href={{

                                        pathname: "/(tabs)/tarefas/conjuntosInspe",
                                        params: {
                                            machineData: JSON.stringify(machineData),
                                            selections: JSON.stringify(selectionsBySet),
                                            setId: set.id,
                                        }
                                    }}
                                    asChild
                                >
                                    <TouchableOpacity style={styles.cardConjunto}>
                                        <Text style={styles.nameConjunto}>{set.name}</Text>
                                        <Text style={[styles.statusBase, statusStyle]}>{statusText}</Text>
                                    </TouchableOpacity>
                                </Link>
                            );
                        })
                    ) : (
                        <Text>Não há conjuntos de inspeção para esta máquina.</Text>
                    )}
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

                <TouchableOpacity onPress={handleConfirm} style={styles.botaoConfirmar}>
                    <Text style={styles.textoBotao}>Finalizar Checklist</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
}




const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    todosCard: {
        width: '90%',
        alignSelf: 'center'
    },
    cardName: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    cardOficina: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#666',
        alignSelf: "center"
    },
    cardSubtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        alignSelf: "center",
    },
    cardPrioridade: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginTop: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    flagIcon: {
        color: '#CE221E',
        marginRight: 8,
    },
    titlePrioridade: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        gap: 10,
    },
    prioridadeBtn: {
        flex: 1,
        flexDirection: 'column',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    corCircle: {
        width: 26,
        height: 26,
        borderRadius: 100,
        marginBottom: 2,
        alignSelf: 'center',
    },
    btnText: {
        fontSize: 14,
        fontWeight: '500',
        alignSelf: 'center',
    },



    cardMaq: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    titleConjuntos: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    cardConjunto: {
        backgroundColor: '#F6F6F6',
        borderRadius: 8,
        paddingVertical: 18,
        paddingHorizontal: 15,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EAEAEA',
    },
    nameConjunto: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        flexShrink: 1,
        paddingRight: 10,
    },
    statusBase: {
        fontSize: 12,
        fontWeight: 'bold',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    statusPendente: {
        backgroundColor: '#F0F0F0',
        color: '#666',
    },
    statusPerfeito: {
        backgroundColor: 'rgba(59, 179, 113, 0.2)',
        color: '#3BB371',
    },
    statusAvariado: {
        backgroundColor: 'rgba(206, 34, 30, 0.2)',
        color: '#CE221E',
    },



    botaoConfirmar: {
        backgroundColor: '#A50702',
        borderRadius: 100,
        paddingVertical: 7,
        paddingHorizontal: 10,
        width: '70%',
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        marginBottom: 30,
        alignSelf: "center",
    },
    textoBotao: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});