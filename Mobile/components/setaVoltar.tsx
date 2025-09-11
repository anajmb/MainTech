import { ArrowLeft } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

export default function SetaVoltar() {
    return (
        <TouchableOpacity>
            <View style={{backgroundColor: "#EAE7E7", padding: 10, borderRadius: "50%"}}>

            <ArrowLeft 
            color="#575353"
            size={25}
            strokeWidth={2.5}/>
            </View>
        </TouchableOpacity>
    )
}