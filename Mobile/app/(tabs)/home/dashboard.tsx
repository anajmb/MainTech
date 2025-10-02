import { StyleSheet, ScrollView, Text, View } from "react-native";
import { CheckCircle, ListTodo, Clock, ClipboardList, BarChartBig } from "lucide-react-native";


export default function Dashboard() {
    return (
        <ScrollView style={styles.page}>
            <View style={styles.logoBox}>
                <Text style={styles.logoText}>
                    <Text style={{ fontSize: 32 }}>⚙️</Text> MAINTECH
                </Text>
            </View>
            <View style={styles.headerBox}>
                <Text style={styles.headerTitle}>Dashboard</Text>
            </View>
            <Text style={styles.headerSubtitle}>e estatísticas</Text>
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

            <View style={styles.metricHeader}>
                <BarChartBig color="#D6231C" size={20} style={styles.graphicIcon} />
                <Text style={styles.sectionTitleGraphic}>Gráficos</Text>
            </View>


            <Text style={styles.sectionsubTitle}>Atividade semanal</Text>
            <View style={styles.graphCardsColumn}>
                <View style={styles.graphCard}></View>
                <View style={styles.graphCard}></View>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        paddingHorizontal: 18,
        padding: 20
    },
    logoBox: {
        alignItems: "center",
        marginTop: 45,
        marginBottom: 10
    },
    logoText: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#D6231C",
        textAlign: "center"
    },
    headerBox: {
        marginLeft: 10,
        marginBottom: 9
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 18
    },
    headerSubtitle: {
        color: "#848484",
        fontSize: 17,
        marginLeft: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 30,
        marginBottom: 29,
        marginLeft: 10
    },
    sectionsubTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 10
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
        paddingVertical: 27,
        paddingHorizontal: 16,
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
        fontWeight: "bold",
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
    sectionTitleGraphic: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 19,
        marginBottom: 15,
        marginLeft: 2,

    },
    graphicIcon: {
        marginRight: 8,
        marginLeft: 10
    },
    graphCardsColumn: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        marginTop: 20,
        marginBottom: 30
    },
    graphCard: {
        backgroundColor: "#f2f2f2",
        borderRadius: 12,
        width: "95%",
        padding: 50,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4
    }
});