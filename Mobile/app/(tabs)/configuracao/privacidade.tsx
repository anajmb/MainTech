import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Lock, Shield, TriangleAlert, Eye, EyeOff } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { useState } from "react";

const dicasDeSeguranca = [
  "Use senhas únicas e complexas;",
  "Mantenha o aplicativo sempre atualizado;",
  "Não compartilhe suas credenciais;",
  "Faça logout em dispositivos desconhecidos.",
];

export default function Privacidade() {
  // visibilidade dos inputs
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // valores dos inputs
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const canSubmit = currentPwd.trim() !== "" && newPwd.trim() !== "" && confirmPwd.trim() !== "";

  function handleChangePassword() {
    if (!canSubmit) {
      return Alert.alert("Preencher campos", "Por favor preencha todos os campos para alterar a senha.");
    }

    if (newPwd !== confirmPwd) {
      return Alert.alert("Senhas não conferem", "A nova senha e a confirmação devem ser iguais.");
    }

    //Chamando lógica para alterar a senha
    // placeholder de sucesso
    Alert.alert("Sucesso", "Senha alterada com sucesso.");

    // limpar campos
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  }

  return (
    <ScrollView style={TabsStyles.container}>
      <View style={TabsStyles.headerPrincipal}>
        <SetaVoltar />
        <View style={TabsStyles.conjHeaderPrincipal}>
          <Text style={TabsStyles.tituloPrincipal}>Privacidade e Segurança</Text>
          <Text style={TabsStyles.subtituloPrincipal}>Gerencie suas informações</Text>
        </View>
      </View>

      <View style={TabsStyles.todosCard}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <Shield color="#2E7D32" size={28} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Conta Protegida</Text>
              <Text style={styles.cardSubtitle}>Proteção de alto nível </Text>
            </View>
          </View>
        
          <View style={styles.statsContainer}>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Lock color="#E53935" size={20} />
            <Text style={styles.sectionTitle}>Alterar Senha</Text>
          </View>

          <Text style={styles.inputLabel}>Senha atual</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              secureTextEntry={!showCurrent}
              style={styles.textInput}
              placeholder=""
              value={currentPwd}
              onChangeText={setCurrentPwd}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowCurrent(v => !v)}
              activeOpacity={0.7}
            >
              {showCurrent ? <EyeOff color="#666" size={20} /> : <Eye color="#666" size={20} />}
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Nova senha</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              secureTextEntry={!showNew}
              style={styles.textInput}
              placeholder=""
              value={newPwd}
              onChangeText={setNewPwd}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowNew(v => !v)}
              activeOpacity={0.7}
            >
              {showNew ? <EyeOff color="#666" size={20} /> : <Eye color="#666" size={20} />}
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Confirmar nova senha</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              secureTextEntry={!showConfirm}
              style={styles.textInput}
              placeholder=""
              value={confirmPwd}
              onChangeText={setConfirmPwd}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirm(v => !v)}
              activeOpacity={0.7}
            >
              {showConfirm ? <EyeOff color="#666" size={20} /> : <Eye color="#666" size={20} />}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.btnAlterarSenha,
              { backgroundColor: canSubmit ? "#A50702" : "#BDBDBD" }
            ]}
            onPress={handleChangePassword}
            activeOpacity={0.8}
            disabled={!canSubmit}
          >
            <Text style={styles.btnAlterarSenhaText}>Alterar senha</Text>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -10,
    
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
  inputWrapper: {
    position: 'relative',
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "center",
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    top: 7,
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  btnAlterarSenha: {
    borderRadius: 10,
    paddingVertical: 12,
    width: 220,
    alignSelf: "center",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 8,
    backgroundColor: "#A50702",
  },
  btnAlterarSenhaText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "400",
    textAlign: "center",
  },
});''