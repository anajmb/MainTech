import { Link } from "expo-router";
import { EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Image, KeyboardAvoidingView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {

  const [isAgree, setIsAgree] = useState(false);

  const toggleSwitch = () => setIsAgree(previousState => !previousState)

  return (
    <View style={styles.container}>
      <Image style={styles.backgroundImage} source={require("../../assets/images/background-mobile.png")} />

      <KeyboardAvoidingView behavior="padding" style={styles.cardLogin}>

        <View style={styles.formLogin}>
          <Text style={styles.tituloLogin}>Login</Text>

          <View style={{ gap: 8 }}>
            <Text style={styles.labelLogin}>CPF:</Text>
            <TextInput style={styles.inputLogin} />
          </View>

          <View style={{ gap: 8 }}>
            <Text style={styles.labelLogin}>Senha:</Text>

            <View>
              <TextInput style={styles.inputLogin} placeholder="___.___.___-__" secureTextEntry={true} />
              <EyeOff style={styles.eyeFechado} size={20} />

              {/* <Eye style={styles.eyeAberto} /> */}
            </View>
          </View>

          <View style={styles.mantenhaConectado}>
            <Switch style={styles.botaoConectado}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isAgree ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isAgree}
            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }} // aumenta o tamanho
            />
            <Text style={{fontSize: 12 }}>Mantenha-me conectado</Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <TouchableOpacity style={styles.botaoLogin}>
              <Link href={'/(tabs)/home'}>
                <Text style={{ color: "#fff" }}> Entrar </Text>
              </Link>
            </TouchableOpacity>
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

      </KeyboardAvoidingView>
    </View>
  );
}

// campos sendo tampados pelo teclado
// adicionar icone de olho para mostrar senha
// adicionar validação de campos
// não tem checkbox
// Colocar a logo no fundo
// tirar o teclado quando clicar fora do input

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  backgroundImage: {
    position: "relative",
    objectFit: "cover",
    width: "100%",
    height: "100%",
    flex: 0.85,
  },
  cardLogin: {
    flex: 1,
    /*     top: "40%",
        position: "absolute", */
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
  },
  formLogin: {
    gap: 18,
    height: "100%",
    flex: 1
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
    position: "relative"
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
    alignItems: "flex-end",
    marginLeft: 150,
  },
  botaoConectado: {
    alignItems: "flex-end"
  },
  botaoLogin: {
    backgroundColor: "#A50702",
    color: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    width: "62%",
    marginTop: 30,
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