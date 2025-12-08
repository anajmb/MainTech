import { api } from "@/lib/axios";
import { saveToken, decodeJwt } from "@/lib/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View
} from "react-native";
import { useAuth } from "@/contexts/authContext";
import { TabsStyles } from "@/styles/globalTabs";
import { Toast } from "toastify-react-native";

export default function Login() {
  const [isAgree, setIsAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [cpfData, setCpfData] = useState("");
  const [passwordData, setPasswordData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { loginUser } = useAuth();
  const toggleSwitch = () => setIsAgree((previous) => !previous);
  const [erroMsg, setErroMsg] = useState("");


  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const limparCPF = (value: string) => value.replace(/\D/g, "");

  const handleLogin = async () => {
    if (!cpfData.trim() || !passwordData.trim()) {
      setErroMsg("Preencha CPF e senha.");
      return;
    }

    setIsLoading(true);
    try {
      const cpfLimpo = limparCPF(cpfData);
      const payload = { cpf: cpfLimpo, password: passwordData.trim() };

      console.log("LOGIN PAYLOAD ->", payload);

      const res = await api.post("/employees/login", payload);

      const token =
        res.data?.token ||
        res.data?.accessToken ||
        res.data?.access_token ||
        res.data?.accessTokenRaw;

      

      if (!token) {
        Toast.error("Resposta de login inválida: " + JSON.stringify(res.data));
        setIsLoading(false);
        return;
      }

      // ✅ Salva o token no AsyncStorage e define no axios
      await saveToken(token);

      // ✅ Verifica se a API retornou o usuário
      let user = res.data?.user;

      // Se não veio, decodifica o token e busca pelo ID
      if (!user) {
        const payload = decodeJwt(token);
        const id = payload?.id ?? payload?.sub ?? payload?.userId;
        if (id) {
          const userRes = await api.get(`/employees/getUnique/${id}`);
          user = userRes.data;
        }
      }

      // ✅ Salva o usuário no AsyncStorage (OTIMIZADO)
      if (user) {
        loginUser(user);

        await AsyncStorage.multiSet([
          ["keepConnected", isAgree ? "true" : "false"],
          ["user", JSON.stringify(user)],
          ["token", token]
        ]);
      } else {
        console.warn("⚠️ Nenhum usuário retornado. Verifique o backend do login.");
      }

      // ✅ Redireciona para as tabs
      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.log("LOGIN ERROR ->", error.response?.status, error.response?.data, error.message);
      const serverMsg =
        error.response?.data?.msg ||
        error.response?.data ||
        error.message ||
        "Erro ao fazer login";
      Toast.error(
        typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={-2}
    >
      <View style={styles.container}>
        <Image
          style={styles.backgroundImage}
          source={require("../../assets/images/background-mobile.png")}
          resizeMode="cover"
        />

        <View style={styles.infosLogo}>
          <Image
            style={styles.logoImage}
            source={require("../../assets/images/LogoBranca.png")}
            resizeMode="cover"
          />
          <Text style={styles.logoNome}>Gestão de máquinas</Text>
        </View>

        <View style={styles.cardLogin}>
          <View style={styles.formLogin}>
            <Text style={styles.tituloLogin}>Login</Text>

            <View style={{ gap: 8 }}>
              <Text style={styles.labelLogin}>CPF:</Text>
              <TextInput
                style={styles.inputLogin}
                placeholder="___.___.___-__"
                placeholderTextColor="#B9B9B9"
                value={cpfData}
                onChangeText={(text) => setCpfData(formatCPF(text))}
                keyboardType="numeric"
                autoCapitalize="none"
                maxLength={14}
              />

            </View>

            <View style={{ gap: 8 }}>
              <Text style={styles.labelLogin}>Senha:</Text>

              <View>
                <TextInput
                  style={styles.inputLogin}
                  placeholder="*************"
                  placeholderTextColor="#B9B9B9"
                  secureTextEntry={!showPassword}
                  value={passwordData}
                  onChangeText={setPasswordData}
                />
                <TouchableOpacity
                  style={styles.eyeFechado}
                  onPress={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.mantenhaConectado}>
              <Text style={{ fontSize: 14 }}>Mantenha-me conectado</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#D10B03" }}
                thumbColor={isAgree ? "#f4f4f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isAgree}
                style={{ transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }] }}
              />
            </View>

            {erroMsg !== "" && (
              <View style={TabsStyles.erroMsg}>
                <Text style={TabsStyles.erroMsgText}>{erroMsg}</Text>
              </View>
            )}

            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={styles.botaoLogin}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: "#fff" }}> Entrar </Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.hrefLogin}>
              <Link href={"/auth/recuperarSenha"}>
                <Text style={{ color: "#D40303" }}>Esqueci minha senha</Text>
              </Link>

              <Link href={"/auth/cadastro"}>
                <Text style={{ color: "#D40303" }}>Cadastre-se</Text>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  infosLogo: {
    position: "absolute",
    top: 50,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  logoImage: {
    height: 250,
    width: 300,
  },
  logoNome: {
    color: "#fff",
    alignItems: "center",
    left: 100,
    top: -100,
  },
  cardLogin: {
    backgroundColor: "#fff",
    width: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    minHeight: "55%",
  },
  formLogin: {
    gap: 18,
    height: "100%",
    flex: 1,
  },
  tituloLogin: {
    fontSize: 35,
    alignSelf: "center",
    marginBottom: 20,
  },
  labelLogin: {
    fontSize: 13,
    color: "#222222ff",
  },
  inputLogin: {
    backgroundColor: "#E6E6E6",
    borderRadius: 12,
    height: 45,
    position: "relative",
    padding: 15,
  },
  eyeFechado: {
    position: "absolute",
    right: 15,
    top: 10,
  },
  mantenhaConectado: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginLeft: 150,
  },
  botaoLogin: {
    backgroundColor: "#A50702",
    color: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    width: "62%",
    marginTop: 10,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  hrefLogin: {
    flexDirection: "row",
    fontSize: 12,
    justifyContent: "space-between",
    gap: 16,
  },
});