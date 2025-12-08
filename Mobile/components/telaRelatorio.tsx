import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, ActivityIndicator, Modal, FlatList } from "react-native";
import { useAuth } from "@/contexts/authContext";
import { api } from "@/lib/axios";
import { Toast } from "toastify-react-native";
import { TabsStyles } from "@/styles/globalTabs";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Download } from "lucide-react-native";

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
    const [erroMsg, setErroMsg] = useState("");

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
            setErroMsg("Por favor, selecione um manutentor da lista.");
            return;
        }
        const selectedMaintainer = manutentores.find(m => m.id === selectedMaintainerId);
        if (!selectedMaintainer) {
            setErroMsg("Manutentor selecionado inválido.");
            return;
        }

        setLoading(true);
        try {
            await api.patch(`/serviceOrders/assign/${ordem.id}`, {
                maintainerId: selectedMaintainer.id,
                maintainerName: selectedMaintainer.name
            });
            Toast.success("Ordem de Serviço atribuída.");
            onUpdate();
        } catch (error: any) {
            console.error("Erro ao atribuir:", error.response?.data);
            Toast.error("Erro", error.response?.data?.msg || "Não foi possível atribuir a OS.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitWork = async () => {
        if (!serviceNotes || !materialsUsed) {
            setErroMsg("Por favor, preencha os campos 'Serviço Realizado' e 'Materiais Utilizados'.");
            return;
        }
        setLoading(true);
        try {
            await api.patch(`/serviceOrders/submit/${ordem.id}`, {
                serviceNotes,
                materialsUsed
            });
            Toast.success("Relatório enviado para aprovação.");
            onUpdate();
        } catch (error: any) {
            console.error("Erro ao submeter:", error.response?.data);
            Toast.error(error.response?.data?.msg || "Não foi possível submeter o relatório.");
        } finally {
            setLoading(false);
        }
    };

    const handleApproveWork = async () => {
        setLoading(true);
        try {
            await api.patch(`/serviceOrders/approve/${ordem.id}`);
            Toast.success("Ordem de Serviço concluída.");
            onUpdate();
        } catch (error: any) {
            console.error("Erro ao aprovar:", error.response?.data);
            Toast.error(error.response?.data?.msg || "Não foi possível aprovar a OS.");
        } finally {
            setLoading(false);
        }
    };

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

    const handleDownloadPdf = async () => {
        if (!ordem) return;

        setLoading(true);

        try {
            // 1. Formata os dados para o HTML (Corrigido o uso de dateStyle/timeStyle)

            // Opções granulares para garantir a compatibilidade
            const dateOptions: Intl.DateTimeFormatOptions = {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false // Formato 24h (opcional)
            };

            const dataEmissaoFormatada = ordem.createdAt
                ? new Date(ordem.createdAt).toLocaleString('pt-BR', dateOptions)
                : "N/A";

            const dataConclusaoFormatada = ordem.status === 'COMPLETED' && ordem.updatedAt
                ? new Date(ordem.updatedAt).toLocaleString('pt-BR', dateOptions)
                : 'Pendente';

            const prioridade = ordem.priority ? prioridadeLabel[ordem.priority] : "N/A";
            const statusFormatado = formatStatus(ordem.status as any);

            // Gera o HTML para o payload (itens de diagnóstico)
            const payloadHtml = ordem.payload.map(item => `
                <div class="payload-item">
                    <p class="payload-action">• ${actionLabel[item.action]}</p>
                    <p class="payload-sub">Conjunto: ${item.setName} | Subconjunto: ${item.subsetName}</p>
                </div>
            `).join('');

            // 2. Define o conteúdo HTML
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                    <title>OS #${ordem.id}</title>
                    <style>
                        body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; }
                        .header { background-color: #A50702; color: white; padding: 15px; border-radius: 8px 8px 0 0; text-align: center; }
                        .header h1 { margin: 0; font-size: 20px; }
                        .section { border: 1px solid #ddd; border-top: none; padding: 15px; margin-bottom: 20px; background-color: #f9f9f9; }
                        .section-title { font-size: 16px; font-weight: bold; color: #A50702; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid #A50702; }
                        .info-row { display: flex; flex-direction: row; margin-bottom: 10px; }
                        .info-col { flex: 1; padding: 5px; }
                        .label { font-size: 12px; color: #666; margin-bottom: 2px; font-style: italic; }
                        .value { font-size: 14px; font-weight: bold; color: #212529; }
                        .full-row { margin-bottom: 15px; }
                        
                        /* Relatório */
                        .report-box { border: 1px solid #ccc; padding: 10px; border-radius: 8px; margin-top: 5px; background-color: white; white-space: pre-wrap; }
                        .payload-action { font-size: 14px; font-weight: bold; margin-bottom: 2px; }
                        .payload-sub { font-size: 12px; color: #555; margin-left: 10px; margin-bottom: 5px; }
                        .status-completed { color: #28a745; font-weight: bold; }
                        .status-label { font-style: normal; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Ordem de Serviço (OS) #${ordem.id}</h1>
                    </div>

                    <div class="section">
                        <p class="section-title">Informações Gerais</p>
                        <div class="info-row">
                            <div class="info-col">
                                <p class="label">Data de Emissão:</p>
                                <p class="value">${dataEmissaoFormatada}</p>
                            </div>
                            <div class="info-col">
                                <p class="label">Data de Conclusão:</p>
                                <p class="value">${dataConclusaoFormatada}</p>
                            </div>
                            <div class="info-col">
                                <p class="label">Status:</p>
                                <p class="value status-completed status-label">${statusFormatado}</p>
                            </div>
                        </div>
                        <div class="full-row">
                            <p class="label">Prioridade da Anomalia:</p>
                            <p class="value">${prioridade}</p>
                        </div>
                    </div>

                    <div class="section">
                        <p class="section-title">Equipamento e Diagnóstico</p>
                        <div class="info-row">
                            <div class="info-col">
                                <p class="label">Máquina:</p>
                                <p class="value">${ordem.machineName} (#${ordem.machineId})</p>
                            </div>
                            <div class="info-col">
                                <p class="label">Solicitante:</p>
                                <p class="value">${ordem.inspectorName}</p>
                            </div>
                        </div>
                        <div class="full-row">
                            <p class="label">Diagnóstico:</p>
                            ${payloadHtml}
                        </div>
                    </div>

                    <div class="section">
                        <p class="section-title">Relatório de Intervenção</p>
                        <div class="full-row">
                            <p class="label">Manutentor Responsável:</p>
                            <p class="value">${ordem.maintainerName || 'Não Atribuído'}</p>
                        </div>
                        <div class="full-row">
                            <p class="label">Serviço Realizado:</p>
                            <div class="report-box">${ordem.serviceNotes || 'Não registrado.'}</div>
                        </div>
                        <div class="full-row" style="margin-bottom: 0;">
                            <p class="label">Materiais Utilizados:</p>
                            <div class="report-box">${ordem.materialsUsed || 'Não registrado.'}</div>
                        </div>
                    </div>

                </body>
                </html>
            `;

            // 3. Geração e Compartilhamento
            const { uri } = await Print.printToFileAsync({
                html: htmlContent,
                base64: false,
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'application/pdf',
                    dialogTitle: `Download OS #${ordem.id} - ${ordem.machineName}`,
                    UTI: 'com.adobe.pdf'
                });
                Toast.success("PDF gerado e pronto para download!");
            } else {
                Alert.alert("Erro", "Compartilhamento não disponível neste dispositivo.");
            }

        } catch (error) {
            console.error('⚠️ Erro ao gerar/compartilhar PDF:', error);
            Alert.alert("Erro", "Não foi possível gerar o PDF da Ordem de Serviço.");
        } finally {
            setLoading(false);
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
                        <View>
                            <Text style={styles.value}>Nenhum item de inspeção registrado.</Text>
                        </View>
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

            {erroMsg !== "" && (
                <View style={TabsStyles.erroMsg}>
                    <Text style={TabsStyles.erroMsgText}>{erroMsg}</Text>
                </View>
            )}

            {/* BOTÕES DE AÇÃO */}
            <View style={styles.actionButtonContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#A50702" />
                ) : (
                    <>
                        {isAdmin && ordem.status === 'PENDING' && (
                            <TouchableOpacity style={styles.buttonAssign} onPress={handleAssignMaintainer}>
                                <Text style={styles.buttonText}>Confirmar atribuição</Text>
                            </TouchableOpacity>
                        )}

                        {isEditable && (
                            <TouchableOpacity style={styles.buttonSubmit} onPress={handleSubmitWork}>
                                <Text style={styles.buttonText}>Submeter para aprovação</Text>
                            </TouchableOpacity>
                        )}

                        {isAdmin && ordem.status === 'IN_REVIEW' && (
                            <View style={styles.buttonsContainer}>
                                <TouchableOpacity style={styles.buttonApprove} onPress={handleApproveWork}>
                                    <Text style={styles.buttonText}>Aprovar OS</Text>
                                </TouchableOpacity>

                                {/* Botão Atualizado para chamar handleRefuseWork */}
                                <TouchableOpacity style={styles.buttonDesapprove} onPress={handleRefuseWork}>
                                    <Text style={styles.buttonText}>Desaprovar OS</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {isAdmin && ordem.status === 'COMPLETED' && (
                            <TouchableOpacity style={styles.buttonDownload} onPress={handleDownloadPdf}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.buttonText}>Baixar Relatório</Text>
                                    <Download color="#fff" width={20} height={20} />
                                </View>
                            </TouchableOpacity>
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
        fontWeight: 500,
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
        fontSize: 13,
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
        color: "#fff",
        fontSize: 15,
        fontWeight: "400",
    },
    buttonDownload: {
        backgroundColor: "#A50702",
        color: "#fff",
        borderRadius: 10,
        paddingVertical: 12,
        width: "62%",
        marginTop: 25,
        marginBottom: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        alignSelf: "center"
    },

    // Status
    statusPending: { color: '#dc3545' },
    statusAssigned: { color: '#17a2b8' },
    statusInProgress: { color: '#ffc107' },
    statusCompleted: { color: '#28a745' }
});