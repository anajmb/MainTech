import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import SetaVoltar from "@/components/setaVoltar"; // (Confirme o caminho)
import { TabsStyles } from "@/styles/globalTabs"; // (Confirme o caminho)

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
    tasks: any[];
}

export default function ConjuntosInspe() {
    // --- Hooks ---
    const router = useRouter();
    // Recebe os dados da página Hub
    const { machineData: machineDataJSON, selections: selectionsJSON, setId } = 
        useLocalSearchParams<{ machineData: string; selections: string; setId: string }>();

    // --- States ---
    const [machineData, setMachineData] = useState<Machines | null>(null);
    const [currentSet, setCurrentSet] = useState<MachineSet | null>(null);
    // Armazena TODAS as seleções recebidas
    const [selections, setSelections] = useState<Record<number, { changes: number[]; repairs: number[] }>>({});

    // Estados locais para ESTA inspeção
    const [currentStatus, setCurrentStatus] = useState<'perfeito' | 'avariado' | null>(null);
    const [selectedChanges, setSelectedChanges] = useState<Record<number, boolean>>({});
    const [selectedRepairs, setSelectedRepairs] = useState<Record<number, boolean>>({});

    // --- Effects ---
    // 1. Efeito para carregar os dados recebidos dos params
    useEffect(() => {
        if (machineDataJSON && selectionsJSON && setId) {
            try {
                const data: Machines = JSON.parse(machineDataJSON);
                const currentSelections = JSON.parse(selectionsJSON);
                const set = data.sets.find(s => s.id === Number(setId));

                setMachineData(data);
                setSelections(currentSelections);
                
                if (set) {
                    setCurrentSet(set);
                    // Carrega os dados JÁ SALVOS para este set, se existirem
                    const saved = currentSelections[set.id];
                    if (saved) {
                        if (saved.changes.length === 0 && saved.repairs.length === 0) {
                            setCurrentStatus("perfeito");
                        } else {
                            setCurrentStatus("avariado");
                        }
                        const changesMap: Record<number, boolean> = {};
                        saved.changes.forEach((id) => (changesMap[id] = true));
                        setSelectedChanges(changesMap);
                        
                        const repairsMap: Record<number, boolean> = {};
                        saved.repairs.forEach((id) => (repairsMap[id] = true));
                        setSelectedRepairs(repairsMap);
                    } else {
                         // Inicializa os toggles como falsos
                        const initChanges: Record<number, boolean> = {};
                        const initRepairs: Record<number, boolean> = {};
                        (set.subsets || []).forEach((s) => {
                            initChanges[s.id] = false;
                            initRepairs[s.id] = false;
                        });
                        setSelectedChanges(initChanges);
                        setSelectedRepairs(initRepairs);
                    }
                }
            } catch (e) {
                console.error("Falha ao parsear dados da inspeção:", e);
                Alert.alert("Erro", "Não foi possível carregar os dados do conjunto.");
            }
        }
    }, [machineDataJSON, selectionsJSON, setId]);

    function toggleChange(subId: number) {
        setSelectedChanges((prev) => ({ ...prev, [subId]: !prev[subId] }));
    }
    function toggleRepair(subId: number) {
        setSelectedRepairs((prev) => ({ ...prev, [subId]: !prev[subId] }));
    }

    // Botão "Confirmar" (Salvar e Voltar)
    function handleSaveAndReturn() {
        if (!currentSet) return;

        if (currentStatus === null) {
            Alert.alert("Atenção", "Por favor, selecione o estado do conjunto (Perfeito ou Avariado).");
            return;
        }

        let changes: number[] = [];
        let repairs: number[] = [];

        if (currentStatus === 'avariado') {
            changes = Object.keys(selectedChanges).filter(k => selectedChanges[Number(k)]).map(Number);
            repairs = Object.keys(selectedRepairs).filter(k => selectedRepairs[Number(k)]).map(Number);
        }

        // 1. Atualiza o objeto de seleções
        const updatedSelections = {
            ...selections,
            [currentSet.id]: { changes, repairs }
        };

        // 2. Navega DE VOLTA para a página Hub, passando o estado ATUALIZADO
        router.replace({
            pathname: "/(tabs)/tarefas/fazerTarefaInspe", 
            params: {
                codigo: JSON.stringify({ id: machineData?.id }), 
                updatedSelections: JSON.stringify(updatedSelections) 
            }
        });
    }

    // --- Render ---
    if (!currentSet) {
        return (
            <View style={[TabsStyles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#ce221e" />
            </View>
        );
    }
    
    const changeSubsets = currentSet.subsets.filter((s) => s.changes) || [];
    const repairSubsets = currentSet.subsets.filter((s) => s.repairs) || [];

    return (
        <ScrollView style={TabsStyles.container}>
            {/* Header (com SetaVoltar que funciona) */}
            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    {/* Título dinâmico do conjunto */}
                    <Text style={TabsStyles.tituloPrincipal}>{currentSet.name}</Text>
                </View>
            </View>

            {/* O Wizard de Inspeção mora aqui agora */}
            <View style={styles.cardEstado}>
                <Text style={styles.pergunta}>Qual o estado do conjunto?</Text>
                
                {/* Botão Perfeito */}
                <TouchableOpacity
                    style={[
                        styles.opcao,
                        currentStatus === 'perfeito' && styles.opcaoSelecionadaVerde
                    ]}
                    onPress={() => setCurrentStatus('perfeito')}
                >
                    <Text style={[
                        styles.textoVerde,
                        currentStatus === 'perfeito' && styles.textoOpcaoSelecionada
                    ]}>
                        Perfeito estado
                    </Text>
                </TouchableOpacity>

                {/* Botão Avariado */}
                <TouchableOpacity
                    style={[
                        styles.opcao,
                        currentStatus === 'avariado' && styles.opcaoSelecionadaVermelha
                    ]}
                    onPress={() => setCurrentStatus('avariado')}
                >
                    <Text style={[
                        styles.textoVermelho,
                        currentStatus === 'avariado' && styles.textoOpcaoSelecionada
                    ]}>
                        Avariado
                    </Text>
                </TouchableOpacity>
                
                {currentStatus === 'avariado' && (
                    <View style={styles.columnsWrapper}>
                        <View style={styles.divisorHorizontal} />
                        <View style={styles.columns}>
                            
                            {/* Coluna Trocar */}
                            <View style={styles.checklistCol}>
                                <Text style={styles.pergunta}>Trocar</Text>
                                {changeSubsets.length === 0 ? (
                                    <Text style={styles.noSubsetText}>Nenhum para trocar</Text>
                                ) : (
                                    changeSubsets.map((s) => (
                                        <TouchableOpacity
                                            key={`chg-${s.id}`}
                                            style={styles.checkItem}
                                            onPress={() => toggleChange(s.id)}
                                        >
                                            <View style={selectedChanges[s.id] ? styles.checkedBox : styles.checkBox}></View>
                                            <Text style={styles.checkText}>
                                                {s.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))
                                )}
                            </View>

                            {/* Divisória Vertical */}
                            <View style={styles.divisor} />

                            {/* Coluna Reparar */}
                            <View style={styles.checklistCol}>
                                <Text style={styles.pergunta}>Reparar</Text>
                                {repairSubsets.length === 0 ? (
                                    <Text style={styles.noSubsetText}>Nenhum para reparar</Text>
                                ) : (
                                    repairSubsets.map((s) => (
                                        <TouchableOpacity
                                            key={`rep-${s.id}`}
                                            style={styles.checkItem}
                                            onPress={() => toggleRepair(s.id)}
                                        >
                                            <View style={selectedRepairs[s.id] ? styles.checkedBox : styles.checkBox}></View>
                                            <Text style={styles.checkText}>
                                                {s.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))
                                )}
                            </View>

                        </View>
                         <Text style={styles.obsCheck}>*Selecione mais de uma opção se necessário</Text>
                    </View>
                )}

                {/* Botão Salvar e Voltar */}
                <View style={styles.navigationContainer}>
                    <TouchableOpacity onPress={handleSaveAndReturn} style={[styles.navButton, styles.primaryNavButton]}>
                        <Text style={[styles.navButtonText, styles.primaryNavButtonText]}>
                            Confirmar
                        </Text>
                    </TouchableOpacity>
                </View>
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
    cardEstado: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        margin: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: "center",
    },
    pergunta: {
        fontSize: 18,
        fontWeight: "500",
        color: "#222",
        marginBottom: 20,
        textAlign: 'center',
    },
    opcao: {
        borderWidth: 1,
        borderColor: '#EAEAEA',
        backgroundColor: "#F6F6F6",
        borderRadius: 10,
        paddingVertical: 12,
        marginBottom: 12,
        width: "100%",
        alignItems: "center",
    },
    opcaoSelecionadaVerde: {
        backgroundColor: '#3CB371',
        borderColor: '#3CB371',
    },
    opcaoSelecionadaVermelha: {
        backgroundColor: '#CE221E',
        borderColor: '#CE221E',
    },
    textoVerde: {
        color: "#3CB371",
        fontSize: 15,
        fontWeight: "500",
    },
    textoVermelho: {
        color: "#CE221E",
        fontSize: 15,
        fontWeight: "500",
    },
    textoOpcaoSelecionada: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    divisorHorizontal: {
        borderTopWidth: 1,
        borderColor: '#EAEAEA',
        width: '100%',
        marginVertical: 20,
    },
    divisor: {
        width: 1,
        backgroundColor: "#E0E0E0",
        marginHorizontal: 10,
    },
    columnsWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    columns: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
    },
    checklistCol: {
        flex: 1,
        alignItems: "flex-start", // Alinha os checkboxes à esquerda
        paddingHorizontal: 5,
    },
    noSubsetText: {
        color: "#888",
        fontSize: 14,
        fontStyle: 'italic',
        alignSelf: 'center', // Centraliza só este texto
    },
    checkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 8,
    },
    checkBox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#CCC',
        borderRadius: 4,
        marginRight: 12,
    },
    checkedBox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#A50702',
        backgroundColor: '#A50702',
        borderRadius: 4,
        marginRight: 12,
    },
    checkText: {
        color: '#333',
        fontSize: 14,
        flexShrink: 1,
    },
    obsCheck: {
        fontSize: 11,
        color: "#888",
        marginTop: 15,
        alignSelf: "center",
    },
    navigationContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 25,
        width: '100%',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#EAEAEA',
        paddingTop: 20,
    },
    navButton: {
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        paddingVertical: 12,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    navButtonText: {
        color: "#333",
        fontSize: 16,
        fontWeight: "500",
    },
    primaryNavButton: {
        backgroundColor: '#A50702',
    },
    primaryNavButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});