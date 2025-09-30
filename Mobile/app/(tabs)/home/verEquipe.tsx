import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { ScrollView, Text, View } from "react-native";

export default function VerEquipe() {
    return (
        <ScrollView style={TabsStyles.container}>
             <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                <Text style={TabsStyles.tituloPrincipal}>Manutenção</Text>
                                <Text style={TabsStyles.subtituloPrincipal}>8 membros</Text>
                <Text style={TabsStyles.subtituloPrincipal}>Equipe responsável pela manutenção de máquinas e equipamentos</Text>
            </View>
            </View>
        </ScrollView>
    )
}