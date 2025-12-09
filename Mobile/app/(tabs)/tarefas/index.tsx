import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Plus } from "lucide-react-native";
import { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";
import TasksCards from "./tasksCard";
import { api } from "@/lib/axios";
import Logo from "@/components/logo";
import { useAuth } from "@/contexts/authContext";
import { useFocusEffect } from "@react-navigation/native";

interface Task {
    id: number;
    title: string;
    description: string;
    inspectorId: number;
    machineId: number;
    status: string;
    updateDate: string;
}

export default function Tarefas() {
    const { user } = useAuth();
    const router = useRouter();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [filtro, setFiltro] = useState<"todas" | "pendente" | "concluida">("todas");
    const [loading, setLoading] = useState(true);

   useFocusEffect(
    useCallback(() => {
        async function fetchTasks() {
            if (!user) return;
            setLoading(true);

            try {
                const params: { status?: string; inspectorId?: number | string } = {};

                if (filtro === "pendente") params.status = "PENDING";
                if (filtro === "concluida") params.status = "COMPLETED";

                if (user.role === "INSPECTOR") {
                    const inspectorId = (user as any).id;
                    if (inspectorId) {
                        params.inspectorId = inspectorId;
                        console.log("🔍 Buscando tarefas para inspetor ID:", inspectorId); // DEBUG
                    }
                }

                console.log("📤 Parâmetros enviados:", params); // DEBUG

                const response = await api.get('/tasks/get', { params });
                
                console.log("📥 Tarefas retornadas:", response.data); // DEBUG

                const tarefasOrdenadas = response.data.sort(
                    (a: Task, b: Task) =>
                        new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime()
                );

                setTasks(tarefasOrdenadas);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchTasks();
    }, [filtro, user])
);

    if (!user) return <ActivityIndicator size="large" color="#CF0000" style={{ flex: 1 }} />;

    return (
        <View style={TabsStyles.container}>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}

                ListHeaderComponent={
                    <>
                        <Logo />
                        <View style={TabsStyles.headerPrincipal}>
                            <SetaVoltar />
                            <View style={TabsStyles.conjHeaderPrincipal}>
                                <Text style={TabsStyles.tituloPrincipal}>Tarefas</Text>
                                <Text style={TabsStyles.subtituloPrincipal}>Minhas tarefas</Text>
                            </View>
                            {user.role === "ADMIN" && (
                                <Link href={'/tarefas/novaTarefa'}>
                                    <View style={styles.plusButton}>
                                        <Plus color={"#fff"} strokeWidth={1.8} size={30} />
                                    </View>
                                </Link>
                            )}
                        </View>
                        
                        {/* Filtro Ajustado */}
                        <View style={styles.filtro}>
                            <TouchableOpacity onPress={() => setFiltro("todas")}>
                                <Text style={[styles.filtroTitulo, filtro === "todas" && styles.filtroAtivo]}>
                                    Todas
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setFiltro("pendente")}>
                                <Text style={[styles.filtroTitulo, filtro === "pendente" && styles.filtroAtivo]}>
                                    Pendentes
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setFiltro("concluida")}>
                                <Text style={[styles.filtroTitulo, filtro === "concluida" && styles.filtroAtivo]}>
                                    Concluídas
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                }

                renderItem={({ item }) => {
                    const isCompleted = item.status === "COMPLETED";

                    return (
                        <TouchableOpacity
                            disabled={isCompleted || user.role !== "INSPECTOR"}
                            onPress={() => {
                                if (user.role === "INSPECTOR" && !isCompleted) {
                                    const paramsParaEnviar = { taskId: item.id };
                                    router.push({
                                        pathname: "/tarefas/fazerTarefaInspe",
                                        params: { codigo: JSON.stringify(paramsParaEnviar) },
                                    });
                                }
                            }}
                            activeOpacity={isCompleted ? 1 : 0.7}
                        >
                            <TasksCards
                                id={item.id}
                                title={item.title}
                                description={item.description}
                                updateDate={item.updateDate}
                                status={item.status}
                            />
                        </TouchableOpacity>
                    );
                }}

                ListEmptyComponent={
                    loading ? (
                        <ActivityIndicator size="large" color="#CF0000" style={{ marginTop: 50 }} />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Nenhuma tarefa encontrada.</Text>
                        </View>
                    )
                }
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    plusButton: {
        backgroundColor: "#D10B03",
        borderRadius: 25,
        padding: 8,
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    filtro: {
        flexDirection: 'row',
        justifyContent: 'space-between', // ALTERADO: Garante espaçamento igual
        alignItems: 'center', // ADICIONADO: Centraliza verticalmente
        marginBottom: 50,
        backgroundColor: '#eeeeee',
        paddingVertical: 25,
        borderRadius: 12,
        paddingHorizontal: 30, // AJUSTADO: Reduzido de 45 para 30 para equilibrar
        // Sombra compatível com Android e iOS
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    filtroTitulo: {
        padding: 10,
        borderRadius: 20,
        paddingHorizontal: 20,
        textAlign: 'center', // Garante alinhamento do texto
    },
    filtroAtivo: {
        color: "#fff",
        backgroundColor: '#CF0000'
    },
    emptyContainer: {
        flex: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    }
});