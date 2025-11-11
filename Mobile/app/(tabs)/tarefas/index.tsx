import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
// --- Removido 'ScrollView' ---
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";
import TasksCards from "./tasksCard";
import { api } from "@/lib/axios";
import Logo from "@/components/logo";
import { useAuth } from "@/contexts/authContext";

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

    useEffect(() => {
        async function fetchTasks() {
            if (!user) return; // espera user carregado
            setLoading(true);
            try {
                const params: { status?: string; inspectorId?: number | string } = {};

                if (filtro === "pendente") {
                    params.status = "PENDING";
                }
                if (filtro === "concluida") {
                    params.status = "COMPLETED";
                }
                if (user.role === "INSPECTOR") {
                    const inspectorId = (user as any).id;
                    if (inspectorId) params.inspectorId = inspectorId;
                }

                const response = await api.get('/tasks/get', { params });
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchTasks();
    }, [filtro, user]);

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

                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            if (user.role === "INSPECTOR") {

                                // --- Esta é a linha importante ---
                                // Ela envia o ID da Tarefa (item.id)
                                const paramsParaEnviar = { taskId: item.id }; 
                                // --- Fim ---

                                router.push({
                                    pathname: "/tarefas/fazerTarefaInspe", // Verifique se este é o nome correto do arquivo
                                    params: { codigo: JSON.stringify(paramsParaEnviar) }
                                });
                            }
                        }}
                        activeOpacity={user.role === "INSPECTOR" ? 0.7 : 1}
                    >
                        <TasksCards
                            id={item.id}
                            title={item.title}
                            description={item.description}
                            updateDate={item.updateDate}
                            status={item.status}
                        />
                    </TouchableOpacity>
                )}

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


// Seus estilos permanecem os mesmos
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
        justifyContent: 'space-around',
        marginBottom: 50,
        backgroundColor: '#eeeeee',
        paddingVertical: 25,
        borderRadius: 12,
        paddingHorizontal: 5,
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
    },
    filtroTitulo: {
        padding: 10,
        borderRadius: 20,
        paddingHorizontal: 20,
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