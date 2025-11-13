import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useAuth } from "@/contexts/authContext"; 
import { api } from "@/lib/axios";
import { Picker } from '@react-native-picker/picker'; // Importe o Picker

type SecaoProps = {
    title?: string;
    children: React.ReactNode
}

export default function Secao({ title, children }: SecaoProps) {
    return (
        <View >
            {title && <Text style={styles.titleSecao}>{title}</Text>}
            <View style={styles.cards}>
                <View style={styles.contentSecao}>{children}</View>
            </View>
        </View>
    )
}

interface PayloadItem {
    setId: number;
    setName: string;
    action: 'change' | 'repair';
    subsetId: number;
    subsetName: string;
    machineId: number;
}

// Interface para a lista de manutentores
interface Maintainer {
    id: number;
    name: string;
    // Adicionamos 'role' para a busca, mas não precisamos usar em todo lugar
    role?: string; 
}

// Interface da Ordem de Serviço
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

// --- MUDANÇA 1: Prop 'availableMaintainers' REMOVIDA ---
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

export function Relatorio({ ordem, onUpdate }: RelatorioProps) {

    const { user } = useAuth();
    
    // States para o preenchimento do Manutentor
    const [serviceNotes, setServiceNotes] = useState('');
    const [materialsUsed, setMaterialsUsed] = useState('');
    const [loading, setLoading] = useState(false);
    
    // --- MUDANÇA 2: States para a lista de Manutentores (Atribuição) ---
    const [manutentores, setManutentores] = useState<Maintainer[]>([]);
    const [selectedMaintainerId, setSelectedMaintainerId] = useState<number | null>(null);

    // Roles
    const isMaintainer = user?.role === 'MAINTAINER';
    const isAdmin = user?.role === 'ADMIN';

    // Efeito para preencher os campos de texto (Relatório do Manutentor)
    useEffect(() => {
        if (ordem) {
            setServiceNotes(ordem.serviceNotes || '');
            setMaterialsUsed(ordem.materialsUsed || '');
            setSelectedMaintainerId(ordem.maintainerId || null);
        }
    }, [ordem]);

    // --- MUDANÇA 3: Novo Efeito para BUSCAR e FILTRAR os Manutentores ---
    useEffect(() => {
        // Só busca a lista se o usuário for Admin e a OS estiver pendente
        if (isAdmin && ordem?.status === 'PENDING') {
            
            async function fetchMaintainers() {
                try {
                    // 1. Busca TODOS os funcionários (como você pediu)
                    const response = await api.get('/employees/get');
                    
                    const allEmployees: Maintainer[] = response.data; 
                    
                    // 2. FILTRA apenas os Manutentores
                    const filteredMaintainers = allEmployees.filter(
                        (emp) => emp.role === 'MAINTAINER'
                    );

                    // 3. Salva no state
                    setManutentores(filteredMaintainers);

                } catch (error) {
                    console.error("Erro ao buscar manutentores:", error);
                    Alert.alert("Erro", "Não foi possível carregar a lista de manutentores.");
                }
            }
            fetchMaintainers();
        }
    }, [isAdmin, ordem?.status]); // Dispara quando a OS carregar e o status for 'PENDING'
    // --- Fim da Mudança 3 ---


    if (!ordem) {
        return (
            <Secao title="Relatório da Intervenção">
                <Text style={styles.value}>Carregando dados da ordem...</Text>
            </Secao>
        )
    }

    // Lógicas de permissão (permanecem iguais)
    const isEditable = isMaintainer && 
                       (ordem.status === 'ASSIGNED' || ordem.status === 'IN_PROGRESS') &&
                       ordem.maintainerId === user?.id;
    const canViewReport = ordem.status === 'IN_REVIEW' || ordem.status === 'COMPLETED';

    const dataEmissao = ordem.createdAt ? new Date(ordem.createdAt).toLocaleDateString('pt-BR') : "N/A";
    const dataConclusao = ordem.status === 'COMPLETED' ? new Date(ordem.updatedAt).toLocaleDateString('pt-BR') : 'Pendente';
    const prioridade = ordem.priority ? prioridadeLabel[ordem.priority] : "N/A";
    
    // --- MUDANÇA 4: 'handleAssignMaintainer' atualizado ---
    // Agora usa o 'manutentores' (do state) em vez de 'availableMaintainers' (da prop)
    const handleAssignMaintainer = async () => {
        if (!selectedMaintainerId) {
            Alert.alert("Erro", "Por favor, selecione um mantenedor da lista.");
            return;
        }
        
        // Busca o nome do manutentor na lista do state
        const selectedMaintainer = manutentores.find(m => m.id === selectedMaintainerId);
        if (!selectedMaintainer) {
             Alert.alert("Erro", "Mantenedor selecionado inválido.");
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
    // --- Fim da Mudança 4 ---
    
    const handleSubmitWork = async () => {
        // (Esta função permanece a mesma)
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
        // (Esta função permanece a mesma)
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

    const getStatusStyle = (status?: string) => {
        // (Esta função permanece a mesma)
        switch (status) {
            case 'PENDING': return styles.statusPending;
            case 'ASSIGNED': return styles.statusAssigned;
            case 'IN_PROGRESS': return styles.statusInProgress;
            case 'IN_REVIEW': return styles.statusInProgress; // Em Revisão (Amarelo)
            case 'COMPLETED': return styles.statusCompleted;
            default: return {};
        }
    };

    return (
        <>
            <View style={styles.mainContainer}>

                {/* (Seção de Datas... sem mudança) */}
                <View style={styles.dateCards}>
                    <View style={{ flex: 1 }}>
                        <Secao title="Data de Emissão:">
                            <Text style={styles.value}>{dataEmissao}</Text>
                        </Secao>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Secao title="Data de conclusão: ">
                            <Text style={styles.value}>{dataConclusao}</Text>
                        </Secao>
                    </View>
                </View>

                {/* (Seção de Prioridade... sem mudança) */}
                <Secao title="Prioridade da anomalia">
                    <Text style={styles.value}>{prioridade}</Text>
                </Secao>

                {/* (Seção de Diagnóstico... sem mudança) */}
                <Secao title="Equipamento e Diagnóstico">
                    <View style={styles.row}>
                        <View style={styles.field}>
                            <Text style={styles.label}>Nome:</Text>
                            <Text style={styles.value}>{ordem.machineName}</Text>
                        </View>
                        <View style={styles.field}>
                            <Text style={styles.label}>Identificação da Máquina:</Text>
                            <Text style={styles.value}>#{ordem.machineId}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.label}>Itens para Intervenção (Diagnóstico):</Text>
                        {ordem.payload && ordem.payload.length > 0 ? (
                            ordem.payload.map((item, index) => (
                                <View key={index} style={styles.itemPayload}>
                                    <Text style={styles.value}> {actionLabel[item.action]}</Text>
                                    <Text style={styles.subValue}>
                                        Conjunto ID: {item.setId}, Conjunto: {item.setName}
                                    </Text>
                                    <Text style={styles.subValue}>
                                        Sub-Conjunto: {item.subsetName}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.value}>Nenhum item de inspeção registrado.</Text>
                        )}
                    </View>
                    <View>
                        <Text style={styles.label}>Solicitante (Inspetor):</Text>
                        <Text style={styles.value}>{ordem.inspectorName}</Text>
                    </View>
                </Secao>
                
                {/* --- MUDANÇA 5: Seção de Atribuição (ADMIN) --- */}
                {isAdmin && ordem.status === 'PENDING' && (
                    <Secao title="Atribuir Ordem de Serviço">
                        <View>
                            <Text style={styles.label}>Selecione o Mantenedor:</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedMaintainerId}
                                    onValueChange={(itemValue) => setSelectedMaintainerId(itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="-- Selecione um mantenedor --" value={null} />
                                    {/* Mapeia a lista do 'manutentores' (do state) */}
                                    {manutentores.map((m) => (
                                        <Picker.Item key={m.id} label={m.name} value={m.id} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    </Secao>
                )}
                {/* --- Fim da Mudança 5 --- */}

                {/* Seção de Intervenção (Manutenção) */}
                <Secao title="Relatório de Manutenção">
                    <View style={styles.row}>
                        <View style={styles.field}>
                            <Text style={styles.label}>Mantenedor Atribuído:</Text>
                            <Text style={styles.value}>{ordem.maintainerName || (ordem.status === 'PENDING' ? "Aguardando atribuição" : "N/A")}</Text>
                        </View>
                        <View style={styles.field}>
                            <Text style={styles.label}>Status:</Text>
                            <Text style={[styles.value, getStatusStyle(ordem.status)]}>{ordem.status}</Text>
                        </View>
                    </View>
                    
                    <View>
                        <Text style={styles.label}>Serviço Realizado:</Text>
                        <TextInput 
                            style={[styles.textInput, !isEditable && styles.textInputDisabled]} 
                            placeholder={isEditable ? "Descreva os detalhes..." : (canViewReport ? "" : "Aguardando manutenção")} 
                            multiline 
                            editable={isEditable}
                            value={serviceNotes} 
                            onChangeText={setServiceNotes} 
                        />
                    </View>
                    <View>
                        <Text style={styles.label}>Materiais Utilizados:</Text>
                        <TextInput 
                            style={[styles.textInput, !isEditable && styles.textInputDisabled]} 
                            placeholder={isEditable ? "Descreva os materiais..." : (canViewReport ? "" : "Aguardando manutenção")} 
                            multiline 
                            editable={isEditable}
                            value={materialsUsed} 
                            onChangeText={setMaterialsUsed} 
                        />
                    </View>
                </Secao>

                {/* (Botões Condicionais... sem mudança) */}
                <View style={styles.actionButtonContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#A50702" />
                    ) : (
                        <>
                            {isAdmin && ordem.status === 'PENDING' && (
                                <TouchableOpacity style={styles.buttonAssign} onPress={handleAssignMaintainer}>
                                    <Text style={styles.buttonText}>Confirmar Atribuição</Text>
                                </TouchableOpacity>
                            )}

                            {isEditable && (
                                <TouchableOpacity style={styles.buttonSubmit} onPress={handleSubmitWork}>
                                    <Text style={styles.buttonText}>Submeter para Aprovação</Text>
                                </TouchableOpacity>
                            )}

                            {isAdmin && ordem.status === 'IN_REVIEW' && (
                                <TouchableOpacity style={styles.buttonApprove} onPress={handleApproveWork}>
                                    <Text style={styles.buttonText}>Aprovar e Concluir OS</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </View>
            </View>
        </>
    )
}


const styles = StyleSheet.create({
    mainContainer: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        marginBottom: 200,
    },
    cards: {
        backgroundColor: '#ffff',
        paddingLeft: 15,
        paddingRight: 15,
    },
    dateCards: {
        display: 'flex',
        flexDirection: 'row',
    },
    titleSecao: {
        backgroundColor: '#CE221E',
        color: 'white',
        padding: 12,
        fontSize: 16,
        fontWeight: '500',
    },
    contentSecao: {
        padding: 15,
        gap: 30
    },
    row: {
        flexDirection: 'row',
        gap: 15
    },
    field: {
        flex: 1
    },
    label: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 6
    },
    value: {
        fontSize: 16,
        color: '#212529',
        fontWeight: '500'
    },
    textInput: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingTop: 10,
        fontSize: 16,
        minHeight: 120,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: '#dee2e6'
    },
    textInputDisabled: {
        backgroundColor: '#e9ecef',
        color: '#6c757d',
    },
    itemPayload: {
        backgroundColor: '#fff',
        borderRadius: 6,
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee'
    },
    subValue: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
        marginLeft: 10,
    },
    actionButtonContainer: {
        padding: 15,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee'
    },
    buttonAssign: {
        backgroundColor: '#CE221E', 
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonSubmit: {
        backgroundColor: '#CE221E', 
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonApprove: {
        backgroundColor: '#1f8036ff', // Verde (Aprovar)
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
   
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#dee2e6',
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
        marginBottom: 15,
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#212529',
    },
 
    statusPending: {
        color: '#dc3545', 
        fontWeight: 'bold',
    },
     statusAssigned: {
        color: '#117e8fff', 
        fontWeight: 'bold',
    },
    statusInProgress: {
        color: '#ffc107', 
        fontWeight: 'bold',
    },
    statusCompleted: {
        color: '#28a745', 
        fontWeight: 'bold',
    }
});