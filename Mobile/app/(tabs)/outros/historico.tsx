import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Historico() {
    return (
        <ScrollView style={TabsStyles.container}>

            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar/>
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Histórico</Text>
                   <Text style={TabsStyles.subtituloPrincipal}>Suas atividades recentes  </Text>

                </View>

            </View>

            <View style={style.cardStatus}>
                <View style={style.statsItem}>
                    <Text style={style.statsNum}>24</Text>

                </View>
                </View>
            
        </ScrollView>
    )

}

const style = StyleSheet.create({

})

