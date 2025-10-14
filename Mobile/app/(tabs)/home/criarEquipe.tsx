import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Link } from "expo-router";
import { UserPlus, Users, Wrench } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CriarEquipe() {
    return (
        <ScrollView style={TabsStyles.container}>
            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Criar Equipe</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>Informe os dados da equipe</Text>
                </View>

            </View>

            /* Card de cadastro */
            <View style={style.cardCriarEquipe}>
                <Text style={style.tituloCardCriarEquipe}>Informe os dados para criar uma equipe</Text>
                <Text style={style.label}>Nome da Equipe</Text>
                <TextInput
                    style={style.input}
                    placeholder="Nome da Equipe"
                    placeholderTextColor="#C4C4C4"
                />
                <Text style={style.labelDescrição}>Descrição</Text>
                <TextInput
                    style={style.inputDescrição}
                    placeholder="Descreva os detalhes"
                    placeholderTextColor="#C4C4C4"
                    multiline={true}
                    numberOfLines={8}
                />
                <Text style={style.label}>Membros</Text>
                <TextInput
                    style={style.input}
                    placeholder="Escreva o e-mail"
                    placeholderTextColor="#C4C4C4"
                />
                <TouchableOpacity style={style.botaoCriarEquipe}>
                    <Text style={style.textoBotaoCriarEquipe}>Criar Equipe</Text>
                </TouchableOpacity>
            </View>

            // card equipes cadastradas
            <View style={style.cardEquipesCadastradas}>
                <Text style={style.tituloCadastradas}>Equipes cadastradas</Text>



                {/* <View style={{ flexDirection: "row", gap: 12, right: 16,}}>


</View> */}
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

                        < TouchableOpacity>
                            <Link href={`/home/verEquipe`}>
                                <View>
                                    <Text style={style.verEquipe}>Ver equipe</Text>

                                </View>
                            </Link>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>




        </ScrollView>
    )
}

const style = StyleSheet.create({

    tituloHeader: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#222",
        left: 10,
    },
    cardCriarEquipe: {
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
    tituloCardCriarEquipe: {
        fontSize: 18,
        fontWeight: "500",
        color: "#222",
        marginBottom: 25,
        textAlign: "center"
    },
    label: {
        fontSize: 15,
        color: "#222",
        marginBottom: 4,
        fontWeight: "400",
    },
    input: {
        backgroundColor: "#F5F5F5",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 8,
        fontSize: 14,
    },
    labelDescrição: {
        fontSize: 15,
        color: "#222",
        marginBottom: 4,
        fontWeight: "400",
    },
    inputDescrição: {
        backgroundColor: "#F5F5F5",
        borderRadius: 8,
        marginBottom: 8,
        fontSize: 14,
        textAlignVertical: "top",
        paddingHorizontal: 12,
        paddingVertical: 10,
        height: 95,
    },
    inputText: {
        color: "#C4C4C4",
        fontSize: 14,
    },
    botaoCriarEquipe: {
        backgroundColor: "#CE221E",
        borderRadius: 8,
        paddingVertical: 9,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        width: 230,
        alignSelf: "center",
    },
    textoBotaoCriarEquipe: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "500",
    },
    cardEquipesCadastradas: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingTop: 18,
        margin: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 4,
        // elevation: 3,

    },
    tituloCadastradas: {
        fontSize: 17,
        color: "#000000",
        fontWeight: "500",
        marginBottom: 12,
        textAlign: "center",
        marginTop: -5,

    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
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
        marginTop: 0,

    },
    footerCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
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

})