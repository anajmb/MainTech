import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { api } from "../../../lib/axios";

import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { CircleDot, Square } from "lucide-react-native";

// --- Interfaces ---
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
}

export default function Conjuntos() {
    // --- Hooks ---
    const { codigo } = useLocalSearchParams();

    // --- States ---
    const [machineData, setMachineData] = useState<Machines | null>(null);
    const [loading, setLoading] = useState(true);

    // índice do set atual que está sendo exibido
    const [currentSetIndex, setCurrentSetIndex] = useState(0);

    // NOVO ESTADO: controla a escolha 'perfeito' ou 'avariado' para o set atual
    const [currentStatus, setCurrentStatus] = useState<'perfeito' | 'avariado' | null>(null);

    // seleções temporárias do set atual (subsets selecionados por ação)
    const [selectedChanges, setSelectedChanges] = useState<Record<number, boolean>>({});
    const [selectedRepairs, setSelectedRepairs] = useState<Record<number, boolean>>({});

    // armazenamento final das seleções por setId
    const [selectionsBySet, setSelectionsBySet] = useState<
        Record<number, { changes: number[]; repairs: number[] }>
    >({});

    // --- Effects ---

    // Efeito para carregar os dados da máquina (via API)
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

        loadMachineById();
    }, [codigo]);

    // MODIFICADO: sempre que mudar de set, carrega o status (perfeito/avariado) e os toggles
    useEffect(() => {
        if (!machineData) return;
        const sets = machineData.sets || [];
        const setItem = sets[currentSetIndex];

        if (!setItem) {
            setCurrentStatus(null);
            setSelectedChanges({});
            setSelectedRepairs({});
            return;
        }

        // se já existirem seleções salvas para este set, carregue
        const saved = selectionsBySet[setItem.id];

        if (saved) {
            // Define o status (perfeito ou avariado)
            if (saved.changes.length === 0 && saved.repairs.length === 0) {
                setCurrentStatus("perfeito");
            } else {
                setCurrentStatus("avariado");
            }

            // Carrega os toggles de subset
            const changesMap: Record<number, boolean> = {};
            const repairsMap: Record<number, boolean> = {};
            saved.changes.forEach((id) => (changesMap[id] = true));
            saved.repairs.forEach((id) => (repairsMap[id] = true));
            setSelectedChanges(changesMap);
            setSelectedRepairs(repairsMap);

        } else {
            // Se não há dados salvos, reseta tudo
            setCurrentStatus(null); // Pede ao usuário para escolher

            // inicializa com false
            const initChanges: Record<number, boolean> = {};
            const initRepairs: Record<number, boolean> = {};
            (setItem.subsets || []).forEach((s) => {
                initChanges[s.id] = false;
                initRepairs[s.id] = false;
            });
            setSelectedChanges(initChanges);
            setSelectedRepairs(initRepairs);
        }

    }, [currentSetIndex, machineData, selectionsBySet]);


    // --- Handlers (Toggles) ---

    function toggleChange(subId: number) {
        setSelectedChanges((prev) => ({ ...prev, [subId]: !prev[subId] }));
    }
    function toggleRepair(subId: number) {
        setSelectedRepairs((prev) => ({ ...prev, [subId]: !prev[subId] }));
    }

    // --- Handlers (Navegação/Envio) ---

    function handleContinue() {
        if (!currentSet) return;

        // 1. Verifica se o usuário selecionou um status
        if (currentStatus === null) {
            Alert.alert("Atenção", "Por favor, selecione o estado do conjunto (Perfeito ou Avariado).");
            return;
        }

        let changes: number[] = [];
        let repairs: number[] = [];

        // 2. Se 'avariado', coleta os dados. Se 'perfeito', deixa os arrays vazios.
        if (currentStatus === 'avariado') {
            changes = Object.keys(selectedChanges)
                .filter((k) => selectedChanges[Number(k)])
                .map((k) => Number(k));
            repairs = Object.keys(selectedRepairs)
                .filter((k) => selectedRepairs[Number(k)])
                .map((k) => Number(k));
        }

        // 3. Salva o resultado para este set
        setSelectionsBySet((prev) => ({
            ...prev,
            [currentSet.id]: { changes, repairs },
        }));

        // 4. Avança para próximo set, se houver
        if (currentSetIndex < sets.length - 1) {
            setCurrentSetIndex(currentSetIndex + 1);
        } else {
            Alert.alert("Concluído", "Você chegou ao último conjunto. Confirme para enviar.");
        }
    }

    async function handleConfirm() {
        if (!machineData) return;

        // 1. Cria uma cópia final das seleções
        const finalSelections = { ...selectionsBySet };

        // 2. Adiciona/Sobrescreve os dados do SET ATUAL
        if (currentSet) {
            // Validação: Garante que o usuário selecionou um status para o set atual
            if (currentStatus === null && (changeSubsets.length > 0 || repairSubsets.length > 0)) {
                Alert.alert("Atenção", `Por favor, selecione o estado do conjunto "${currentSet.name}" antes de confirmar.`);
                return;
            }

            let changes: number[] = [];
            let repairs: number[] = [];

            if (currentStatus === 'avariado') {
                changes = Object.keys(selectedChanges)
                    .filter((k) => selectedChanges[Number(k)])
                    .map((k) => Number(k));
                repairs = Object.keys(selectedRepairs)
                    .filter((k) => selectedRepairs[Number(k)])
                    .map((k) => Number(k));
            }
            // Se 'perfeito' ou 'null' (e não precisava de seleção), salva como vazio
            finalSelections[currentSet.id] = { changes, repairs };
        }

        // 3. Monta o resultado final iterando sobre a 'finalSelections' (que está 100% atualizada)
        const result: {
            machineId: number;
            setId: number;
            subsetId: number;
            action: "change" | "repair";
        }[] = [];

        Object.keys(finalSelections).forEach((setIdStr) => {
            const setId = Number(setIdStr);
            const sel = finalSelections[setId];

            sel?.changes.forEach((subsetId) =>
                result.push({ machineId: machineData.id, setId, subsetId, action: "change" })
            );
            sel?.repairs.forEach((subsetId) =>
                result.push({ machineId: machineData.id, setId, subsetId, action: "repair" })
            );
        });

        // 4. Envia para o backend
        const payloadString = JSON.stringify(result);
        console.log("Enviando:", payloadString); // Ótimo para debug

        try {
            const res = await api.post("/machines/submit-subsets", {
                machineId: machineData.id,
                payload: payloadString,
            });
            Alert.alert("Sucesso", res.data?.msg || "Dados enviados com sucesso.");

            // Reseta os estados
            setSelectionsBySet({});
            setSelectedChanges({});
            setSelectedRepairs({});
            setCurrentStatus(null);
            setCurrentSetIndex(0);

        } catch (error: any) {
            console.log("Erro ao enviar:", error?.response ?? error);
            Alert.alert("Erro", error.response?.data?.msg || "Falha ao enviar dados.");
            console.log(payloadString)
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
    const currentSet = sets[currentSetIndex];

    // Filtra subsets apenas quando o 'currentSet' existir
    const changeSubsets = currentSet?.subsets.filter((s) => s.changes) || [];
    const repairSubsets = currentSet?.subsets.filter((s) => s.repairs) || [];

    return (
        <ScrollView style={TabsStyles.container}>
            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>{machineData.name}</Text>
                    {currentSet && (
                        <Text style={{ color: "#666", marginTop: 6 }}>
                            Conjunto {currentSetIndex + 1} de {sets.length} — {currentSet?.name}
                        </Text>
                    )}
                </View>
            </View>

            {/* Se não houver 'currentSet' (ex: 0 conjuntos), mostra mensagem */}
            {currentSet ? (
                <View style={styles.cardEstado}>

                    {/* --- Pergunta de Estado (Perfeito/Avariado) --- */}
                    <Text style={styles.pergunta}>Qual o estado do {currentSet.name}</Text>

                    <TouchableOpacity
                        style={[
                            styles.opcao,
                            currentStatus === 'perfeito' && styles.textoVerdeSelectedContainer
                        ]}
                        onPress={() => setCurrentStatus('perfeito')}
                    >
                        <Text style={[
                            styles.textoVerde,
                            currentStatus === 'perfeito' && styles.textoVerdeSelected
                        ]}>
                            Perfeito estado
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.opcao,
                            currentStatus === 'avariado' && styles.textoVermelhoSelectedContainer
                        ]}
                        onPress={() => setCurrentStatus('avariado')}
                    >
                        <Text style={[
                            styles.textoVermelho,
                            currentStatus === 'avariado' && styles.textoVermelhoSelected
                        ]}>
                            Avariado
                        </Text>
                    </TouchableOpacity>
                    {/* --- Fim da Pergunta de Estado --- */}


                    {/* --- Listas de Subsets (Condicional) --- */}
                    {/* Só mostra as colunas de subsets se 'Avariado' for selecionado */}
                    {currentStatus === 'avariado' && (
                        <View style={styles.columnsWrapper}>
                            <View style={styles.divisor} />

                            <View style={styles.checklistContainer}>

                                <View style={styles.checklistCol}>
                                    <Text style={styles.pergunta}>Trocar</Text>
                                    {changeSubsets.length === 0 ? (
                                        <Text style={{ color: "#888" }}>Nenhum para trocar</Text>
                                    ) : (
                                        changeSubsets.map((s) => (
                                            <TouchableOpacity
                                                key={`chg-${s.id}`}
                                                style={[
                                                    styles.checkItem,
                                                    selectedChanges[s.id] && styles.checkedItem,
                                                ]}
                                                onPress={() => toggleChange(s.id)}
                                            >
                                                {/* ---- CORRIGIDO ---- */}
                                                <View style={selectedChanges[s.id] ? styles.checkedBox : styles.checkBox}></View>

                                                <Text style={selectedChanges[s.id] ? styles.checkedText : styles.checkText}>
                                                    {s.name}
                                                </Text>
                                            </TouchableOpacity>
                                        ))
                                    )}
                                </View>

                                <View style={styles.divisor} />

                                <View style={styles.checklistCol}>
                                    <Text style={styles.pergunta}>Reparar</Text>
                                    {repairSubsets.length === 0 ? (
                                        <Text style={{ color: "#888" }}>Nenhum para reparar</Text>
                                    ) : (
                                        repairSubsets.map((s) => (
                                            <TouchableOpacity
                                                key={`rep-${s.id}`}
                                                style={[
                                                    styles.checkItem,
                                                    selectedRepairs[s.id] && styles.checkedItem,
                                                ]}
                                                onPress={() => toggleRepair(s.id)}
                                            >
                                                {/* Este já estava correto */}
                                                <View style={selectedRepairs[s.id] ? styles.checkedBox : styles.checkBox}></View>

                                                <Text style={selectedRepairs[s.id] ? styles.checkedText : styles.checkText}>
                                                    {s.name}
                                                </Text>
                                            </TouchableOpacity>
                                        ))
                                    )}
                                </View>
                            </View>
                        </View>
                    )}

                    {/* --- Fim das Listas de Subsets --- */}

                    <View style={styles.navigationContainer}>
                        {/* Botão Voltar */}
                        <TouchableOpacity
                            onPress={() => {
                                if (currentSetIndex > 0) setCurrentSetIndex(currentSetIndex - 1);
                            }}
                            style={[styles.botaoVoltar, currentSetIndex === 0 && styles.botaoVoltar]}
                            disabled={currentSetIndex === 0}
                        >
                            <Text style={styles.navButtonText}>Voltar (Refazer)</Text>
                        </TouchableOpacity>

                        {/* Botão Avançar / Finalizar */}
                        <TouchableOpacity

                            onPress={currentSetIndex === sets.length - 1 ? handleConfirm : handleContinue}

                            style={[styles.botaoConfirmar, styles.botaoConfirmar]}
                        >
                            <Text style={styles.textoBotao}>
                                {/* Muda o texto dinamicamente */}
                                {currentSetIndex === sets.length - 1 ? "Finalizar" : "Avançar"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            ) : (
                <View style={styles.cardEstado}>
                    <Text>Não há conjuntos de inspeção para esta máquina.</Text>
                </View>
            )}
        </ScrollView>
    );
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
        alignSelf: "center", 
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

    textoVerdeSelectedContainer: {
        backgroundColor: "#3CB371",
        color: "#fff",
    },

    textoVerdeSelected: {
        color: "#fff",
    },

    textoVerde: {
        color: "#3CB371",
        fontSize: 13,
        fontWeight: "400",
    },

    textoVermelhoSelectedContainer: {
        backgroundColor: "#CE221E",
        color: "#fff",
    },

    textoVermelhoSelected: {
        color: "#fff",
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
        alignContent: "center",
    },

    subItemSelectedRepair: {
        backgroundColor: "#F8D7DA",
        borderRadius: 8,
        paddingVertical: 6,
    },

    checklistTitulo: {
        fontSize: 14,
        fontWeight: "400",
        marginBottom: 8,
        color: "#222",
        justifyContent: "center",
        marginLeft: 30,

    },

    checkText: {
        marginLeft: 10,
        fontSize: 15,
        color: "#000000ff",
        textAlign: "center",
    },

    checkedText: {
        marginLeft: 10,
        fontSize: 15,
        color: "#000000ff",
        textAlign: "center",
    },

    checkItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
        borderRadius: 8,
        padding: 3,
    },

    checkedItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
        borderRadius: 8,
        padding: 3,
    },

    checkBox: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderColor: "#000",
        fontSize: 18,
    },

    checkedBox: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderColor: "#000",
        fontSize: 18,
        backgroundColor: "#A50702",
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

    navigationContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 30,
    },

    botaoConfirmar: {
        backgroundColor: '#A50702',
        borderRadius: 10, 
        paddingVertical: 10,
        width: 150, 
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
    },

    botaoVoltar: {
        borderRadius: 10, 
        paddingVertical: 10,
        width: 150, 
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
    },

    textoBotao: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "400",
    },

    navButtonText: {
        color: "#888",
        fontSize: 15,
        marginTop: 2,
        textAlign: "center",
    },
});