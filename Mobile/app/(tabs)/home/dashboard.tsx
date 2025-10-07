import { StyleSheet, ScrollView, Text, View } from "react-native";
import { CheckCircle, ListTodo, Clock, ClipboardList, BarChartBig } from "lucide-react-native";
import { TabsStyles } from "@/styles/globalTabs";
import SetaVoltar from "@/components/setaVoltar";

// 1. Importe o componente que acabamos de criar
import ChartWebView from "../../../components/chartWebView";
import type { ChartConfiguration } from 'chart.js';

// 2. REMOVA o código `ChartJS.register(...)` daqui.

export default function Dashboard() {
    // 3. Defina as configurações para cada gráfico
    const weeklyActivityConfig: ChartConfiguration = {
        type: 'bar',
        data: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
            datasets: [{
                label: 'Tarefas Concluídas',
                data: [8, 12, 5, 9, 7, 4],
                backgroundColor: 'rgba(67, 139, 233, 0.6)', // Azul do ícone Clock
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
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
            datasets: [{
                label: 'Ordens de Serviço',
                data: [5, 8, 12, 10, 15],
                borderColor: 'rgba(214, 35, 28, 0.8)', // Vermelho do ícone ClipboardList
                backgroundColor: 'rgba(214, 35, 28, 0.1)',
                fill: true,
                tension: 0.3
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

    return (
        <ScrollView style={TabsStyles.container} contentContainerStyle={{ paddingBottom: 30 }}>

            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Dashboards</Text>
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



                        <Text style={styles.metricValue}>85%</Text>

                        <Text style={styles.metricSub}>{""}</Text>

                    </View>

                </View>

                <View style={styles.metricBox}>

                    <View style={styles.metricHeader}>

                        <ListTodo color="#AC53F3" size={20} style={styles.metricIcon} />

                        <Text style={styles.metricLabel}>Total de tarefas</Text>

                    </View>

                    <View style={styles.metricValueArea}>

                        <Text style={styles.metricValue}>15</Text>

                        <Text style={styles.metricSub}>Neste mês</Text>

                    </View>

                </View>

            </View>

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
                <BarChartBig color="#333" size={20} style={styles.graphicIcon} />
                <Text style={styles.sectionTitleGraphic}>Gráficos</Text>
            </View>

            {/* 4. Implementação dos gráficos nos cards */}
            <View style={styles.graphCardsColumn}>
                <View style={styles.graphCard}>
                    <Text style={styles.sectionsubTitle}>Atividade semanal</Text>
                    <ChartWebView config={weeklyActivityConfig} />
                </View>
                <View style={styles.graphCard}>
                    <Text style={styles.sectionsubTitle}>Ordens de Serviço (Últimos Meses)</Text>
                    <ChartWebView config={serviceOrdersConfig} />
                </View>
            </View>

        </ScrollView>
    );
}

// 5. Estilos atualizados para os gráficos
const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 15,
        marginBottom: 20,
        marginLeft: 20
    },
    sectionsubTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
        color: '#444'
    },
    metricsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
        paddingHorizontal: 15
    },
    metricBox: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        width: "48%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    metricHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    metricIcon: { marginRight: 8 },
    metricLabel: {
        fontSize: 14,
        color: "#555",
        fontWeight: "500",
        flexShrink: 1,
    },
    metricValueArea: {},
    metricValue: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#222",
    },
    metricSub: {
        fontSize: 12,
        color: "#888",
        marginTop: 2,
    },
    graphicTitleArea: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 15,
        marginLeft: 20,
    },
    sectionTitleGraphic: {
        fontSize: 20,
        fontWeight: "bold",
    },
    graphicIcon: {
        marginRight: 8,
    },
    graphCardsColumn: {
        alignItems: "center",
        gap: 20,
    },
    graphCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        width: "90%",
        height: 250, // Essencial para o WebView ter onde desenhar
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        overflow: 'hidden',
    }
});