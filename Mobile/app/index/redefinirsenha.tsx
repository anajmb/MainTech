import { Link } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RecuperarSenha() {

  const [isAgree, setIsAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // novo estado
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

                 <View style={{ gap: 8 }}>
              <Text style={styles.labelLogin}>Confirmar senha:</Text>
             <View>
                <TextInput style={styles.inputLogin} placeholder="*************" placeholderTextColor="#B9B9B9" secureTextEntry={!showPassword} />
                {/* <EyeOff style={styles.eyeFechado} size={20} /> */}
                <TouchableOpacity style={styles.eyeFechado} onPress={() => setShowConfirmPassword((prev) => !prev)}>
                  {showConfirmPassword ? (
                    <Eye size={20} />
                  ) : (<EyeOff size={20} />
                  )}
                </TouchableOpacity>
              </View>
            </View>


            <View style={{ alignItems: "center" }}>
              <Link href={'/(tabs)/home'} asChild>
                <TouchableOpacity style={styles.botaoLogin}>
                  <Text style={{ color: "#fff" }}> Enviar </Text>
                </TouchableOpacity>
              </Link>
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
  infosLogo: {
    position: "absolute",
    top: 100

  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  logoImage: {
    height: 250,
    width: 300
  },
  logoNome: {
    color: "#fff",
    alignItems: "center",
    left: 100,
    top: -100
  },
  cardLogin: {
    backgroundColor: "#fff",
    width: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    minHeight: "45%", // ajuste conforme necessário
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
   eyeFechado: {
    position: "absolute",
    right: 15,
    top: 10
  },
  botaoLogin: {
    backgroundColor: "#A50702",
    color: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    width: "62%",
    marginTop: 30,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  hrefLogin: {
    flexDirection: "row",
    fontSize: 12,
    justifyContent: "center"
  },
});