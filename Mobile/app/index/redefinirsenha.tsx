import { useLocalSearchParams, useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { api } from "@/lib/axios";

export default function RedefinirSenha() {
  const { email } = useLocalSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const router = useRouter();

  const handleResetPassword = async () => {
    if (password !== confirm) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    try {
      await api.post("/auth/reset-password", { email, newPassword: password });
      Alert.alert("Sucesso", "Senha redefinida com sucesso!");
      router.push("/(tabs)/home");
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.error || "Falha ao redefinir senha");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={-2}>
      <View style={styles.container}>
        <Image style={styles.backgroundImage} source={require("../../assets/images/background-mobile.png")} resizeMode="cover" />
        <View style={styles.infosLogo}>
          <Image style={styles.logoImage} source={require("../../assets/images/LogoBranca.png")} resizeMode="cover" />
          <Text style={styles.logoNome}>Gestão de maquinas</Text>
        </View>

        <View style={styles.cardLogin}>
          <View style={styles.formLogin}>
            <Text style={styles.tituloLogin}>Redefinir Senha</Text>

            <View style={{ gap: 8 }}>
              <Text style={styles.labelLogin}>Nova Senha:</Text>
              <View>
                <TextInput
                  style={styles.inputLogin}
                  placeholder="*************"
                  placeholderTextColor="#B9B9B9"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.eyeFechado} onPress={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ gap: 8 }}>
              <Text style={styles.labelLogin}>Confirmar Senha:</Text>
              <View>
                <TextInput
                  style={styles.inputLogin}
                  placeholder="*************"
                  placeholderTextColor="#B9B9B9"
                  secureTextEntry={!showConfirmPassword}
                  value={confirm}
                  onChangeText={setConfirm}
                />
                <TouchableOpacity style={styles.eyeFechado} onPress={() => setShowConfirmPassword((prev) => !prev)}>
                  {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ alignItems: "center" }}>
              <TouchableOpacity style={styles.botaoLogin} onPress={handleResetPassword}>
                <Text style={{ color: "#fff" }}> Enviar </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-end", alignItems: "center" },
  infosLogo: { position: "absolute", top: 100 },
  backgroundImage: { position: "absolute", width: "100%", height: "100%", zIndex: -1 },
  logoImage: { height: 250, width: 300 },
  logoNome: { color: "#fff", alignItems: "center", left: 100, top: -100 },
  cardLogin: { backgroundColor: "#fff", width: "100%", borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30, minHeight: "45%" },
  formLogin: { gap: 18, height: "100%", flex: 1 },
  tituloLogin: { fontSize: 35, alignSelf: "center", marginBottom: 20, fontFamily: "poppins" },
  labelLogin: { fontSize: 13, color: "#222222ff" },
  inputLogin: { backgroundColor: "#E6E6E6", borderRadius: 12, height: 45, padding: 15 },
  eyeFechado: { position: "absolute", right: 15, top: 10 },
  botaoLogin: { backgroundColor: "#A50702", borderRadius: 10, paddingVertical: 12, width: "62%", marginTop: 30, marginBottom: 20, alignItems: "center", justifyContent: "center" },
});
