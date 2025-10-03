import { Link } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";



export default function RecuperarCodigo() {

  const [isAgree, setIsAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // novo estado
   const [value, setValue] = useState("");
  const CELL_COUNT = 4;

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });


  const toggleSwitch = () => setIsAgree(previousState => !previousState)

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

            {/* <View style={{ gap: 8 }}>
              <Text style={styles.labelLogin}>E-mail:</Text>
              <TextInput style={styles.inputLogin} placeholder="Ex:ana@gmail.com" placeholderTextColor="#B9B9B9" />
            </View> */}

            
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
        position: "relative"
      }}
      onLayout={getCellOnLayoutHandler(index)}
    >
      <Text style={{ fontSize: 24, color: "#222" }}>
        {symbol || (isFocused ? <Cursor /> : null)}
      </Text>
    </View>
  )}
/>

            <View style={{ alignItems: "center" }}>
              <Link href={'/redefinirsenha'} asChild>
                <TouchableOpacity style={styles.botaoLogin}>
                  <Text style={{ color: "#fff" }}> Recuperar </Text>
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
  subTitleRec: {
    color: "8E8E8E",
    fontSize: 15,
    justifyContent: "center",
    textAlign: "center"

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