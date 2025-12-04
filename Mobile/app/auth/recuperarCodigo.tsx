import React, { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import { TabsStyles } from "@/styles/globalTabs";
import { Toast } from "toastify-react-native";

export default function RecuperarCodigo() {
  const { email } = useLocalSearchParams();
  const [value, setValue] = useState("");
  const CELL_COUNT = 4;
  const router = useRouter();
  const [erroMsg, setErroMsg] = useState("");

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleVerifyCode = async () => {
    if (!value.trim()) {
      setErroMsg("Digite o código de verificação!");
      return;
    }

    try {
      const res = await api.post("/auth/verify-code", { email, code: value });

      if (res.data.valid) {
        Toast.success("Código verificado!");
        router.push({
          pathname: "./redefinirsenha",
          params: { email },
        });
      } else {
        Toast.error("Código incorreto.");
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ error?: string; message?: string }>;

      console.error("Erro completo:", error);

      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Não foi possível verificar o código.";

      Toast.error(msg);
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
            <Text style={styles.tituloLogin}>Recuperar Senha</Text>
            <Text style={styles.subTitleRec}>Digite o código de verificação enviado para o seu e-mail.</Text>

            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={{ marginVertical: 20 }}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <View
                  key={index}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 8,
                    backgroundColor: "#E6E6E6",
                    justifyContent: "center",
                    alignItems: "center",
                    marginHorizontal: 5,
                    borderWidth: isFocused ? 2 : 0,
                    borderColor: "#A50702",
                  }}
                  onLayout={getCellOnLayoutHandler(index)}
                >
                  <Text style={{ fontSize: 24, color: "#222" }}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                </View>
              )}
            />

            {erroMsg !== "" && (
              <View style={TabsStyles.erroMsg}>
                <Text style={TabsStyles.erroMsgText}>{erroMsg}</Text>
              </View>
            )}

            <View style={{ alignItems: "center" }}>
              <TouchableOpacity style={styles.botaoLogin} onPress={handleVerifyCode}>
                <Text style={{ color: "#fff" }}> Recuperar </Text>
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
  subTitleRec: { color: "#8E8E8E", fontSize: 15, textAlign: "center" },
  botaoLogin: { backgroundColor: "#A50702", borderRadius: 10, paddingVertical: 12, width: "62%", marginTop: 30, marginBottom: 20, alignItems: "center" },
});
