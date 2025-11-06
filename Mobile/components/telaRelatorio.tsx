import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

// --- SEU COMPONENTE SECAO (Sem alterações) ---
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

// --- NOVO --- Interfaces para os dados
interface PayloadItem {
    setId: number;
    action: 'change' | 'repair';
    subsetId: number;
    machineId: number;
}

interface OrdemServico {
    id: number;
    machineId: number;
    priority: 'low' | 'medium' | 'high';
    payload: PayloadItem[];
    createdAt: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

// --- NOVO --- Props que o Relatorio agora espera
type RelatorioProps = {
    ordem: OrdemServico | null; // Recebe o objeto 'ordem' (pode ser null)
}

// --- NOVO --- Objeto para traduzir valores
const prioridadeLabel = {
    low: "Baixa Criticidade",
    medium: "Média Criticidade",
    high: "Alta Criticidade"
};

const actionLabel = {
    change: "Troca Necessária",
    repair: "Reparo Necessário"
};

// --- MODIFICADO --- Relatorio agora recebe 'ordem' como prop
export function Relatorio({ ordem }: RelatorioProps) {

    // Se 'ordem' ainda não foi carregado, exibe uma mensagem
    if (!ordem) {
        return (
            <Secao title="Relatório da Intervenção">
                <Text style={styles.value}>Carregando dados da ordem...</Text>
            </Secao>
        )
    }

    // Prepara os dados com "N/A" como fallback
    const dataEmissao = ordem.createdAt ? new Date(ordem.createdAt).toLocaleDateString('pt-BR') : "N/A";
    const prioridade = ordem.priority ? prioridadeLabel[ordem.priority] : "N/A";

    return (
        <>
            {/* --- MODIFICADO --- datas */}
            <Secao>
                <View style={styles.row}>
                    <View style={styles.field}>
                        <Text style={styles.label}>Data de Emissão: </Text>
                        <Text style={styles.value}>{dataEmissao}</Text>
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.label}>Data de conclusão: </Text>
                        {/* Este campo não existe na sua API, então é N/A */}
                        <Text style={styles.value}>N/A</Text> 
                    </View>
                </View>
            </Secao>

            {/* --- MODIFICADO --- prioridades */}
            <Secao title="Prioridade da anomalia">
                <Text style={styles.value}>{prioridade}</Text>
            </Secao>

            {/* --- MODIFICADO --- seção de equipamento e diagnostico */}
            <Secao title="Equipamento e Diagnóstico">
                <View style={styles.row}>
                    <View style={styles.field}>
                        <Text style={styles.label}>Nome:</Text>
                        {/* O nome (ex: "Bomba Hidráulica") não vem da API, apenas o ID */}
                        <Text style={styles.value}>N/A</Text>
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.label}>Identificação da Máquina:</Text>
                        <Text style={styles.value}>#{ordem.machineId}</Text>
                    </View>
                </View>
                
                {/* --- MODIFICADO --- O 'payload' agora é uma lista dinâmica */}
                <View>
                    <Text style={styles.label}>Itens para Intervenção (Diagnóstico):</Text>
                    {/* Mapeia o array 'payload' para exibir cada item */}
                    {ordem.payload && ordem.payload.length > 0 ? (
                        ordem.payload.map((item, index) => (
                            <View key={index} style={styles.itemPayload}>
                                <Text style={styles.value}>- {actionLabel[item.action]}</Text>
                                <Text style={styles.subValue}>
                                    (Conjunto ID: {item.setId}, Sub-Conjunto ID: {item.subsetId})
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.value}>Nenhum item de inspeção registrado.</Text>
                    )}
                </View>

                <View>
                    <Text style={styles.label}>Solicitante:</Text>
                    {/* Este campo não existe na sua API, então é N/A */}
                    <Text style={styles.value}>N/A</Text>
                </View>
            </Secao>

            {/* --- SEM ALTERAÇÕES --- seção dos inputs (continua igual) */}
            <Secao title="Relatório da Intervenção (Manutenção)">
                <View style={styles.row}>
                        <View style={styles.field}><Text style={styles.label}>Nome:</Text><Text style={styles.value}>N/A (Preenchido pelo Mantenedor)</Text></View>
                        <View style={styles.field}><Text style={styles.label}>Data:</Text><Text style={styles.value}>N/A</Text></View>
                </View>
                <View><Text style={styles.label}>Serviço Realizado:</Text><TextInput style={styles.textInput} placeholder="Descreva os detalhes..." multiline/></View>
                <View><Text style={styles.label}>Materiais Utilizados:</Text><TextInput style={styles.textInput}placeholder="Descreva os materiais..." multiline/></View>
            </Secao>
        </>
    )
}

const styles = StyleSheet.create({
    cards:{
       backgroundColor: '#eeeeee',
       paddingLeft: 15,
       paddingRight: 15,
       marginBottom: 20,
       borderBottomRightRadius: 10,
       borderBottomLeftRadius: 10,
       shadowColor: "#000",
       shadowOffset: { width: 0, height: 4 },
       shadowOpacity: 0.25,
       shadowRadius: 4,
       elevation: 4
    },
    titleSecao: {
       backgroundColor: '#CF0000',
       color: 'white',
       padding: 12,
       fontSize: 16, 
       fontWeight: '500', 
       borderTopLeftRadius: 8, 
       borderTopRightRadius: 8
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
    // --- NOVO --- Estilos para a lista do payload
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