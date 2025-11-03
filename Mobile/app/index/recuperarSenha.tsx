import { Link } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { api } from "@/lib/axios"; // ✅ importa sua API

export default function RedefinirSenha() {

    const [email, setEmail] = useState(""); // ✅ adiciona estado do e-mail
    const [isAgree, setIsAgree] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSendCode = async () => {
        try {
            if (!email) {
                Alert.alert("Atenção", "Digite seu e-mail!");
                return;
            }

            await api.post("/auth/send-code", { email }); // ✅ envia pro back-end
            Alert.alert("Sucesso", "Código enviado para seu e-mail!");
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível enviar o código.");
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

                        <View style={{ gap: 8 }}>
                            <Text style={styles.labelLogin}>E-mail:</Text>
                            <TextInput
                                style={styles.inputLogin}
                                placeholder="Ex: ana@gmail.com"
                                placeholderTextColor="#B9B9B9"
                                value={email}
                                onChangeText={setEmail} // ✅ controla o input
                            />
                        </View>

                        <View style={{ alignItems: "center" }}>
                            <TouchableOpacity style={styles.botaoLogin} onPress={handleSendCode}>
                                <Text style={{ color: "#fff" }}>Enviar</Text>
                            </TouchableOpacity>

                            <Link href={"/"}
                                asChild>
                                <TouchableOpacity>
                                    <Text style={{ marginTop: 10, color: "#A50702" }}>Voltar ao login</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View >
            </View>
        </KeyboardAvoidingView >
    );
}

// 🎨 estilos originais — sem alterações
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
    inputLogin: { backgroundColor: "#E6E6E6", borderRadius: 12, height: 45, position: "relative", padding: 15 },
    botaoLogin: { backgroundColor: "#A50702", color: "#fff", borderRadius: 10, paddingVertical: 12, width: "62%", marginTop: 30, marginBottom: 20, alignItems: "center", justifyContent: "center" },
});
