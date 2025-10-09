import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Link } from "expo-router";
import { Calendar, Clock, MapPin } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";

// colocar o input de data

export default function Agenda() {
    return (

        <ScrollView style={TabsStyles.container}>

            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />

                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Agenda</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>Sexta-feira, 15 de agosto</Text>
                </View>
            </View>

            {/* input data */}

            <View style={style.cardCalen}>
            <Link href={"/(tabs)/home/calendario"}>
                <View style={style.groupCalen}>
                    <Calendar color={'#6797F0'} />
                    <Text style={style.tituloCardCalen}>Calendário</Text>
                </View>
            </Link>
            </View>

            <View style={style.groupEvent}>
                <Text style={style.tituloEvent}>Evento de hoje</Text>
                <View style={style.cardEvent}>
                    <Text style={style.tituloCard}>Verificar máquinas</Text>

                    <View style={{gap: 10}}>
                        <View style={style.infoCardGroup}>
                            <Clock strokeWidth={1.5} size={22} /> <Text style={style.infoCard}>09:00 / 09:30</Text>
                        </View>
                        <View style={style.infoCardGroup}>
                            <MapPin strokeWidth={1.5} size={22} /> <Text style={style.infoCard}>Sala 9 - Laboratório</Text>
                        </View>
                    </View>
                </View>
            </View>


        </ScrollView>
    )
}

const style = StyleSheet.create({
    cardCalen: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: 18,
        marginBottom: 18,


    },
    groupCalen: {
        width: '85%',
        backgroundColor: "#eeeeee69",
        boxShadow: '1px 5px 10px rgba(0, 0, 0, 0.25)',
        padding: 18,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12
    },
    tituloCardCalen: {

    },
    groupEvent: {

    },
    tituloEvent: {
        fontSize: 23,
        fontWeight: 600,
        textAlign: "left",
        marginTop: 40,
        marginBottom: 40
    },
    cardEvent: {
        backgroundColor: "#eeeeee69",
        boxShadow: '1px 5px 10px rgba(0, 0, 0, 0.25)',
        borderRadius: 10,
        padding: 18
    },
    infoCardGroup: {
        flexDirection: 'row',
        gap: 12
    },
    tituloCard: {
        fontSize: 17,
        marginBottom: 15
    },
    infoCard: {

    },
})