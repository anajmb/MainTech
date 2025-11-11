import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from "react-native"; // --- NOVO ---
import React, { useEffect, useState } from "react";
import { Relatorio } from "../../../components/telaRelatorio";
import { useLocalSearchParams } from "expo-router";
import { api } from "../../../lib/axios";

interface OrdemServico {
    id: number;
    machineId: number;
    priority: 'low' | 'medium' | 'high';
    payload: any[];
    createdAt: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

const prioridadeLabel = {
    low: "Baixa Prioridade",
    medium: "Média Prioridade",
    high: "Alta Prioridade"
};

const statusLabel = {
    PENDING: "Pendente",
    IN_PROGRESS: "Em Andamento",
    COMPLETED: "Concluído"
};

export default function OrdemServico() {

    const { id } = useLocalSearchParams<{ id: string }>();

    const [ordem, setOrdem] = useState<OrdemServico | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            Alert.alert("Erro", "Nenhum ID de ordem de serviço foi fornecido.");
            return;
        }

        async function fetchOrdem() {
            try {
                setLoading(true);

                const response = await api.get(`/serviceOrders/getUnique/${id}`);
                setOrdem(response.data);
            } catch (error) {
                console.log(error);
                Alert.alert("Erro", "Falha ao carregar dados da ordem de serviço.");
            } finally {
                setLoading(false);
            }
        }

        fetchOrdem();
    }, [id]);

    if (loading) {
        return (
            <View style={[TabsStyles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#A50702" />
                <Text style={{ marginTop: 10 }}>Carregando Ordem de Serviço...</Text>
            </View>
        );
    }

    if (!ordem) {
        return (
            <ScrollView style={TabsStyles.container}>
                <View style={TabsStyles.headerPrincipal}>
                    <SetaVoltar />
                </View>
                <Text style={styles.infoValor}>Ordem de Serviço não encontrada.</Text>
            </ScrollView>
        );
    }

    const prioridade = ordem.priority ? prioridadeLabel[ordem.priority] : "N/A";
    const status = ordem.status ? statusLabel[ordem.status] : "N/A";
    const dataCriacao = ordem.createdAt ? new Date(ordem.createdAt).toLocaleDateString('pt-BR') : "N/A";

    return (
        <ScrollView style={TabsStyles.container}>
            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>

                    <Text style={TabsStyles.tituloPrincipal}>Ordem de Serviço #{ordem.id}</Text>

                    <Text style={TabsStyles.subtituloPrincipal}>{prioridade}</Text>
                </View>
            </View>

            {/* --- CORREÇÃO AQUI ---
                O componente 'Relatorio' espera a prop 'ordem' (o objeto inteiro),
                e não a prop 'payload'.
            */}
            <Relatorio ordem={ordem} />

            <View style={styles.botoesContainer}>
                <TouchableOpacity style={styles.btnPrincipal}>
                    <Text style={styles.botaoumText}>Salvar Alterações</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSecundario}>
                    <Text style={styles.botaoText}>Rejeitar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    // --- NOVO --- Estilos de Loading
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // --- NOVO --- Card de Informações
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 15, // Adapte se necessário
        marginBottom: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    infoCardTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    infoLinha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 15,
        color: '#666',
        fontWeight: '500',
    },
    infoValor: {
        fontSize: 15,
        color: '#000',
        fontWeight: 'bold',
    },

    // --- Seus Estilos Originais ---
    botoesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 25,
        marginBottom: 20,
        gap: 12,
    },
    btnPrincipal: {
        backgroundColor: '#A50702',
        borderRadius: 10, // quadrado
        paddingVertical: 10,
        width: 150, // menor
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
    btnSecundario: {
        backgroundColor: "#C5C5C5",
        borderRadius: 10, // quadrado
        paddingVertical: 10,
        width: 150, // menor
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
    botaoText: {
        color: "#5C5C5C",
        fontSize: 15,
        fontWeight: "400",
    },
    botaoumText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "400",
    },
});