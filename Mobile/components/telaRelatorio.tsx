import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, ActivityIndicator, Modal, FlatList } from "react-native";
import { useAuth } from "@/contexts/authContext";
import { api } from "@/lib/axios";

// --- TIPAGEM ---
type SecaoProps = {
    title?: string;
    children: React.ReactNode;
    noBottomBorder?: boolean;
}

interface PayloadItem {
    setId: number;
    setName: string;
    action: 'change' | 'repair';
    subsetId: number;
    subsetName: string;
    machineId: number;
}

interface Maintainer {
    id: number;
    name: string;
    role?: string;
}

interface OrdemServico {
    id: number;
    machineId: number;
    machineName: string;
    location: string;
    inspectorId: number;
    inspectorName: string;
    priority: 'low' | 'medium' | 'high';
    payload: PayloadItem[];
    createdAt: string;
    updatedAt: string;
    maintainerId?: number;
    maintainerName?: string;
    serviceNotes?: string;
    materialsUsed?: string;
    status?: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED';
}

type RelatorioProps = {
    ordem: OrdemServico | null;
    onUpdate: () => void;
}

const prioridadeLabel = {
    low: "Baixa Criticidade",
    medium: "Média Criticidade",
    high: "Alta Criticidade"
};

const actionLabel = {
    change: "Troca Necessária",
    repair: "Reparo Necessário"
};

// --- COMPONENTE SEÇÃO ---
export default function Secao({ title, children, noBottomBorder }: SecaoProps) {
    return (
        <View style={styles.secaoContainer}>
            {title && (
                <View style={styles.headerContainer}>
                    <Text style={styles.titleSecao}>{title}</Text>
                </View>
            )}
            <View style={[styles.contentContainer, noBottomBorder && { borderBottomWidth: 0 }]}>
                {children}
            </View>
        </View>
    )
}


export function Relatorio({ ordem, onUpdate }: RelatorioProps) {
    const { user } = useAuth();

    const [serviceNotes, setServiceNotes] = useState('');
    const [materialsUsed, setMaterialsUsed] = useState('');
    const [loading, setLoading] = useState(false);

    // States para Manutentores e Modal de Seleção
    const [manutentores, setManutentores] = useState<Maintainer[]>([]);
    const [selectedMaintainerId, setSelectedMaintainerId] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const isMaintainer = user?.role === 'MAINTAINER';
    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        if (ordem) {
            setServiceNotes(ordem.serviceNotes || '');
            setMaterialsUsed(ordem.materialsUsed || '');
            setSelectedMaintainerId(ordem.maintainerId || null);
        }
    }, [ordem]);

    useEffect(() => {
        if (isAdmin && ordem?.status === 'PENDING') {
            async function fetchMaintainers() {
                try {
                    const response = await api.get('/employees/get');
                    const allEmployees: Maintainer[] = response.data;
                    const filteredMaintainers = allEmployees.filter(
                        (emp) => emp.role === 'MAINTAINER'
                    );
                    setManutentores(filteredMaintainers);
                } catch (error) {
                    console.error("Erro ao buscar manutentores:", error);
                    Alert.alert("Erro", "Não foi possível carregar a lista de manutentores.");
                }
            }
            fetchMaintainers();
        }
    }, [isAdmin, ordem?.status]);

    if (!ordem) {
        return (
            <Secao title="Relatório da Intervenção">
                <View style={styles.infoRow}>
                    <Text style={styles.value}>Carregando dados da ordem...</Text>
                </View>
            </Secao>
        )
    }

    const isEditable = isMaintainer &&
        (ordem.status === 'ASSIGNED' || ordem.status === 'IN_PROGRESS') &&
        ordem.maintainerId === user?.id;

    const dataEmissao = ordem.createdAt ? new Date(ordem.createdAt).toLocaleDateString('pt-BR') : "N/A";
    const dataConclusao = ordem.status === 'COMPLETED' ? new Date(ordem.updatedAt).toLocaleDateString('pt-BR') : 'Pendente';
    const prioridade = ordem.priority ? prioridadeLabel[ordem.priority] : "N/A";

    // Helper para pegar o nome do manutentor selecionado para exibir no input
    const getSelectedMaintainerName = () => {
        if (!selectedMaintainerId) return "Selecione uma opção...";
        const found = manutentores.find(m => m.id === selectedMaintainerId);
        return found ? found.name : "Manutentor desconhecido";
    };

    const handleAssignMaintainer = async () => {
        if (!selectedMaintainerId) {
            Alert.alert("Erro", "Por favor, selecione um manutentor da lista.");
            return;
        }
        const selectedMaintainer = manutentores.find(m => m.id === selectedMaintainerId);
        if (!selectedMaintainer) {
            Alert.alert("Erro", "Manutentor selecionado inválido.");
            return;
        }

        setLoading(true);
        try {
            await api.patch(`/serviceOrders/assign/${ordem.id}`, {
                maintainerId: selectedMaintainer.id,
                maintainerName: selectedMaintainer.name
            });
            Alert.alert("Sucesso", "Ordem de Serviço atribuída.");
            onUpdate();
        } catch (error: any) {
            console.error("Erro ao atribuir:", error.response?.data);
            Alert.alert("Erro", error.response?.data?.msg || "Não foi possível atribuir a OS.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitWork = async () => {
        if (!serviceNotes || !materialsUsed) {
            Alert.alert("Erro", "Por favor, preencha os campos 'Serviço Realizado' e 'Materiais Utilizados'.");
            return;
        }
        setLoading(true);
        try {
            await api.patch(`/serviceOrders/submit/${ordem.id}`, {
                serviceNotes,
                materialsUsed
            });
            Alert.alert("Sucesso", "Relatório enviado para aprovação.");
            onUpdate();
        } catch (error: any) {
            console.error("Erro ao submeter:", error.response?.data);
            Alert.alert("Erro", error.response?.data?.msg || "Não foi possível submeter o relatório.");
        } finally {
            setLoading(false);
        }
    };

    const handleApproveWork = async () => {
        setLoading(true);
        try {
            await api.patch(`/serviceOrders/approve/${ordem.id}`);
            Alert.alert("Sucesso", "Ordem de Serviço concluída.");
            onUpdate();
        } catch (error: any) {
            console.error("Erro ao aprovar:", error.response?.data);
            Alert.alert("Erro", error.response?.data?.msg || "Não foi possível aprovar a OS.");
        } finally {
            setLoading(false);
        }
    };

    // --- NOVA FUNÇÃO: RECUSAR TAREFA ---
    const handleRefuseWork = async () => {
        setLoading(true);
        try {
            // Chama a nova rota que criamos no backend
            // Certifique-se de que a rota '/tasks/refuse/:id' esteja registrada no seu arquivo de rotas do backend
            await api.patch(`/serviceOrders/refuse/${ordem.id}`);

            Alert.alert("Sucesso", "OS desaprovada e retornada para Pendente.");
            onUpdate(); // Atualiza a tela para refletir a mudança
        } catch (error: any) {
            console.error("Erro ao recusar:", error.response?.data);
            Alert.alert("Erro", error.response?.data?.msg || "Não foi possível recusar a OS.");
        } finally {
            setLoading(false);
        }
    };
    // -----------------------------------

    const formatStatus = (status: OrdemServico['status']): string => {
        switch (status) {
            case 'PENDING': return 'Pendente';
            case 'ASSIGNED': return 'Atribuída';
            case 'IN_PROGRESS': return 'Em Progresso';
            case 'IN_REVIEW': return 'Em Revisão';
            case 'COMPLETED': return 'Concluída';
            default: return 'Desconhecido';
        }
    };

    const getStatusStyle = (status?: string) => {
        switch (status) {
            case 'PENDING': return styles.statusPending;
            case 'ASSIGNED': return styles.statusAssigned;
            case 'IN_PROGRESS': return styles.statusInProgress;
            case 'IN_REVIEW': return styles.statusInProgress;
            case 'COMPLETED': return styles.statusCompleted;
            default: return {};
        }
    };

    return (
        <View style={styles.mainContainer}>

            {/* SEÇÃO 1: DATAS DA ORDEM */}
            <Secao title="Datas da Ordem">
                <View style={styles.tableRow}>
                    <View style={[styles.tableCell, styles.borderRight, { flex: 0.5 }]}>
                        <Text style={styles.label}>Data da emissão:</Text>
                        <Text style={styles.valueCentered}>{dataEmissao}</Text>
                    </View>
                    <View style={[styles.tableCell, { flex: 0.5 }]}>
                        <Text style={styles.label}>Data da conclusão:</Text>
                        <Text style={styles.valueCentered}>{dataConclusao}</Text>
                    </View>
                </View>
            </Secao>

            {/* SEÇÃO 2: PRIORIDADE */}
            <Secao title="Prioridade da anomalia:">
                <View style={styles.infoRowNoBorder}>
                    <Text style={styles.valueCentered}>{prioridade}</Text>
                </View>
            </Secao>

            {/* SEÇÃO 3: EQUIPAMENTO */}
            <Secao title="Equipamento e Diagnóstico">
                <View style={styles.tableRow}>
                    <View style={[styles.tableCell, styles.borderRight, { flex: 0.4 }]}>
                        <Text style={styles.label}>Nome:</Text>
                        <Text style={styles.value}>{ordem.machineName}</Text>
                    </View>
                    <View style={[styles.tableCell, { flex: 0.6 }]}>
                        <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit>Identificação da Máquina:</Text>
                        <Text style={styles.value}>#{ordem.machineId}</Text>
                    </View>
                </View>

                {/* Linha 2: Diagnóstico */}
                <View style={styles.tableRowVertical}>
                    <Text style={styles.label}>Diagnóstico atual:</Text>
                    {ordem.payload && ordem.payload.length > 0 ? (
                        ordem.payload.map((item, index) => (
                            <View key={index} style={styles.payloadItem}>
                                <Text style={styles.valueBullet}>• {actionLabel[item.action]}</Text>
                                <Text style={styles.subValue}>
                                    Conjunto: {item.setName} | Sub: {item.subsetName}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.value}>Nenhum item de inspeção registrado.</Text>
                    )}
                </View>

                {/* Linha 3: Solicitante */}
                <View style={[styles.tableRowVertical, { borderBottomWidth: 0 }]}>
                    <Text style={styles.label}>Solicitante:</Text>
                    <Text style={styles.value}>{ordem.inspectorName}</Text>
                </View>
            </Secao>

            {/* SEÇÃO 4: ATRIBUIÇÃO (ADMIN) COM INPUT SELECT CUSTOMIZADO */}
            {isAdmin && ordem.status === 'PENDING' && (
                <Secao title="Atribuir Ordem de Serviço">
                    <View style={styles.formContainer}>
                        <Text style={styles.labelDark}>Selecione o Manutentor:</Text>

                        {/* INPUT SELECT (Trigger do Modal) */}
                        <TouchableOpacity
                            style={styles.inputSelect}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={selectedMaintainerId ? styles.inputText : styles.inputPlaceholder}>
                                {getSelectedMaintainerName()}
                            </Text>
                            {/* Ícone seta para baixo simples */}
                            <Text style={styles.inputIcon}>▼</Text>
                        </TouchableOpacity>

                        {/* MODAL DE LISTAGEM */}
                        <Modal
                            visible={modalVisible}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <TouchableOpacity
                                style={styles.modalOverlay}
                                activeOpacity={1}
                                onPress={() => setModalVisible(false)}
                            >
                                <View style={styles.modalContent}>
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalTitle}>Manutentores Disponíveis</Text>
                                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                                            <Text style={styles.closeButton}>Fechar</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <FlatList
                                        data={manutentores}
                                        keyExtractor={(item) => item.id.toString()}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.modalItem}
                                                onPress={() => {
                                                    setSelectedMaintainerId(item.id);
                                                    setModalVisible(false);
                                                }}
                                            >
                                                <Text style={[
                                                    styles.modalItemText,
                                                    selectedMaintainerId === item.id && styles.modalItemSelected
                                                ]}>
                                                    {item.name}
                                                </Text>
                                                {selectedMaintainerId === item.id && <Text style={styles.checkIcon}>✓</Text>}
                                            </TouchableOpacity>
                                        )}
                                        ListEmptyComponent={
                                            <Text style={styles.emptyListText}>Nenhum manutentor encontrado.</Text>
                                        }
                                    />
                                </View>
                            </TouchableOpacity>
                        </Modal>

                    </View>
                </Secao>
            )}

            {/* SEÇÃO 5: RELATÓRIO DE INTERVENÇÃO */}
            <Secao title="Relatório da Intervenção">
                {/* Manutentor e Data */}
                <View style={styles.tableRow}>
                    <View style={[styles.tableCell, styles.borderRight, { flex: 0.5 }]}>
                        <Text style={styles.label}>Manutentor:</Text>
                        <Text style={styles.value}>{ordem.maintainerName || "Aguardando..."}</Text>
                    </View>
                    <View style={[styles.tableCell, { flex: 0.5 }]}>
                        <Text style={styles.label}>Status:</Text>
                        <Text style={[styles.value, getStatusStyle(ordem.status)]}>{formatStatus(ordem.status as any)}</Text>
                    </View>
                </View>

                {/* Inputs */}
                <View style={styles.formPadding}>
                    <Text style={styles.labelDark}>Serviço Realizado:</Text>
                    <TextInput
                        style={[styles.textInput, !isEditable && styles.textInputDisabled]}
                        placeholder={isEditable ? "Descreva os detalhes..." : "Aguardando preenchimento"}
                        multiline
                        editable={isEditable}
                        value={serviceNotes}
                        onChangeText={setServiceNotes}
                    />

                    <View style={{ height: 15 }} />

                    <Text style={styles.labelDark}>Materiais Utilizados:</Text>
                    <TextInput
                        style={[styles.textInput, !isEditable && styles.textInputDisabled]}
                        placeholder={isEditable ? "Descreva os materiais..." : "Aguardando preenchimento"}
                        multiline
                        editable={isEditable}
                        value={materialsUsed}
                        onChangeText={setMaterialsUsed}
                    />
                </View>
            </Secao>

            {/* BOTÕES DE AÇÃO */}
            <View style={styles.actionButtonContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#A50702" />
                ) : (
                    <>
                        {isAdmin && ordem.status === 'PENDING' && (
                            <TouchableOpacity style={styles.buttonAssign} onPress={handleAssignMaintainer}>
                                <Text style={styles.buttonText}>CONFIRMAR ATRIBUIÇÃO</Text>
                            </TouchableOpacity>
                        )}

                        {isEditable && (
                            <TouchableOpacity style={styles.buttonSubmit} onPress={handleSubmitWork}>
                                <Text style={styles.buttonText}>SUBMETER PARA APROVAÇÃO</Text>
                            </TouchableOpacity>
                        )}

                        {isAdmin && ordem.status === 'IN_REVIEW' && (
                            <View style={styles.buttonsContainer}>
                                <TouchableOpacity style={styles.buttonApprove} onPress={handleApproveWork}>
                                    <Text style={styles.buttonText}>APROVAR OS</Text>
                                </TouchableOpacity>

                                {/* Botão Atualizado para chamar handleRefuseWork */}
                                <TouchableOpacity style={styles.buttonDesapprove} onPress={handleRefuseWork}>
                                    <Text style={styles.buttonText}>DESAPROVAR OS</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </>
                )}
            </View>
        </View>
    )
}

// Seus estilos originais mantidos abaixo...
const styles = StyleSheet.create({
    mainContainer: {
        marginBottom: 100,
        paddingHorizontal: 5,
        paddingTop: 10,
    },
    secaoContainer: {
        marginBottom: 15,
        backgroundColor: 'transparent',
    },
    headerContainer: {
        backgroundColor: '#A50702',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    titleSecao: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    contentContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderTopWidth: 0,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        overflow: 'hidden',
    },

    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    tableRowVertical: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    tableCell: {
        padding: 12,
        justifyContent: 'center',
    },
    borderRight: {
        borderRightWidth: 1,
        borderRightColor: '#eee',
    },
    infoRow: {
        padding: 15,
        justifyContent: 'center',
    },
    infoRowNoBorder: {
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },

    label: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
        fontWeight: '500',
        fontStyle: 'italic',
    },
    labelDark: {
        fontSize: 14,
        color: '#333',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 15,
        color: '#212529',
        fontWeight: '600',
    },
    valueCentered: {
        fontSize: 15,
        color: '#212529',
        fontWeight: '600',
        textAlign: 'center',
    },
    valueBullet: {
        fontSize: 14,
        color: '#212529',
        fontWeight: '600',
        marginTop: 4,
    },
    subValue: {
        fontSize: 13,
        color: '#666',
        marginLeft: 10,
        marginBottom: 4,
    },
    payloadItem: {
        marginBottom: 8,
    },

    // Formulários
    formContainer: {
        padding: 20,
    },
    formPadding: {
        padding: 15,
    },

    inputSelect: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        backgroundColor: '#fefefe',
        height: 56,
        paddingHorizontal: 15,
    },
    inputText: {
        fontSize: 16,
        color: '#212529',
    },
    inputPlaceholder: {
        fontSize: 16,
        color: '#999',
    },
    inputIcon: {
        fontSize: 14,
        color: '#666',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        maxHeight: '80%',
        paddingBottom: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212529',
    },
    closeButton: {
        color: '#A50702',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalItemText: {
        fontSize: 16,
        color: '#333',
    },
    modalItemSelected: {
        fontWeight: 'bold',
        color: '#A50702',
    },
    checkIcon: {
        color: '#A50702',
        fontWeight: 'bold',
    },
    emptyListText: {
        padding: 20,
        textAlign: 'center',
        color: '#666',
    },

    textInput: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingTop: 10,
        fontSize: 15,
        minHeight: 100,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    textInputDisabled: {
        backgroundColor: '#f0f0f0',
        color: '#6c757d',
    },

    actionButtonContainer: {
        marginTop: 20,
        marginBottom: 30,
        paddingHorizontal: 5,
    },
    buttonAssign: {
        backgroundColor: '#A50702',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    buttonSubmit: {
        backgroundColor: '#A50702',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 1,
        alignItems: 'center',
    },
    buttonApprove: {
        backgroundColor: '#A50702',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonDesapprove: {
        backgroundColor: '#6d6d6d66',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },

    // Status
    statusPending: { color: '#dc3545' },
    statusAssigned: { color: '#17a2b8' },
    statusInProgress: { color: '#ffc107' },
    statusCompleted: { color: '#28a745' }
});