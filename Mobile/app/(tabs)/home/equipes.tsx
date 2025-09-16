import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Equipes() {
    return (
        <ScrollView style={TabsStyles.container} >

            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />

                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Equipes</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>Gerencie suas equipes e membros</Text>
                </View>
            </View>

            {/* input data */}

            <View style={style.card}>
                <View style={style.groupEqui}>
                    {/* icone grupo, cor random */}

                    <View style={style.infoEqui}>
                        <Text style={style.tituloEqui}>Equipe de Manutenção</Text>
                        <Text style={style.descricaoEqui}>Equipe responsável pela manutenção de máquinas e equipamentos</Text>
                    </View>

                    <Text style={style.quantMembro}>8 membros</Text>
                    {/* <Link href={'#'} style={style.verEquipe}>Ver equipe</Link> */}
                </View>
            </View>

        </ScrollView >
    )
}

const style = StyleSheet.create({
    card: {

    },
    groupEqui: {

    },
    infoEqui: {

    },
    tituloEqui: {

    },
    descricaoEqui: {

    },
    quantMembro: {

    },
    verEquipe: {

    }
})