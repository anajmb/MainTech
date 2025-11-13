import SetaVoltar from "@/components/setaVoltar";
import { api } from "@/lib/axios";
import { TabsStyles } from "@/styles/globalTabs";
import { Link } from "expo-router";
import { UserPlus, Users, Wrench } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export interface Team {
    id: number;
    name: string;
    description: string;
    members: any[];
}

// tirar icone de equipes cadastradas  mesma coisa de "equipes fazer"

export default function CriarEquipe() {

    const [TeamData, setTeamData] = useState<Team[]>([]);

    useEffect(() => {
        async function fetchTeams() {
            try {
                const res = await api.get('/team/get');
                setTeamData(res.data);

            } catch (error) {
                console.log(error);
            }

        }

        fetchTeams();
    }, [])


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
                    placeholderTextColor="#8B8686"
                />
                <Text style={style.labelDescrição}>Descrição</Text>
                <TextInput
                    style={style.inputDescrição}
                    placeholder="Descreva os detalhes"
                    placeholderTextColor="#8B8686"
                    multiline={true}
                    numberOfLines={8}
                />
                <Text style={style.label}>Membros</Text>
                <TextInput
                    style={style.input}
                    placeholder="Escreva o e-mail"
                    placeholderTextColor="#8B8686"
                />
                <TouchableOpacity style={style.botaoCriarEquipe}>
                    <Text style={style.textoBotaoCriarEquipe}>Criar Equipe</Text>
                </TouchableOpacity>
            </View>

            
            <View style={style.cardEquipesCadastradas}>
                <Text style={style.tituloCadastradas}>Equipes cadastradas</Text>


                {TeamData.map((team) => (
                    <View style={style.card}>
                        <View style={style.groupEqui}>

                            <View style={style.iconeEquipe}>
                                <Wrench color="white" />
                            </View>

                            <View style={style.infoEqui}>
                                <Text style={style.tituloEqui}>{team.name}</Text>
                                <Text style={style.descricaoEqui}>{team.description}</Text>
                            </View>

                        </View>

                        <View style={style.footerCard}>

                            < TouchableOpacity>
                                <Link href={`/home/verEquipe?teamId=${team.id}`}>
                                    <View>
                                        <Text style={style.verEquipe}>Ver equipe</Text>

                                    </View>
                                </Link>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

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
     backgroundColor: "#eeeeee",
        borderRadius: 10,
        marginVertical: 12,
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        padding: 20,
        elevation: 4
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
       backgroundColor: "#e6e6e6",
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
      backgroundColor: "#e6e6e6",
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
       backgroundColor: "#A50702",
        color: "#fff",
        borderRadius: 10,
        paddingVertical: 12,
        width: "62%",
        marginTop: 25,
        marginBottom: 30,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center"
    },
    textoBotaoCriarEquipe: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "400",
    },
    cardEquipesCadastradas: {
       backgroundColor: "#eeeeee",
        borderRadius: 10,
        
        marginVertical: 12,
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        padding: 20,
        elevation: 40,

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
        backgroundColor: "#eeeeee",
        borderRadius: 10,
        marginVertical: 12,
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        padding: 20,
        elevation: 4


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