import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Calendar, Camera, IdCard, Mail, Phone, User } from "lucide-react-native";
// Importado 'Image' e 'Platform' para o KeyboardAvoidingView
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";

export default function EditarPerfil() {
  // Estado para armazenar a imagem selecionada
  const [image, setImage] = useState<string | null>(null);

  // campos do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  // estados de erro
  const [emailError, setEmailError] = useState<string | null>(null);
  const [cpfError, setCpfError] = useState<string | null>(null);

  // controla altura do teclado para evitar sobreposição
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => setKeyboardHeight(e.endCoordinates?.height || 0));
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // Função para lidar com a seleção de imagem (galeria ou câmera)
  const handleImagePicker = async () => {
    Keyboard.dismiss();
    Alert.alert("Selecionar foto", "Escolha uma opção para a sua foto de perfil", [
      { text: "Escolher da Galeria", onPress: () => pickImageFromGallery() },
      { text: "Tirar Foto", onPress: () => takePhotoWithCamera() },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  // Função para selecionar imagem da galeria
  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Desculpe, precisamos da permissão da galeria para isso funcionar!");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Erro ao selecionar imagem da galeria: ", error);
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  };

  // Função para tirar foto com a câmera
  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Desculpe, precisamos da permissão da câmera para isso funcionar!");
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Erro ao tirar foto: ", error);
      Alert.alert("Erro", "Não foi possível usar a câmera.");
    }
  };

  // validação de email (regex simples)
  function isValidEmail(value: string) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(String(value).toLowerCase());
  }

  // validação de CPF (algoritmo clássico)
  function isValidCPF(value: string) {
    const v = value.replace(/\D/g, "");
    if (v.length !== 11) return false;
    if (/^(\d)\1+$/.test(v)) return false; // todos iguais
    const calc = (arr: number[]) => {
      let sum = 0;
      for (let i = 0; i < arr.length; i++) sum += arr[i] * (arr.length + 1 - i);
      const res = (sum * 10) % 11;
      return res === 10 ? 0 : res;
    };
    const digits = v.split("").map((d) => parseInt(d, 10));
    const digit1 = calc(digits.slice(0, 9));
    const digit2 = calc(digits.slice(0, 10));
    return digit1 === digits[9] && digit2 === digits[10];
  }

  // handlers para validação onBlur/onChange
  function handleEmailBlur() {
    if (email.trim() === "") {
      setEmailError(null);
      return;
    }
    setEmailError(isValidEmail(email) ? null : "E-mail inválido");
  }

  function handleCpfChange(text: string) {
    // mantém apenas números e limita a 11 dígitos
    const onlyDigits = text.replace(/\D/g, "").slice(0, 11);
    setCpf(onlyDigits);
    if (onlyDigits.length === 11) {
      setCpfError(isValidCPF(onlyDigits) ? null : "CPF inválido");
    } else {
      setCpfError("CPF incompleto");
    }
  }

  function handleCpfBlur() {
    if (cpf.trim() === "") {
      setCpfError(null);
      return;
    }
    setCpfError(isValidCPF(cpf) ? null : "CPF inválido");
  }

  // validação final para habilitar salvar
  const canSave =
    nome.trim() !== "" &&
    email.trim() !== "" &&
    telefone.trim() !== "" &&
    cpf.trim() !== "" &&
    dataNascimento.trim() !== "" &&
    isValidEmail(email) &&
    isValidCPF(cpf);

  function handleSave() {
    if (!canSave) {
      const faltam: string[] = [];
      if (!image) faltam.push("Foto");
      if (nome.trim() === "") faltam.push("Nome");
      if (email.trim() === "") faltam.push("E-mail");
      if (telefone.trim() === "") faltam.push("Telefone");
      if (cpf.trim() === "") faltam.push("CPF");
      if (dataNascimento.trim() === "") faltam.push("Data de Nascimento");
      const validationProblems: string[] = [];
      if (email && !isValidEmail(email)) validationProblems.push("E-mail inválido");
      if (cpf && !isValidCPF(cpf)) validationProblems.push("CPF inválido");
      const msgParts = [];
      if (faltam.length) msgParts.push(`Faltam: ${faltam.join(", ")}`);
      if (validationProblems.length) msgParts.push(validationProblems.join(", "));
      return Alert.alert("Corrija os erros", msgParts.join("\n"));
    }

    // enviar para backend...
    Alert.alert("Sucesso", "Perfil atualizado com sucesso.");
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 60}
    >
      <ScrollView
        style={TabsStyles.container}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 140 + keyboardHeight }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <View style={TabsStyles.headerPrincipal}>
          <SetaVoltar />
          <View style={TabsStyles.conjHeaderPrincipal}>
            <Text style={TabsStyles.tituloPrincipal}>Editar Perfil</Text>
            <Text style={TabsStyles.subtituloPrincipal}>Atualize suas informações</Text>
          </View>
        </View>

        <View style={styles.todosCard}>
          <View style={styles.card}>
            <View style={styles.cardFoto}>
              <View>
                <View style={styles.avatarContainer}>
                  {image ? <Image source={{ uri: image }} style={styles.avatarImage} /> : <User color={"#fff"} size={50} strokeWidth={1.5} />}
                </View>
                <TouchableOpacity style={styles.cameraIconContainer} onPress={handleImagePicker}>
                  <Camera color={"#CE221E"} size={20} />
                </TouchableOpacity>
              </View>
              <Text style={{ color: "#858585", fontSize: 14 }}>Toque no ícone para editar a foto</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.formEditar}>
              <View style={styles.opcaoForm}>
                <View style={styles.iconELabel}>
                  <User strokeWidth={1.5} size={22} />
                  <Text style={styles.label}>Nome completo</Text>
                </View>
                <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Digite seu nome" />
              </View>

              <View style={styles.opcaoForm}>
                <View style={styles.iconELabel}>
                  <Mail strokeWidth={1.5} size={22} />
                  <Text style={styles.label}>E-mail</Text>
                </View>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (emailError) setEmailError(null);
                  }}
                  placeholder="email@exemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={handleEmailBlur}
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              </View>

              <View style={styles.opcaoForm}>
                <View style={styles.iconELabel}>
                  <Phone strokeWidth={1.5} size={22} />
                  <Text style={styles.label}>Telefone</Text>
                </View>
                <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="(99) 99999-9999" keyboardType="phone-pad" />
              </View>

              <View style={styles.opcaoForm}>
                <View style={styles.iconELabel}>
                  <IdCard strokeWidth={1.5} size={22} />
                  <Text style={styles.label}>CPF</Text>
                </View>
                <TextInput
                  style={styles.input}
                  value={cpf}
                  onChangeText={handleCpfChange}
                  placeholder="00000000000"
                  keyboardType="numeric"
                  onBlur={handleCpfBlur}
                />
                {cpfError ? <Text style={styles.errorText}>{cpfError}</Text> : null}
              </View>

              <View style={styles.opcaoForm}>
                <View style={styles.iconELabel}>
                  <Calendar strokeWidth={1.5} size={22} />
                  <Text style={styles.label}>Data de nascimento</Text>
                </View>
                <TextInput style={styles.input} value={dataNascimento} onChangeText={setDataNascimento} placeholder="DD/MM/AAAA" />
              </View>
            </View>
          </View>

          <TouchableOpacity style={{ alignItems: "center", marginTop: 10 }} onPress={handleSave} activeOpacity={0.8} disabled={!canSave}>
            <View style={[TabsStyles.viewBotaoPrincipal, !canSave && styles.disabledBotao]}>
              <Text style={[TabsStyles.botaoText, !canSave && styles.disabledBotaoText]}>Salvar Alterações</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  cardFoto: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  formEditar: {
    padding: 35,
    gap: 25,
  },
  card: {
    backgroundColor: "#fff", // Fundo branco para os cards, como solicitado
    shadowColor: "rgba(0, 0, 0, 0.25)", // Sombra para iOS
    shadowOffset: { width: 1, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10, // Sombra para Android
    borderRadius: 10,
  },
  todosCard: {
    gap: 30,
    paddingBottom: 90,
  },
  opcaoForm: {},
  input: {
    backgroundColor: "#E6E6E6",
    padding: 10,
    borderRadius: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600", // '600' é válido para fontWeight
  },
  iconELabel: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginBottom: 5,
  },
  avatarContainer: {
    backgroundColor: "#CE221E", // Cor de fundo do círculo quando não há imagem
    height: 90,
    width: 90,
    borderRadius: 45, // Metade da largura/altura para ser um círculo
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderWidth: 2,
    borderColor: "#CE221E",
  },
  avatarImage: {
    height: 90,
    width: 90,
    borderRadius: 45,
  },
  cameraIconContainer: {
    backgroundColor: "#fff",
    height: 30,
    width: 30,
    borderRadius: 15, // Metade da largura/altura para ser um círculo
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  disabledBotao: {
    backgroundColor: "#D8D8D8",
  },
  disabledBotaoText: {
    color: "#888",
  },
    errorText: {
    color: "#CE221E",
    marginTop: 6,
    fontSize: 12,
  },
});