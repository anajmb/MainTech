import { api } from "@/lib/axios";
import { Link, useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function Cadastro() {

  const [isAgree, setIsAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // novo estado
  const toggleSwitch = () => setIsAgree(previousState => !previousState)
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [cpfData, setCpfData] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const router = useRouter();

const handleCadastro = async () => {
  if (!cpfData || !name || !email || !phone || !date || !password ) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
  }
  setIsLoading(true);

  try {
  const res = await api.post("/employees/completeRegister", {
    name,
    cpf: cpfData,
    email,
    phone,
    birthDate: date,
    password,
  });

  Alert.alert("Sucesso", "Cadastro feito com sucesso!", [
    {
      text: "OK",
      onPress: () => router.replace("/"),
    },
  ]);
  // Não precisa salvar o user aqui!
} catch (error: any) {
  if (error.response?.status === 409) {
    Alert.alert("Erro", error.response.data.msg);
  } else if (error.response?.status === 404) {
    Alert.alert("Erro", "Não existe um pré-cadastro para este CPF.");
  } else {
    Alert.alert("Erro", "Erro ao completar cadastro.");
  }
} finally {
  setIsLoading(false);
}
};

  return (

    <KeyboardAvoidingView style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={-2}>


      <View style={styles.container}>
        <Image style={styles.backgroundImage} source={require("../../assets/images/background-mobile.png")} resizeMode="cover" />
        {/* <View style={styles.infosLogo}>
          <Image style={styles.logoImage} source={require("../../assets/images/LogoBranca.png")} />
          <Text style={styles.logoNome}>Gestão de maquinas</Text>
        </View> */}


        <View style={styles.cardLogin}>


          <View style={styles.formLogin}>
            <Text style={styles.tituloLogin}>Cadastro</Text>

            <View style={{ gap: 8 }}>
              <Text style={styles.labelLogin}>Nome:</Text>
              <TextInput style={styles.inputLogin} 
              placeholder="Ex: Ana Luiza"
               placeholderTextColor="#B9B9B9"
               value={name}
               onChangeText={setName} />
            </View>

            <View style={styles.dataEmail}>

              <View style={{ gap: 8 }}>
                <Text style={styles.labelLogin}>Data de nascimento:</Text>
                <TouchableOpacity
                  style={styles.inputDate}
                  onPress={showDatePicker}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: date ? "#000" : "#B9B9B9" }}>
                    {date ? date.toLocaleDateString("pt-BR") : "DD/MM/AA"}
                  </Text>
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                  maximumDate={new Date()}
                  locale="pt-BR"
                />
              </View>

              <View style={{ gap: 8 }}>
                <Text style={styles.labelLogin}>E-mail:</Text>
                <TextInput style={styles.inputEmail} 
                placeholder="Ex:ana@gmail.com" 
                placeholderTextColor="#B9B9B9"
                value={email}
                onChangeText={setEmail} />
              </View>
            </View>

            <View style={styles.telCpf}>

              <View style={{ gap: 8 }}>
                <Text style={styles.labelLogin}>Telefone:</Text>
                <TextInput style={styles.inputTel} 
                placeholder="(__)____-____" 
                placeholderTextColor="#B9B9B9" 
                value={phone}
                onChangeText={setPhone}/>
              </View>

              <View style={{ gap: 8 }}>
                <Text style={styles.labelLogin}>CPF:</Text>
                <TextInput style={styles.inputTel} 
                placeholder="___.___.___-__" 
                placeholderTextColor="#B9B9B9"
                value={cpfData}
                onChangeText={setCpfData}
                keyboardType="numeric" />
              </View>

            </View>



            <View style={{ gap: 8 }}>
              <Text style={styles.labelLogin}>Senha:</Text>

              <View>
                <TextInput style={styles.inputLogin}
                 placeholder="*************" 
                 placeholderTextColor="#B9B9B9"  
                 secureTextEntry={!showPassword}
                 value={password}
                 onChangeText={setPassword} />
                {/* <EyeOff style={styles.eyeFechado} size={20} /> */}
                <TouchableOpacity style={styles.eyeFechado} onPress={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? (
                    <Eye size={20} />
                  ) : (<EyeOff size={20} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ alignItems: "center" }}>
                <TouchableOpacity style={styles.botaoLogin}  onPress={handleCadastro} disabled={isLoading}>
                  <Text style={{ color: "#fff" }}>{isLoading ? "Cadastrando..." : "Cadastrar" }  </Text>
                </TouchableOpacity>
           
            </View>

            <View style={styles.hrefLogin}>
              <Link href={'/'} style={{ color: "#D40303" }}>
                <Text>
                  Voltar ao login
                </Text>
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
    top: -34,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: -1
  },
  logoImage: {
    height: 250,
    width: 300,
    alignItems: "center"
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
    minHeight: "79%", // ajuste conforme necessário
  },
  formLogin: {
    gap: 18,
    height: "100%",
    flex: 1,
  },
  tituloLogin: {
    fontSize: 35,
    alignSelf: "center",
    marginBottom: 10,
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
    padding: 15,
    
  },
  
  inputTel: {
    backgroundColor: "#E6E6E6",
    borderRadius: 12,
    height: 45,
    position: "relative",
    padding: 15,
    width: 170
  },
  inputDate: {
    backgroundColor: "#E6E6E6",
    borderRadius: 12,
    height: 45,
    position: "relative",
    padding: 15,
    width: 150
  },
  inputEmail: {
    backgroundColor: "#E6E6E6",
    borderRadius: 12,
    height: 45,
    position: "relative",
    padding: 15,
    width: 190
  },
  telCpf: {
    flexDirection: "row",
    gap: 10
  },
  dataEmail: {
    flexDirection: "row",
    gap: 15
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
  botaoLogin: {
    backgroundColor: "#A50702",
    color: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    width: "62%",
    marginTop: 20,
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


