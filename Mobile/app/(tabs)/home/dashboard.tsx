import { StyleSheet, ScrollView, Text, View, ActivityIndicator, Alert } from "react-native";
import { CheckCircle, ListTodo, ClipboardList, BarChartBig, ChartPie, FileCheck, FolderCheck } from "lucide-react-native";
import { TabsStyles } from "@/styles/globalTabs";
import SetaVoltar from "@/components/setaVoltar";
import ChartWebView from "../../../components/chartWebView";
import type { ChartConfiguration } from 'chart.js';
import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/axios";
import { useAuth } from "@/contexts/authContext";

// --- INTERFACES ---
interface Task {
    id: number;
    status: 'PENDING' | 'COMPLETED';
    updateDate: string;
}

interface ServiceOrder {
    id: number;
    status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED';
    updatedAt: string;
    maintainerId?: number; // Adicionado para garantir tipagem
}

export default function Dashboard() {
    const { user } = useAuth();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
    const [loading, setLoading] = useState(true);

    // --- LÓGICA DE BUSCA ---
    const fetchDashboardData = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        try {
            if (user.role === 'ADMIN') {
                const [tasksRes, osRes] = await Promise.all([
                    api.get("/tasks/get"),
                    api.get("/serviceOrders/get")
                ]);
                setTasks(tasksRes.data);
                setServiceOrders(osRes.data);

            } else if (user.role === 'INSPECTOR') {
                const tasksRes = await api.get(`/tasks/get/inspetor/${user.id}`);
                setTasks(tasksRes.data);

            } else if (user.role === 'MAINTAINER') {
                // O backend deve retornar apenas as OSs deste manutentor
                const osRes = await api.get("/serviceOrders/get");
                setServiceOrders(osRes.data);
            }

        } catch (error) {
            console.error("Erro ao buscar dados do dashboard:", error);
            Alert.alert("Erro", "Não foi possível carregar os dados.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);


    // ---- CÁLCULOS ----

    // 1. Variáveis para ADMIN
    const adminTotalTasks = tasks.length;
    const adminTasksCompleted = tasks.filter(t => t.status === "COMPLETED").length;
    const adminTaskPercent = adminTotalTasks > 0 ? (adminTasksCompleted / adminTotalTasks) * 100 : 0;
    
    const adminTotalOS = serviceOrders.length;
    const adminOSCompletedCount = serviceOrders.filter(os => os.status === "COMPLETED").length;
    
    // 2. Variáveis para INSPECTOR / MAINTAINER
    let userTotal = 0;
    let userCompleted = 0;
    let userLabelTotal = "";
    
    // Para os gráficos do usuário
    let userGraphDataWeek = new Array(7).fill(0);
    let userPieData = [0, 0]; // [Concluídas, Pendentes]


    function isInCurrentWeek(dateString: string) {

        const date = new Date(dateString);
        const now = new Date();

        // Zerar horas para comparar apenas dias
        const day = now.getDay(); // 0 = domingo
        const diffToStart = day;
        const diffToEnd = 6 - day;

        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - diffToStart);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(now);
        weekEnd.setDate(now.getDate() + diffToEnd);
        weekEnd.setHours(23, 59, 59, 999);

        return date >= weekStart && date <= weekEnd;
    }

    if (user?.role === 'INSPECTOR') {
        userTotal = tasks.length;
        userCompleted = tasks.filter(t => t.status === "COMPLETED").length;
        userLabelTotal = "Checklists";


        // Gráficos Inspector (Baseado em Tasks)
        tasks.filter(t => t.status === "COMPLETED" && isInCurrentWeek(t.updateDate)).forEach(t => {
            const day = new Date(t.updateDate).getDay();
            userGraphDataWeek[day] += 1;
        });
        userPieData = [userCompleted, userTotal - userCompleted];

    } else if (user?.role === 'MAINTAINER') {
        // MAINTAINER: Filtra explicitamente se necessário, mas o backend já deve ter filtrado.
        // Vamos assumir que 'serviceOrders' contém apenas as OSs dele.

        userTotal = serviceOrders.length; // Total de OS atribuídas a ele

        // Considera "Feito" se estiver CONCLUÍDO ou EM REVISÃO (trabalho entregue)
        userCompleted = serviceOrders.filter(os => os.status === "COMPLETED" || os.status === "IN_REVIEW").length;

        userLabelTotal = "Ordens";

        // Gráficos Maintainer (Baseado em OS)
        serviceOrders.filter(os => os.status === "COMPLETED" || os.status === "IN_REVIEW"  &&
      isInCurrentWeek(os.updatedAt)).forEach(os => {
            const day = new Date(os.updatedAt).getDay();
            userGraphDataWeek[day] += 1;
        });
        userPieData = [userCompleted, userTotal - userCompleted];
    }

    const userPercentage = userTotal > 0 ? (userCompleted / userTotal) * 100 : 0;
    const userPending = userTotal - userCompleted;


    // ---- CONFIGURAÇÃO DOS GRÁFICOS ----

    // Seleciona os dados corretos para o gráfico
    const graphDataToUse = (user?.role === 'ADMIN') ?
        // Admin vê tasks completas no gráfico (exemplo)
        (() => {
            let data = new Array(7).fill(0);
            tasks.filter(t => t.status === "COMPLETED" && isInCurrentWeek(t.updateDate)).forEach(t => {
                data[new Date(t.updateDate).getDay()] += 1;
            });
            return data;
        })()
        : userGraphDataWeek;

    const pieDataToUse = (user?.role === 'ADMIN') ?
        [tasks.filter(t => t.status === "COMPLETED").length, tasks.length - tasks.filter(t => t.status === "COMPLETED").length]
        : userPieData;


    const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    const weeklyActivityConfig: ChartConfiguration = {
        type: 'bar',
        data: {
            labels: daysOfWeek,
            datasets: [{
                label: 'Concluídos',
                data: graphDataToUse,
                backgroundColor: '#E34945',
                borderRadius: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { precision: 0 } },
                x: { grid: { display: false } }
            }
        }
    };

    const pieChartConfig: ChartConfiguration = {
        type: 'pie',
        data: {
            labels: ['Concluídas', 'Pendentes'],
            datasets: [{
                data: pieDataToUse,
                backgroundColor: ['#AA9EFF', '#DBB9FF'],
                borderColor: '#ffffff',
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true, position: 'bottom' } },
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#CE221E" />
            </View>
        );
    }

    return (
        <ScrollView style={TabsStyles.container} contentContainerStyle={{ paddingBottom: 30 }}>
            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Dashboard</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>
                        {user?.role === 'ADMIN' ? "Visão Geral" : user?.role === 'MAINTAINER' ? "Área Técnica" : "Área de Inspeção"}
                    </Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Métricas principais</Text>

            {/* --- RENDERIZAÇÃO CONDICIONAL DOS CARDS --- */}

            {user?.role === 'ADMIN' ? (
                /* === LAYOUT DO ADMIN (4 Cards) === */
                <>
                    {/* Linha 1: Totais */}
                    <View style={styles.metricsRow}>
                        <View style={styles.metricBox}>
                            <View style={styles.metricHeader}>
                                <CheckCircle color="#11C463" size={20} style={styles.metricIcon} />
                                <Text style={styles.metricLabel}>Tarefas Concluídas</Text>
                            </View>
                            <View style={styles.metricValueArea}>
                                <Text style={styles.metricValue}>{adminTaskPercent.toFixed(0)}%</Text>
                                <Text style={styles.metricSub}>Taxa de sucesso</Text>
                            </View>
                        </View>

                        <View style={styles.metricBox}>
                            <View style={styles.metricHeader}>
                                <ListTodo color="#AC53F3" size={20} style={styles.metricIcon} />
                                <Text style={styles.metricLabel}>Total de tarefas</Text>
                            </View>
                            <View style={styles.metricValueArea}>
                                <Text style={styles.metricValue}>{adminTotalTasks}</Text>
                                <Text style={styles.metricSub}>Checklists</Text>
                            </View>
                        </View>
                    </View>

                    {/* Linha 2: Conclusão */}
                    <View style={styles.metricsRow}>
                        <View style={styles.metricBox}>
                            <View style={styles.metricHeader}>
                                <FolderCheck color="#438BE9" size={20} style={styles.metricIcon} />
                                <Text style={styles.metricLabel}>O.S. Completas</Text>
                            </View>
                            <View style={styles.metricValueArea}>
                                <Text style={styles.metricValue}>{adminOSCompletedCount}</Text>
                                <Text style={styles.metricSub}>Finalizadas</Text>
                            </View>
                        </View>

                        <View style={styles.metricBox}>
                            <View style={styles.metricHeader}>
                                <ClipboardList color="#D6231C" size={20} style={styles.metricIcon} />
                                <Text style={styles.metricLabel}>Ordens de serviço</Text>
                            </View>
                            <View style={styles.metricValueArea}>
                                <Text style={styles.metricValue}>{adminTotalOS}</Text>
                                <Text style={styles.metricSub}>Registradas</Text>
                            </View>
                        </View>
                    </View>
                </>
            ) : (
                /* === LAYOUT DO INSPETOR/MANUTENTOR (2 Cards) === */
                <View style={styles.metricsRow}>
                    <View style={styles.metricBox}>
                        <View style={styles.metricHeader}>
                            <CheckCircle color="#11C463" size={20} style={styles.metricIcon} />
                            <Text style={styles.metricLabel}>Concluídas</Text>
                        </View>
                        <View style={styles.metricValueArea}>
                            <Text style={styles.metricValue}>{userPercentage.toFixed(0)}%</Text>
                            <Text style={styles.metricSub}>Taxa de sucesso</Text>
                        </View>
                    </View>

                    <View style={styles.metricBox}>
                        <View style={styles.metricHeader}>
                            <ListTodo color="#AC53F3" size={20} style={styles.metricIcon} />
                            <Text style={styles.metricLabel}>Total</Text>
                        </View>
                        <View style={styles.metricValueArea}>
                            <Text style={styles.metricValue}>{userTotal}</Text>
                            <Text style={styles.metricSub}>{userLabelTotal}</Text>
                        </View>
                    </View>
                </View>
            )}

            <View style={styles.graphicTitleArea}>
                <Text style={styles.sectionTitleGraphic}>Gráficos</Text>
            </View>

            <View style={styles.graphCardsColumn}>
                {/* GRÁFICO DE BARRAS */}
                <View style={styles.graphCard}>
                    <View style={styles.graphText}>
                        <BarChartBig color="#CE221E" size={22} style={styles.graphicIcon} />
                        <Text style={styles.sectionsubTitle}>Atividade semanal</Text>
                    </View>
                    <ChartWebView config={weeklyActivityConfig} />
                </View>

                {/* GRÁFICO DE PIZZA */}
                <View style={styles.graphCard}>
                    <View style={styles.graphText}>
                        <ChartPie color="#AA9EFF" size={22} style={styles.graphicIcon} />
                        <Text style={styles.sectionsubTitle}>Atividades realizadas</Text>
                    </View>
                    <ChartWebView config={pieChartConfig} />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 20,
        fontWeight: "500",
        marginTop: 10,
        marginBottom: 25,
        marginLeft: 7
    },
    sectionsubTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 10,
        marginBottom: 10
    },
    metricsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    metricBox: {
        backgroundColor: "#eeeeee",
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 15,
        width: "47%",
        minHeight: 100,
        justifyContent: "center",
        alignItems: "center",
        elevation: 2,
        shadowColor: "#5d3f3f",
        shadowOffset: { width: 1, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        marginBottom: 10
    },
    metricHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        width: "100%",
        justifyContent: "center"
    },
    metricIcon: {
        marginRight: 6,
    },
    metricLabel: {
        fontSize: 13,
        color: "#444",
        textAlign: "center",
        fontWeight: "500"
    },
    metricValueArea: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 48
    },
    metricValue: {
        fontSize: 22,
        fontWeight: "500",
        color: "#222",
        marginTop: 0,
        textAlign: "center"
    },
    metricSub: {
        fontSize: 12,
        color: "#8f8787ff",
        textAlign: "center",
        marginTop: 10,
    },
    graphicTitleArea: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
    },
    sectionTitleGraphic: {
        fontSize: 20,
        fontWeight: "500",
    },
    graphicIcon: {
        marginRight: 8,
    },
    graphCardsColumn: {
        alignItems: "center",
        gap: 20,
        marginTop: 10,
        marginBottom: 30,
    },
    graphCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        width: "90%",
        height: 300,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    graphText: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },
});