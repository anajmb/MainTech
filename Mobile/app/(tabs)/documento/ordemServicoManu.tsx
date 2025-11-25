import SetaVoltar from "@/components/setaVoltar"; // Importação Default (como no seu arquivo SetaVoltar)
import { TabsStyles } from "@/styles/globalTabs";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, Alert } from "react-native";
import React, { useEffect, useState, useCallback } from "react"; // Importe o useCallback
import { Relatorio } from "../../../components/telaRelatorio"; // Importando o componente Relatorio
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router"; // Importe useRouter e useFocusEffect
import { api } from "../../../lib/axios";

// --- MUDANÇA 1: Interface ATUALIZADA ---
// (Deve ser idêntica à interface do seu componente Relatorio)
interface OrdemServico {
    id: number;
    machineId: number;
    machineName: string; 
    location: string; 
    priority: 'low' | 'medium' | 'high';
    payload: any[];
    createdAt: string;
    updatedAt: string; 
    inspectorId: number; 
    inspectorName: string; 
    maintainerId?: number;
    maintainerName?: string;
    serviceNotes?: string;
    materialsUsed?: string;
    status?: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED'; 
}
// --- Fim da Mudança 1 ---

export default function OrdemServico() {

    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter(); // Hook para navegação

    const [ordem, setOrdem] = useState<OrdemServico | null>(null);
    const [loading, setLoading] = useState(true);

    // --- MUDANÇA 2: fetchOrdem agora usa useCallback ---
    const fetchOrdem = useCallback(async () => {
        if (!id) {
            setLoading(false);
            Alert.alert("Erro", "Nenhum ID de ordem de serviço foi fornecido.");
            return;
        }
        try {
            setLoading(true);
            // Rota correta (como você tinha)
            const response = await api.get(`/serviceOrders/getUnique/${id}`); 
            setOrdem(response.data);
        } catch (error: any) {
            console.log("Erro ao buscar OS:", error.response?.data);
            Alert.alert("Erro", "Falha ao carregar dados da ordem de serviço.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    // Usamos useFocusEffect para garantir que os dados sejam recarregados
    // se o usuário sair e voltar para esta tela.
    useFocusEffect(
        useCallback(() => {
            fetchOrdem();
        }, [fetchOrdem])
    );
    // --- Fim da Mudança 2 ---


    // --- MUDANÇA 3: Função 'onUpdate' real ---
    // Esta função é passada para o Relatorio.tsx.
    // Quando o Relatorio.tsx (filho) terminar uma ação (atribuir, submeter),
    // ele chamará esta função, que navegará de volta.
    const handleUpdate = () => {
        // A tela anterior (Documentos) já usa useFocusEffect,
        // então ela será recarregada automaticamente quando voltarmos.
        router.back();
    };
    // --- Fim da Mudança 3 ---


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

    // (As labels de prioridade e status foram removidas daqui,
    // pois o componente 'Relatorio' já cuida disso)

    return (
        <ScrollView style={TabsStyles.container}>
            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Ordem de Serviço #{ordem.id}</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>{ordem.machineName || "Detalhes"}</Text>
                </View>
            </View>
             <View style={TabsStyles.todosCard}>

            {/* --- MUDANÇA 4: Passando a prop 'onUpdate' correta --- */}
            {/* Agora o componente Relatorio tem o 'ordem' e a função 'handleUpdate' */}
            <Relatorio ordem={ordem} onUpdate={handleUpdate} />
            {/* --- Fim da Mudança 4 --- */}


            {/* --- MUDANÇA 5: Botões antigos REMOVIDOS --- */}
            {/* O componente 'Relatorio' agora cuida de todos os botões */}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoValor: {
        fontSize: 15,
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 20,
    },
    
    // Removidos os estilos de botões que não são mais usados nesta página
});