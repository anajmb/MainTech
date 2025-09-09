import { ArrowLeft } from "lucide-react-native";
import { View } from "react-native";

export default function SetaVoltar() {
    return (
        <View>
            <ArrowLeft 
            color="#575353"
            size={25}
            strokeWidth={2.5}
            style={{backgroundColor: "#EAE7E7", padding: 10, borderRadius: "50%"}}/>
        </View>
    )
}