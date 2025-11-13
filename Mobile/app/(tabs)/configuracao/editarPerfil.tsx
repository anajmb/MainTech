import { useEffect, useRef, useState } from "react";
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
import { Calendar, Camera, IdCard, Mail, Phone, User } from "lucide-react-native";
import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { useAuth } from "@/contexts/authContext";

import { api } from "@/lib/axios";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

export default function EditarPerfil() {
  const [image, setImage] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const [emailError, setEmailError] = useState<string | null>(null);
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const emailRef = useRef<TextInput | null>(null);
  const cpfRef = useRef<TextInput | null>(null);

  const { user, updateUser } = useAuth();

  // Carregar dados do usuário
  useEffect(() => {
    async function loadUserData() {
      if (!user?.id) return;
      try {
        const res = await api.get(`/employees/getUnique/${user.id}`);
        const data = res.data;
        setNome(data.name || "");
        setEmail(data.email || "");
        setTelefone(data.phone || "");
        setCpf(data.cpf || "");
        setDataNascimento(data.birthDate ? new Date(data.birthDate).toLocaleDateString("pt-BR") : "");
        setImage(data.photo || null);
      } catch (error) {
        console.log("Erro ao carregar dados do usuário:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
      }
    }
    loadUserData();
  }, [user]);

  // Ajuste de teclado
  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e: any) => setKeyboardHeight(e.endCoordinates?.height || 0);
    const onHide = () => setKeyboardHeight(0);

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Seleção de imagem
  const handleImagePicker = async () => {
    Keyboard.dismiss();
    Alert.alert("Selecionar foto", "Escolha uma opção para a sua foto de perfil", [
      { text: "Escolher da Galeria", onPress: pickImageFromGallery },
      { text: "Tirar Foto", onPress: takePhotoWithCamera },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return Alert.alert("Permissão necessária", "Precisamos da permissão da galeria!");
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 1 });
    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await savePhotoAutomatically(uri); // <-- 🔥 ALTERAÇÃO AQUI
    }
  };

  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return Alert.alert("Permissão necessária", "Precisamos da permissão da câmera!");
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 1 });
    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await savePhotoAutomatically(uri); // <-- 🔥 ALTERAÇÃO AQUI
    }
  };

  // Validações
  const isValidEmail = (value: string) =>
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i.test(value.toLowerCase());

  const isValidCPF = (value: string) => {
    const v = value.replace(/\D/g, "");
    if (v.length !== 11 || /^(\d)\1+$/.test(v)) return false;
    const calc = (arr: number[]) => {
      let sum = 0;
      for (let i = 0; i < arr.length; i++) sum += arr[i] * (arr.length + 1 - i);
      const res = (sum * 10) % 11;
      return res === 10 ? 0 : res;
    };
    const digits = v.split("").map(d => parseInt(d, 10));
    return calc(digits.slice(0, 9)) === digits[9] && calc(digits.slice(0, 10)) === digits[10];
  };

  function handleCpfChange(text: string) {
    const onlyDigits = text.replace(/\D/g, "").slice(0, 11);
    setCpf(onlyDigits);
    if (onlyDigits.length === 11) setCpfError(isValidCPF(onlyDigits) ? null : "CPF inválido");
    else setCpfError("CPF incompleto");
  }

  const canSave =
    nome.trim() !== "" &&
    email.trim() !== "" &&
    telefone.trim() !== "" &&
    cpf.trim().length >= 11 &&
    isValidEmail(email);


  // Converter imagem em base64
  async function toBase64(uri: string): Promise<string> {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  const savePhotoAutomatically = async (uri: string) => {
    if (!user?.id) {
      Alert.alert("Erro", "Usuário não encontrado para salvar a foto.");
      return;
    }

    try {
      // 🔧 Reduz tamanho da imagem antes de converter para Base64
      const manipulated = await manipulateAsync(
        uri,
        [{ resize: { width: 512 } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );

      const base64Image = await toBase64(manipulated.uri);

      await api.put(`/employees/update/${user.id}`, {
        ...user,
        photo: base64Image,
      });

      // Atualiza o contexto global instantaneamente
      await updateUser({
        photo: base64Image,
      });

    } catch (error) {
      console.log("Erro ao atualizar foto automaticamente:", error);
      Alert.alert("Erro", "Não foi possível atualizar a foto do perfil.");
    }
  };

  async function handleSave() {
    if (!canSave || !user?.id) return Alert.alert("Erro", "Preencha todos os campos corretamente antes de salvar.");

    try {
      let base64Image = image;
      if (image && image.startsWith("file://")) {
        base64Image = await toBase64(image);
      }

      await api.put(`/employees/update/${user.id}`, {
        name: nome,
        email,
        phone: telefone,
        cpf,
        birthDate: dataNascimento,
        photo: base64Image,
      });

      await updateUser({
        ...user,
        name: nome,
        email,
        phone: telefone,
        cpf,
        birthDate: dataNascimento,
        photo: base64Image || undefined,
      });

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      console.log("Erro ao atualizar perfil:", error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 60}
    >
      <ScrollView
        style={TabsStyles.container}
        /* reduz o espaço padrão e limita o padding quando o teclado estiver aberto */
        contentContainerStyle={{ flexGrow: 1, paddingBottom: Math.min(40 + keyboardHeight, 220) }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
      >
        <View style={TabsStyles.headerPrincipal}>
          <SetaVoltar />
          <View style={TabsStyles.conjHeaderPrincipal}>
            <Text style={TabsStyles.tituloPrincipal}>Editar Perfil</Text>
            <Text style={TabsStyles.subtituloPrincipal}>Atualize suas informações</Text>
          </View>
        </View>

        <View style={TabsStyles.todosCard}>
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
                <TextInput
                  style={styles.input}
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Digite seu nome"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.opcaoForm}>
                <View style={styles.iconELabel}>
                  <Mail strokeWidth={1.5} size={22} />
                  <Text style={styles.label}>E-mail</Text>
                </View>
                <TextInput
                  ref={emailRef}
                  style={styles.input}
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (emailError) setEmailError(null);
                  }}
                  placeholder="email@exemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="done"
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              </View>

              <View style={styles.opcaoForm}>
                <View style={styles.iconELabel}>
                  <Phone strokeWidth={1.5} size={22} />
                  <Text style={styles.label}>Telefone</Text>
                </View>
                <TextInput
                  style={styles.input}
                  value={telefone}
                  onChangeText={(t) => setTelefone(t.replace(/[^\d]/g, "").slice(0, 11))}
                  placeholder="(99) 99999-9999"
                  keyboardType="phone-pad"
                  maxLength={11}
                />
              </View>

              <View style={styles.opcaoForm}>
                <View style={styles.iconELabel}>
                  <IdCard strokeWidth={1.5} size={22} />
                  <Text style={styles.label}>CPF</Text>
                </View>
                <TextInput
                  ref={cpfRef}
                  style={styles.input}
                  value={cpf}
                  onChangeText={handleCpfChange}
                  placeholder="00000000000"
                  keyboardType="number-pad"
                  maxLength={11}
                  editable={false}
                />
                {cpfError ? <Text style={styles.errorText}>{cpfError}</Text> : null}
              </View>

              <View style={styles.opcaoForm}>
                <View style={styles.iconELabel}>
                  <Calendar strokeWidth={1.5} size={22} />
                  <Text style={styles.label}>Data de nascimento</Text>
                </View>
                <TouchableOpacity activeOpacity={0.8} onPress={() => { Keyboard.dismiss(); /* aqui pode abrir DatePicker */ }}>
                  <View pointerEvents="none">
                    <TextInput style={styles.input} editable={false} value={dataNascimento} placeholder="DD/MM/AAAA" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>


          <TouchableOpacity
            style={[
              styles.disabledBotao,
              { backgroundColor: canSave ? "#A50702" : "#BDBDBD" }
            ]}
            onPress={handleSave}
            activeOpacity={0.8}
            disabled={!canSave}
          >
            <Text style={styles.disabledBotaoText}>Salvar Alterações</Text>
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
    backgroundColor: "#fff",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 1, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
    borderRadius: 10,
  },
  opcaoForm: {},
  input: {
    backgroundColor: "#e6e6e6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  iconELabel: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginBottom: 5,
  },
  avatarContainer: {
    backgroundColor: "#CE221E",
    height: 90,
    width: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderWidth: 2,
    borderColor: "#fff",
    overflow: "hidden",
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
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  disabledBotao: {
    backgroundColor: "#A50702",
    color: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    width: "62%",
    marginTop: 10,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"

  },
  disabledBotaoText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "400"
  },
  errorText: {
    color: "#CE221E",
    marginTop: 6,
    fontSize: 12,
  },
});