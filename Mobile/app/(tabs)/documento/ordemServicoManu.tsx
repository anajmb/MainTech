import SetaVoltar from "@/components/setaVoltar"; // Importação Default (como no seu arquivo SetaVoltar)
import { TabsStyles } from "@/styles/globalTabs";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, Alert } from "react-native";
import React, { useEffect, useState, useCallback } from "react"; // Importe o useCallback
import { Relatorio } from "../../../components/telaRelatorio"; // Importando o componente Relatorio
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router"; // Importe useRouter e useFocusEffect
import { api } from "../../../lib/axios";
import { Toast } from "toastify-react-native";

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

export default function OrdemServico() {

    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter(); // Hook para navegação

    const [ordem, setOrdem] = useState<OrdemServico | null>(null);
    const [loading, setLoading] = useState(true);

   
    const fetchOrdem = useCallback(async () => {
        if (!id) {
            setLoading(false);
            Toast.error("Nenhum ID de ordem de serviço foi fornecido.");
            return;
        }
        try {
            setLoading(true);
            
            const response = await api.get(`/serviceOrders/getUnique/${id}`); 
            setOrdem(response.data);
        } catch (error: any) {
            console.log("Erro ao buscar OS:", error.response?.data);
            Toast.error("Falha ao carregar dados da ordem de serviço.");
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


    const handleUpdate = () => {
       
        router.back();
    };
  


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

                
                
            
            <Relatorio ordem={ordem} onUpdate={handleUpdate} />
           
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