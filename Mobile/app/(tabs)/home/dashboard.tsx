import { StyleSheet, ScrollView, Text, View } from "react-native";
import { CheckCircle, ListTodo, Clock, ClipboardList } from "lucide-react-native";

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
                <Text style={styles.headerSubtitle}>e estatísticas</Text>
            </View>
            {/* Métricas principais */}
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

            <Text style={styles.sectionTitle}>Gráficos</Text>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#fff",
        flex: 1,
        paddingHorizontal: 10,
    },
    logoBox: {
        alignItems: "center",
        marginTop: 24,
        marginBottom: 10,
    },
    logoText: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#D6231C",
        letterSpacing: 1,
        textAlign: "center",
    },
    headerBox: {
        marginLeft: 10,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
    },
    headerSubtitle: {
        color: "#848484",
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 25,
        marginBottom: 10,
        marginLeft: 10,
    },
    metricsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        gap: 0,
    },
    metricBox: {
        backgroundColor: "#eeeeee69",
        borderRadius: 10,
        paddingVertical: 16,
        paddingHorizontal: 16,
        width: "47%",
        minHeight: 100,
        justifyContent: "center",
        alignItems: "center",
        elevation: 2,
        boxShadow: '1px 5px 10px rgba(0, 0, 0, 0.25)',
        marginBottom: 10,
    
    },
    metricHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        marginLeft: 2,
        marginRight: 2,
        width: "100%",
    },
    metricIcon: {
        marginRight: 8,
        marginLeft: 2,
    },
    metricLabel: {
        fontSize: 14,
        color: "#444",
        textAlign: "left",
        fontWeight: "500",
        flexShrink: 1,
    },
    metricValueArea: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 48,
    },
    metricValue: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#222",
        textAlign: "center",
        marginBottom: 2,
    },
    metricSub: {
        fontSize: 12,
        color: "#8f8787ff",
        textAlign: "center",
        marginTop: 2,
        minHeight: 16,
    },
});