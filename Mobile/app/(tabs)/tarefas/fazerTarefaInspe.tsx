import { useLocalSearchParams, useRouter, Link } from "expo-router";
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
import { Toast } from "toastify-react-native";

// --- Interfaces para a API ---
interface ApiPerson {
    id: number;
    name: string;
}

interface ApiInspector {
    id: number;
    person: ApiPerson;
}

interface ApiTask {
    id: number;
    inspectorId: number;
    machineId: number;
    inspector: ApiInspector;
}

// --- Interfaces locais (não precisam mudar) ---
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
    office?: string;
}

// --- Constantes ---
type ChavePrioridade = 'low' | 'medium' | 'high';
const prioridadeOpcao = [
    { key: 'low', label: 'Baixa', color: '#a8ceb8ff', bgColor: '#f5dbdd7c' },
    { key: 'medium', label: 'Média', color: '#f5db8fff', bgColor: '#f5dbdd7c' },
    { key: 'high', label: 'Alta', color: '#ec8c91ff', bgColor: '#f5dbdd7c' }
];

export default function FazerTarefa() {

    const { codigo, updatedSelections } = useLocalSearchParams<{ codigo: string; updatedSelections?: string }>();
    const router = useRouter();

    const [machineData, setMachineData] = useState<Machines | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectionsBySet, setSelectionsBySet] = useState<
        Record<number, { changes: number[]; repairs: number[] }>
    >({});
    const [selectedPrioridade, setSelectedPrioridade] = useState<ChavePrioridade>('medium');

    const [inspectorId, setInspectorId] = useState<number | null>(null);
    const [inspectorName, setInspectorName] = useState<string | null>(null);
    const [taskId, setTaskId] = useState<number | null>(null);
    const [erroMsg, setErroMsg] = useState("");

    useEffect(() => {
        async function loadTaskAndMachineData() {
            if (!codigo) {
                setLoading(false);
                return;
            }
            try {
                const info = JSON.parse(codigo as string);

                if (!info.taskId) {
                    setLoading(false);
                    setErroMsg("ID da Tarefa (taskId) não recebido no parâmetro 'codigo'.");
                    router.back();
                    return;
                }

                setTaskId(info.taskId);

                const taskRes = await api.get<ApiTask>(`/tasks/getUnique/${info.taskId}`);
                const task = taskRes.data;

                if (!task.inspector || !task.inspector.person || !task.inspector.person.name) {
                    Alert.alert(
                        "Erro de API",
                        "A resposta da tarefa não incluiu 'inspector.person.name'."
                    );
                    setLoading(false);
                    router.back();
                    return;
                }

                setInspectorId(task.inspector.id);
                setInspectorName(task.inspector.person.name);

                const machineId = task.machineId;
                const machineRes = await api.get(`/machines/getUnique/${machineId}`);
                setMachineData(machineRes.data || null);

            } catch (error: any) {
                console.log("Erro ao carregar dados:", error?.response?.data || error.message);
                Toast.error("Falha ao carregar dados da tarefa ou máquina.");
                router.back();
            } finally {
                setLoading(false);
            }
        }

        if (machineData && updatedSelections) {
            setLoading(false);
        }
        else if (!machineData) {
            loadTaskAndMachineData();
        }

    }, [codigo, updatedSelections, machineData, router]);

    useEffect(() => {
        if (updatedSelections) {
            try {
                const selections = JSON.parse(updatedSelections);
                setSelectionsBySet(selections);
            } catch (e) {
                console.error("Falha ao atualizar seleções:", e);
            }
        }
    }, [updatedSelections]);

    async function handleConfirm() {
        if (!machineData) return;

        if (!inspectorId || !inspectorName) {
            Toast.error("Não foi possível identificar o inspetor. Tente novamente.");
            return;
        }

        if (!machineData.location) {
            Toast.error("Localização da máquina não encontrada. Não é possível enviar.");
            return;
        }


        const result: {
            machineId: number;
            setId: number;
            setName: string;
            subsetId: number;
            subsetName: string;
            action: "change" | "repair";
        }[] = [];

        Object.keys(selectionsBySet).forEach((setIdStr) => {
            const setId = Number(setIdStr);
            const sel = selectionsBySet[setId];
            const currentSet = machineData.sets.find(s => s.id === setId);
            if (!currentSet) {
                console.warn(`Conjunto com ID ${setId} não encontrado em machineData.`);
                return;
            }
            const setName = currentSet.name;

            sel?.changes.forEach((subsetId) => {
                const currentSubset = currentSet.subsets.find(sub => sub.id === subsetId);
                const subsetName = currentSubset ? currentSubset.name : "Nome não encontrado";
                result.push({
                    machineId: machineData.id,
                    setId,
                    setName: setName,
                    subsetId,
                    subsetName: subsetName,
                    action: "change"
                });
            });

            sel?.repairs.forEach((subsetId) => {
                const currentSubset = currentSet.subsets.find(sub => sub.id === subsetId);
                const subsetName = currentSubset ? currentSubset.name : "Nome não encontrado";
                result.push({
                    machineId: machineData.id,
                    setId,
                    setName: setName,
                    subsetId,
                    subsetName: subsetName,
                    action: "repair"
                });
            });
        });

        if (Object.keys(selectionsBySet).length !== machineData.sets.length) {
            setErroMsg("Você precisa inspecionar todos os conjuntos.");
            return;
        }

        // --- INÍCIO DA ALTERAÇÃO: LÓGICA DO PAYLOAD "MACHINE OK" ---

        let payloadToSend: any = result;
        let successMessage = "Inspeção enviada e tarefa concluída.";

        // Se o array 'result' estiver vazio, significa que não há avarias
        if (result.length === 0) {
            payloadToSend = "machine ok";
            successMessage = "Inspeção concluída: Máquina em perfeito estado.";
        }

        const dataToSend = {
            machineId: machineData.id,
            machineName: machineData.name,
            location: machineData.location,
            priority: selectedPrioridade,
            payload: payloadToSend, // Pode ser o array de avarias ou "machine ok"
            inspectorId: inspectorId,
            inspectorName: inspectorName,
        };

        // --- FIM DA ALTERAÇÃO ---

        console.log("Enviando:", dataToSend);

        try {

            const res = await api.post("/serviceOrders/create", dataToSend);

            if (taskId) {
                console.log(`Atualizando Task ${taskId} para COMPLETED`);
                await api.patch(`/tasks/complete/${taskId}`);
            }

            Toast.success("Sucesso", res.data?.msg || successMessage);

            router.push('/(tabs)/tarefas');

        } catch (error: any) {
            console.log("Erro ao enviar:", error?.response ?? error);
            Toast.error("Erro", error.response?.data?.msg || "Falha ao enviar dados.");
        }
    }

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
                                            taskId: taskId
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

                {erroMsg !== "" && (
                    <View style={TabsStyles.erroMsg}>
                        <Text style={TabsStyles.erroMsgText}>{erroMsg}</Text>
                    </View>
                )}

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
        backgroundColor: "#A50702",
        color: "#fff",
        borderRadius: 10,
        paddingVertical: 12,
        width: "62%",
        marginTop: 25,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center"
    },
    textoBotao: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "400",
    },
});