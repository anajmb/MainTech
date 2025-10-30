import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import TasksCards from "./tasksCard";
import { api } from "@/lib/axios";
import Logo from "@/components/logo";
import { useAuth } from "@/hooks/useAuth";

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

                // se for inspetor, trazer só as tarefas dele
                if (user.role === "INSPECTOR") {
                    // assume que stored user tem id; se não tiver, adapte conforme seu shape
                    // cast seguro para any caso shape seja diferente
                    const inspectorId = (user as any).id;
                    if (inspectorId) params.inspectorId = inspectorId;
                }
                // admin não precisa de inspectorId (traz tudo)

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
        <ScrollView style={TabsStyles.container}>
            <Logo/>

            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Tarefas</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>Minhas tarefas</Text>
                </View>

                {/* botão + apenas para ADMIN */}
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

            <ScrollView>

            {loading ? (
                <ActivityIndicator size="large" color="#CF0000" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    // se for INSPECTOR, ao clicar vai para fazerTarefa; admin não tem navegação ao clicar
                    <TouchableOpacity
                      onPress={() => {
                        if (user.role === "INSPECTOR") {
                          router.push({
                            pathname: "../tarefas/fazerTarefaInspe",
                            params: { id: String(item.id) }
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
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Nenhuma tarefa encontrada.</Text>
                        </View>
                    }
                    />
                )}
                </ScrollView>
        </ScrollView>
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    }
});