import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Calendar, Clock, MapPin } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Agenda() {
    return (

        <ScrollView style={TabsStyles.container}>

            <Text>Agenda</Text>

            {/* <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />

                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Agenda</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>Sexta-feira, 15 de agosto</Text>
                </View>
            </View>

            {/* input data */}

            {/* <View style={style.cardCalen}>
                <View style={style.groupCalen}>
                    <Calendar />
                    <Text>Calendário</Text>
                </View>
            </View>

            <View style={style.groupEvent}>
                <Text style={style.tituloEvent}>Evento de hoje</Text>
                <View style={style.cardEvent}>
                    <Text style={style.tituloCard}>Verificar máquinas</Text>
                    <Clock /> <Text style={style.infoCard}>09:00 / 09:30</Text>
                    <MapPin /> <Text style={style.infoCard}>Sala 9 - Laboratório</Text>
                </View>
            </View> */}


        </ScrollView>
    )
}

const style = StyleSheet.create({
    cardCalen: {

    },
    groupCalen: {

    },
    groupEvent: {

    },
    tituloEvent: {

    },
    cardEvent: {

    },
    tituloCard: {

    },
    infoCard: {

    },
})