import { ArrowLeft } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function SetaVoltar() {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      activeOpacity={0.7}
    >
      <View style={{ backgroundColor: "#EAE7E7", padding: 10, borderRadius: 999 }}>
        <ArrowLeft color="#575353" size={25} strokeWidth={2.5} />
      </View>
    </TouchableOpacity>
  );
}