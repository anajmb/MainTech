import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Lock, Shield, TriangleAlert } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const dicasDeSeguranca = [
  "Use senhas únicas e complexas;",
  "Mantenha o aplicativo sempre atualizado;",
  "Não compartilhe suas credenciais;",
  "Faça logout em dispositivos desconhecidos.",
];

export default function Privacidade() {
  return (
    <ScrollView style={TabsStyles.container}>
      <View style={TabsStyles.headerPrincipal}>
        <SetaVoltar />
        <View style={TabsStyles.conjHeaderPrincipal}>
          <Text style={TabsStyles.tituloPrincipal}>Privacidade e Segurança</Text>
          <Text style={TabsStyles.subtituloPrincipal}>Gerencie suas informações</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconContainer}>
            <Shield color="#2E7D32" size={28} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Conta Protegida</Text>
            <Text style={styles.cardSubtitle}>Seu nível de segurança está alto</Text>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>95%</Text>
            <Text style={styles.statLabel}>Segurança</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Fatores</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24h</Text>
            <Text style={styles.statLabel}>Ativo</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Lock color="#E53935" size={20} />
          <Text style={styles.sectionTitle}>Alterar Senha</Text>
        </View>
        <Text style={styles.inputLabel}>Senha atual</Text>
        <TextInput secureTextEntry style={styles.textInput} />
        <Text style={styles.inputLabel}>Nova senha</Text>
        <TextInput secureTextEntry style={styles.textInput} />
        <Text style={styles.inputLabel}>Confirmar nova senha</Text>
        <TextInput secureTextEntry style={styles.textInput} />
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.buttonText}>Alterar Senha</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <TriangleAlert color="#FFA000" size={20} />
          <Text style={styles.sectionTitle}>Dicas de Segurança</Text>
        </View>
        {dicasDeSeguranca.map((dica, index) => (
          <View key={index} style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>{dica}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
    marginBottom: 16,
    elevation: 5,
    shadowColor: "#000",
     shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconContainer: {
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
     color: "#2E7D32",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 4,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#E53935",
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
    sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 12,
  },
  inputLabel: {
    fontSize: 15,
    color: "#555",
    marginBottom: 8,
    marginTop: 12,
  },
  textInput: {
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 0,
    marginBottom: 4,
  },
  actionButton: {
    backgroundColor: "#E53935",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
    tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipBullet: {
    fontSize: 14,
    color: '#BDBDBD',
    marginRight: 8,
    lineHeight: 22,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
});