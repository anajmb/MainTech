import { CircleArrowLeft, Lock, Shield, TriangleAlert } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function Privacidade() {
    return (
        <ScrollView style={styles.container}>

            <View style={styles.header}>
                <CircleArrowLeft />
                <Text style={styles.tituloHeader}>Privacidade e Segurança</Text>
            </View>

            <View style={styles.card}>

                <View>
                    <Shield/>
                    <Text style={styles.contaProtegida}>Conta Protegida</Text>
                    <Text style={styles.subtitulo}>Seu nível de segurança está alto</Text>
                </View>

                <View>
                    <View>
                        <Text style={styles.numero}>95%</Text>
                        <Text style={styles.subtitulo}>Segurança</Text>
                    </View>

                    <View>
                        <Text style={styles.numero}>2</Text>
                        <Text style={styles.subtitulo}>Fatores</Text>
                    </View>

                    <View>
                        <Text style={styles.numero}>24h</Text>
                        <Text style={styles.subtitulo}>Ativo</Text>
                    </View>
                </View>

            </View>

            <View style={styles.card}>
                <Lock/>
                <Text style={styles.tituloCard}>Alterar Senha</Text>

                <Text style={styles.label}>Senha atual</Text>
                <TextInput secureTextEntry style={styles.input} />

                <Text style={styles.label}>Nova Senha</Text>
                <TextInput secureTextEntry style={styles.input} />

                <Text style={styles.label}>Confirmação da Nova Senha</Text>
                <TextInput secureTextEntry style={styles.input} />
                

                <Text style={styles.botao}>Alterar Senha</Text>
            </View>

            <View style={styles.card}>
                <TriangleAlert/>
                <Text style={styles.tituloCard}>Dicas de Segurança</Text>

                <Text style={styles.dicas}>Use senhas únicas e complexas;</Text>
                <Text style={styles.dicas}>Mantenha o aplicativo sempre atualizado;</Text>
                <Text style={styles.dicas}>Não compartilhe suas credenciais;</Text>
                <Text style={styles.dicas}>Faça logout em dispositivos desconhecidos.</Text>
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  tituloHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#333",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  contaProtegida: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
    color: "#2E7D32",
  },
  subtitulo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  numero: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#910606ff",
    textAlign: "center",
  },
  indicadoresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  indicadorItem: {
    alignItems: "center",
    flex: 1,
  },
  tituloCard: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 12,
    color: "#333",
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    backgroundColor: "#FAFAFA",
    paddingRight: 40, 
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 18,
  },
  botao: {
    backgroundColor: "#910606ff",
    color: "#FFF",
    textAlign: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    fontWeight: "bold",
  },
  dicas: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
    paddingLeft: 8,
  },
  dicaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dicaIcone: {
    marginRight: 8,
    color: "#FF9800",
  },
});