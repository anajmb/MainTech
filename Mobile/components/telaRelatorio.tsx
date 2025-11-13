import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";


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
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

type RelatorioProps = {
    ordem: OrdemServico | null;
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

export function Relatorio({ ordem }: RelatorioProps) {

    if (!ordem) {
        return (
            <Secao title="Relatório da Intervenção">
                <Text style={styles.value}>Carregando dados da ordem...</Text>
            </Secao>
        )
    }


    const dataEmissao = ordem.createdAt ? new Date(ordem.createdAt).toLocaleDateString('pt-BR') : "N/A";
    const prioridade = ordem.priority ? prioridadeLabel[ordem.priority] : "N/A";

    return (
        <>

            <View style={styles.mainContainer}>

                <View style={styles.dateCards}>
                    <View style={{ flex: 1 }}>
                        <Secao title="Data de Emissão:">
                            <Text style={styles.value}>{dataEmissao}</Text>
                        </Secao>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Secao title="Data de conclusão: ">
                            <Text style={styles.value}>N/A</Text>
                        </Secao>
                    </View>
                </View>

                <Secao title="Prioridade da anomalia">
                    <Text style={styles.value}>{prioridade}</Text>
                </Secao>

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
                        <Text style={styles.label}>Solicitante:</Text>

                        <Text style={styles.value}>{ordem.inspectorName}</Text>
                    </View>
                </Secao>

                <Secao title="Relatório da Intervenção (Manutenção)">
                    <View style={styles.row}>
                        <View style={styles.field}><Text style={styles.label}>Nome:</Text><Text style={styles.value}>N/A (Preenchido pelo Mantenedor)</Text></View>
                        <View style={styles.field}><Text style={styles.label}>Data:</Text><Text style={styles.value}>N/A</Text></View>
                    </View>
                    <View><Text style={styles.label}>Serviço Realizado:</Text><TextInput style={styles.textInput} placeholder="Descreva os detalhes..." multiline /></View>
                    <View><Text style={styles.label}>Materiais Utilizados:</Text><TextInput style={styles.textInput} placeholder="Descreva os materiais..." multiline /></View>
                </Secao>
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
        // marginBottom: 500,
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
        backgroundColor: '#A50702',
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
    }
})