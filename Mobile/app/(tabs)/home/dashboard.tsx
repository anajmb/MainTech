import { StyleSheet, ScrollView, Text, View, ActivityIndicator } from "react-native";
import { CheckCircle, ListTodo, Clock, ClipboardList, BarChartBig, ChartPie } from "lucide-react-native";
import { TabsStyles } from "@/styles/globalTabs";
import SetaVoltar from "@/components/setaVoltar";
import ChartWebView from "../../../components/chartWebView";
import type { ChartConfiguration } from 'chart.js';
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

// Interface atualizada para corresponder ao enum do Prisma
interface Task {
    id: number;
    status: 'PENDING' | 'COMPLETED';
    updateDate: string;
}

export default function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            // Verifique se a sua rota no backend é '/tasks/get' ou '/tasks'
            const response = await api.get("/tasks/get");
            setTasks(response.data);
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // ---- Processamento de Dados Dinâmicos ----

    // Lógica de filtro atualizada para 'COMPLETED' e 'PENDING'
    const completedTasks = tasks.filter(t => t.status.toUpperCase() === "COMPLETED");
    const pendingTasks = tasks.filter(t => t.status.toUpperCase() === "PENDING");
    const totalTasks = tasks.length;

      const percentageCompleted = totalTasks > 0 
        ? (completedTasks.length / totalTasks) * 100 
        : 0;

    // Lógica para o gráfico de atividade semanal
    const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const completedByDay = new Array(7).fill(0);

    completedTasks.forEach(task => {
        const dayIndex = new Date(task.updateDate).getDay();
        completedByDay[dayIndex] += 1;
    });

    // Configurações dos gráficos agora com dados dinâmicos
    const weeklyActivityConfig: ChartConfiguration = {
        type: 'bar',
        data: {
            labels: daysOfWeek,
            datasets: [{
                label: 'Tarefas Concluídas',
                data: completedByDay, // DADO DINÂMICO
                backgroundColor: '#E34945',
                borderRadius: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true },
                x: { grid: { display: false } }
            }
        }
    };

    const serviceOrdersConfig: ChartConfiguration = {
        type: 'pie',
        data: {
            labels: ['Concluídas', 'Pendentes'],
            datasets: [{
                data: [completedTasks.length, pendingTasks.length], // DADOS DINÂMICOS
                backgroundColor: ['#AA9EFF', '#DBB9FF'],
                borderColor: '#ffffff',
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
        }
    };

    // Renderiza um indicador de carregamento enquanto os dados não chegam
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#CE221E" />
                <Text style={{ marginTop: 10, color: '#555' }}>Carregando dados...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={TabsStyles.container} contentContainerStyle={{ paddingBottom: 30 }}>
            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Dashboard</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>e estatísticas</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Métricas principais</Text>
            <View style={styles.metricsRow}>
                <View style={styles.metricBox}>
                    <View style={styles.metricHeader}>
                        <CheckCircle color="#11C463" size={20} style={styles.metricIcon} />
                        <Text style={styles.metricLabel}>Tarefas concluídas</Text>
                    </View>
                    <View style={styles.metricValueArea}>
                        <Text style={styles.metricValue}>{percentageCompleted.toFixed(0)}%</Text>
                        <Text style={styles.metricSub}></Text>
                    </View>
                </View>

                <View style={styles.metricBox}>
                    <View style={styles.metricHeader}>
                        <ListTodo color="#AC53F3" size={20} style={styles.metricIcon} />
                        <Text style={styles.metricLabel}>Total de tarefas</Text>
                    </View>
                    <View style={styles.metricValueArea}>
                        <Text style={styles.metricValue}>{totalTasks}</Text>
                        <Text style={styles.metricSub}>Neste mês</Text>
                    </View>
                </View>
            </View>

            {/* Métricas mantidas conforme o pedido */}
            <View style={styles.metricsRow}>
                <View style={styles.metricBox}>
                    <View style={styles.metricHeader}>
                        <Clock color="#438BE9" size={20} style={styles.metricIcon} />
                        <Text style={styles.metricLabel}>Tempo médio</Text>
                    </View>
                    <View style={styles.metricValueArea}>
                        <Text style={styles.metricValue}>5 min</Text>
                        <Text style={styles.metricSub}>Check list</Text>
                    </View>
                </View>
                <View style={styles.metricBox}>
                    <View style={styles.metricHeader}>
                        <ClipboardList color="#D6231C" size={20} style={styles.metricIcon} />
                        <Text style={styles.metricLabel}>Ordens de serviço</Text>
                    </View>
                    <View style={styles.metricValueArea}>
                        <Text style={styles.metricValue}>8</Text>
                        <Text style={styles.metricSub}>Neste mês</Text>
                    </View>
                </View>
            </View>

            <View style={styles.graphicTitleArea}>
                <Text style={styles.sectionTitleGraphic}>Gráficos</Text>
            </View>

            <View style={styles.graphCardsColumn}>
                <View style={styles.graphCard}>
                    <View style={styles.graphText}>
                        <BarChartBig color="#CE221E" size={22} style={styles.graphicIcon} />
                        <Text style={styles.sectionsubTitle}>Atividade semanal</Text>
                    </View>
                    <ChartWebView config={weeklyActivityConfig} />
                </View>
                <View style={styles.graphCard}>
                    <View style={styles.graphText}>
                        <ChartPie color="#AA9EFF" size={22} style={styles.graphicIcon} />
                        <Text style={styles.sectionsubTitle}>Atividades realizadas</Text>
                    </View>
                    <ChartWebView config={serviceOrdersConfig} />
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
        gap: 0
    },
    metricBox: {
        backgroundColor: "#eeeeee69",
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 10,
        width: "47%",
        minHeight: 100,
        justifyContent: "center",
        alignItems: "center",
        elevation: 2,
        boxShadow: '1px 5px 10px rgba(93, 63, 63, 0.25)',
        marginBottom: 10
    },
    metricHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        marginLeft: 2,
        marginRight: 2,
        width: "100%"
    },
    metricIcon: {
        marginRight: 8,
        marginLeft: 2
    },
    metricLabel: {
        fontSize: 14,
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
        marginTop: 9,
        paddingVertical: 6,
        textAlign: "center"
    },
    metricSub: {
        fontSize: 12,
        color: "#8f8787ff",
        textAlign: "center",
        marginTop: 10,
        minHeight: 16
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
        height: 250, // Dê uma altura fixa para o WebView renderizar
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden', // Garante que o gráfico não vaze pelas bordas arredondadas
    },
    graphText: {
        flexDirection: "row"
    },

});