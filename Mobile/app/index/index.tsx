import { Link } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {

  const [isAgree, setIsAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // novo estado


  const toggleSwitch = () => setIsAgree(previousState => !previousState)

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={-2}>
      <View style={styles.container}>
        <Image style={styles.backgroundImage} source={require("../../assets/images/background-mobile.png")} />

        <View style={styles.cardLogin}>


          <View style={styles.formLogin}>
            <Text style={styles.tituloLogin}>Login</Text>

            <View style={{ gap: 8 }}>
              <Text style={styles.labelLogin}>CPF:</Text>
              <TextInput style={styles.inputLogin} placeholder="___.___.___-__" placeholderTextColor="#B9B9B9" />
            </View>

            <View style={{ gap: 8 }}>
              <Text style={styles.labelLogin}>Senha:</Text>

              <View>
                <TextInput style={styles.inputLogin} placeholder="*************" placeholderTextColor="#B9B9B9" secureTextEntry={!showPassword} />
                {/* <EyeOff style={styles.eyeFechado} size={20} /> */}
                <TouchableOpacity style={styles.eyeFechado} onPress={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? (
                    <Eye size={20} />
                  ) : (<EyeOff size={20} />
                  )}
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
                style={{ transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }] }} // aumenta o tamanho
              />
            </View>

            <View style={{ alignItems: "center" }}>
              <Link href={'/(tabs)/home'} asChild>
                <TouchableOpacity style={styles.botaoLogin}>
                  <Text style={{ color: "#fff" }}> Entrar </Text>
                </TouchableOpacity>
              </Link>
            </View>

            <View style={styles.hrefLogin}>
              <Text>
                <Link href="../auth/recuperarSenha" style={{ color: "#D40303" }}>Esqueci minha senha</Link>
              </Text>

              <Text>
                {/* <Text>Seu primeiro acesso?  */}
                <Link href="../auth/cadastro" style={{ color: "#D40303" }}>Cadastre-se</Link>
              </Text>
            </View>

          </View>

        </View >
      </View>
    </KeyboardAvoidingView>
  );
}

// campos sendo tampados pelo teclado
// adicionar icone de olho para mostrar senha
// adicionar validação de campos
// Colocar a logo no fundo
// tirar o teclado quando clicar fora do input

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end", // cardLogin vai para baixo
    alignItems: "center",
  },
  backgroundImage: {
    position: "absolute",
    objectFit: "cover",
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  cardLogin: {
    backgroundColor: "#fff",
    width: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    minHeight: "55%", // ajuste conforme necessário
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
    fontFamily: "poppins"
  },
  labelLogin: {
    fontSize: 13,
    color: "#222222ff"
  },
  inputLogin: {
    backgroundColor: "#E6E6E6",
    borderRadius: 12,
    height: 45,
    position: "relative",
    padding: 15
  },
  // eyeAberto: {
  //   position: "absolute",
  //   width: 16,
  //   height: 16,
  //   right: 15,
  //   top: 10,
  //   display: "none"
  // },
  eyeFechado: {
    position: "absolute",
    right: 15,
    top: 10
  },
  mantenhaConectado: {
    flexDirection: "row", // <-- adicione esta linha
    alignItems: "center", // <-- centraliza verticalmente
    justifyContent: "flex-end",
    marginLeft: 150

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
    justifyContent: "space-between"
  },
});