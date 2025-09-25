import { StyleSheet, ScrollView, Text, View } from "react-native";
import { CheckCircle, ListTodo, Clock, ClipboardList } from "lucide-react-native";

export default function Dashboard() {
  return (
    <ScrollView style={styles.container}>
      {/* Logo e título */}
      <View style={styles.logoContainer}>
        {/* Aqui pode colocar a logo */}
        <Text style={styles.logo}>MAINTECH</Text>
      </View>

      {/* Título do dashboard */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Dashboard</Text>
        <Text style={styles.subtitulo}>e estatísticas</Text>
      </View>

      {/* Métricas principais */}
      <Text style={styles.sectionTitle}>Métricas principais</Text>
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <CheckCircle color="#11C463" size={28} />
          <Text style={styles.metricTitle}>Tarefas concluídas</Text>
          <Text style={styles.metricValue}>85%</Text>
        </View>
        <View style={styles.metricCard}>
          <ListTodo color="#AC53F3" size={28} />
          <Text style={styles.metricTitle}>Total de tarefas</Text>
          <Text style={styles.metricValue}>15</Text>
          <Text style={styles.metricSub}>Neste mês</Text>
        </View>
      </View>
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Clock color="#438BE9" size={28} />
          <Text style={styles.metricTitle}>Tempo médio</Text>
          <Text style={styles.metricValue}>5 min</Text>
          <Text style={styles.metricSub}>check list</Text>
        </View>
        <View style={styles.metricCard}>
          <ClipboardList color="#D6231C" size={28} />
          <Text style={styles.metricTitle}>Ordens de serviço</Text>
          <Text style={styles.metricValue}>8</Text>
          <Text style={styles.metricSub}>Neste mês</Text>
        </View>
      </View>

      {/* Gráficos */}
      <Text style={styles.sectionTitle}>Gráficos</Text>
      {/* Aqui vão os gráficos depois */}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingHorizontal: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#D6231C",
    letterSpacing: 2,
  },
  header: {
    marginLeft: 10,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitulo: {
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
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
  metricCard: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    width: "45%",
    elevation: 2, // sombra leve para Android
    shadowColor: "#000", // sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
  },
  metricTitle: {
    fontSize: 14,
    color: "#444",
    marginTop: 8,
    marginBottom: 2,
    textAlign: "center",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 2,
  },
  metricSub: {
    fontSize: 12,
    color: "#848484",
    textAlign: "center",
  },
});