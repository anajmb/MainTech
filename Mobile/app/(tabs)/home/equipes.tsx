import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Link } from "expo-router";
import { Wrench, UserPlus, Users } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";

// arrumar icone de add membro e equipe

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

            <View style={{ flexDirection: "row", gap: 12, left: 250, marginTop: 1 }}>

                <TouchableOpacity style={style.iconeAcao}>
                    <Link href={'/home/cadastrarUsuario'}>
                        <View>
                            <UserPlus color="#fff" size={17} />
                        </View >
                    </Link>
                </TouchableOpacity>

                <TouchableOpacity style={style.iconeAcao}>
                    <Link href={'/home/criarEquipe'}>
                        <Users color="#fff" size={17} />
                    </Link>
                </TouchableOpacity>
            </View>

            {/* input data */}

            <View style={style.card}>
                <View style={style.groupEqui}>
                    {/* icone grupo, cor random */}

                    <View style={style.iconeEquipe}>
                        <Wrench color="white" />
                    </View>

                    <View style={style.infoEqui}>
                        <Text style={style.tituloEqui}>Equipe de Manutenção</Text>
                        <Text style={style.descricaoEqui}>Equipe responsável pela manutenção de máquinas e equipamentos</Text>
                    </View>

                    {/* <Link href={'#'} style={style.verEquipe}>Ver equipe</Link> */}
                </View>
                <View style={style.footerCard}>
                    <Text style={style.quantMembro}>8 membros</Text>

                    < TouchableOpacity>
                        <Link href={'/home/verEquipe'}>
                        <View>
                            <Text style={style.verEquipe}>Ver equipe</Text>

                        </View>
                        </Link>
                    </TouchableOpacity>
                </View>
            </View>




            {/* card adicionar membro */}

            <View style={style.cardAdicionar}>
                <Text style={style.tituloAdicionar}>Adicionar Membro</Text>
                <View style={{ marginTop: 12 }}>
                    <Text style={style.labelAdicionar}>Nome da equipe:</Text>
                    <TextInput
                        style={style.inputAdicionar}
                        placeholder="ex: Manutenção"
                        placeholderTextColor="#8B8686"
                    />
                </View>
                <View style={{ marginTop: 12 }}>
                    <Text style={style.labelAdicionar}>E-mail:</Text>
                    <TextInput
                        style={style.inputAdicionar}
                        placeholder="ex: cida@email.com"
                        placeholderTextColor="#8B8686"
                        keyboardType="email-address"
                    />
                </View>
                <TouchableOpacity>
                    <View style={{ alignItems: "center", marginTop: 18 }}>
                        <View style={style.botaoAdicionar}>
                            <Text style={style.textoBotaoAdicionar}>Adicionar membro</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

        </ScrollView >
    )
}

const style = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,

    },
    groupEqui: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    infoEqui: {
        flex: 1,

    },
    tituloEqui: {
        fontSize: 16,
        color: "#000000",
        marginBottom: 2,
        fontWeight: "500",

    },
    descricaoEqui: {
        fontSize: 15,
        color: "#8B8686",
        marginBottom: 8,
        fontWeight: "400",
        marginTop: 10,

    },
    verEquipe: {
        fontSize: 13,
        marginTop: 4,
        color: "#CE221E",
        marginRight: 12,
        fontWeight: "500",

    },
    quantMembro: {
        backgroundColor: "#f1f1f1",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        fontSize: 12,
        color: "#444",
        alignSelf: "flex-start",
        marginRight: 12,

    },
    footerCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
    },
    iconeEquipe: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: "#1E9FCE",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,

    },


    // card adicionar membro
    cardAdicionar: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 18,
        marginVertical: 12,
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.13,
        shadowRadius: 4,
        elevation: 3,
    },
    tituloAdicionar: {
        fontSize: 18,
        fontWeight: "500",
        color: "#222",
        marginBottom: 8,
    },
    labelAdicionar: {
        fontSize: 15,
        color: "#222",
        marginBottom: 4,
        fontWeight: "400",
    },
    inputAdicionar: {
        backgroundColor: "#F5F5F5",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        justifyContent: "center",
    },
    inputTextAdicionar: {
        color: "#8B8686",
        fontSize: 14,
    },
    botaoAdicionar: {
        backgroundColor: "#CE221E",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },
    textoBotaoAdicionar: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "500",
    },
    iconeAcao: {
        backgroundColor: "#CE221E",
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
})