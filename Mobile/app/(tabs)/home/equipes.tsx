import SetaVoltar from "@/components/setaVoltar";
import { api } from "@/lib/axios";
import { TabsStyles } from "@/styles/globalTabs";
import { Link } from "expo-router";
import { Wrench, UserPlus, Users, Scroll } from "lucide-react-native";
import { useEffect, useState } from "react";
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";

// mudar ou tirar icone dos times, pq esta vindo os mesmos para todas as equipes

export interface Team {
    id: number;
    name: string;
    description: string;
    members: any[];
}

export interface Employees {
    id: number;
    name: string;
    email: string;
}



export default function Equipes() {
    const [TeamData, setTeamData] = useState<Team[]>([]);
    const [employeesData, setEmployeesData] = useState<Employees[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<Employees | null>(null);
    // state antigo do Modal de equipe removido em favor do dropdown inline
    const [modalEmployeeVisible, setModalEmployeeVisible] = useState(false);
    // seleção de equipe usando DropDownPicker
    const [teamOpen, setTeamOpen] = useState(false);
    const [teamValue, setTeamValue] = useState<number | null>(null);
    const [teamItems, setTeamItems] = useState<{ label: string; value: number }[]>([]);
    // seleção de membro usando DropDownPicker (para ficar igual à página de máquinas)
    const [employeeOpen, setEmployeeOpen] = useState(false);
    const [employeeValue, setEmployeeValue] = useState<number | null>(null);
    const [employeeItems, setEmployeeItems] = useState<{ label: string; value: number }[]>([]);
    const [feedback, setFeedback] = useState<string>("");

    async function fetchTeams() {
        try {
            const res = await api.get('/team/get');
            setTeamData(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchTeams();
        async function fetchEmployees() {
            try {
                const res = await api.get('/employees/get');
                setEmployeesData(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchTeams();
        fetchEmployees();
    }, []);


    useEffect(() => {
        setTeamItems(TeamData.map(t => ({ label: t.name, value: t.id })));
    }, [TeamData]);


    useEffect(() => {
        setEmployeeItems(employeesData.map(e => ({ label: `${e.name} (${e.email})`, value: e.id })));
    }, [employeesData]);


    useEffect(() => {
        if (teamValue != null) {
            const found = TeamData.find(t => t.id === teamValue) || null;
            setSelectedTeam(found);
        } else {
            setSelectedTeam(null);
        }
    }, [teamValue, TeamData]);


    useEffect(() => {
        if (employeeValue != null) {
            const found = employeesData.find(e => e.id === employeeValue) || null;
            setSelectedEmployee(found);
        } else {
            setSelectedEmployee(null);
        }
    }, [employeeValue, employeesData]);

    async function handleAddMember() {
        if (!selectedTeam || !selectedEmployee) {
            setFeedback("Selecione uma equipe e um membro.");
            return;
        }

        console.log(selectedTeam, selectedEmployee);
        try {
            const res = await api.post("/teamMember/create", {
                teamId: selectedTeam.id,
                personId: selectedEmployee.id,
            });
            setFeedback(res.data.msg || "Membro adicionado!");

            setSelectedTeam(null);
            setSelectedEmployee(null);
            // setTeamData(prev => prev.map(team => 
            //     team.id === selectedTeam.id 
            //     ? { ...team, members: [...team.members, selectedEmployee] } 
            //     : team.members.find(m => m.id === selectedEmployee.id)? {...team, members: [...team.members.filter(m => m.id !== selectedEmployee.id)]} : team
            // ));

            fetchTeams();
        } catch (error: any) {
            setFeedback(error.response?.data?.msg || "Erro ao adicionar membro.");
        }

    }


    return (
        <ScrollView style={TabsStyles.container} >

            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />

                <View style={TabsStyles.conjHeaderPrincipal}>
                    <View style={style.EquipesHeader}>

                        <Text style={TabsStyles.tituloPrincipal}>Equipes</Text>

                        <View style={style.buttonEquipes}>

                            <TouchableOpacity >
                                <Link href={'/home/cadastrarUsuario'}>
                                    <View style={style.iconeAcao}>
                                        <UserPlus color="#fff" size={17} style={{ alignItems: "center" }} />
                                    </View >
                                </Link>
                            </TouchableOpacity>

                            <View style={style.iconeAcao}>
                                <TouchableOpacity >
                                    <Link href={'/home/criarEquipe'}>
                                        <Users color="#fff" size={17} />
                                    </Link>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <Text style={TabsStyles.subtituloPrincipal}>Gerencie suas equipes e membros</Text>
                </View>

            </View>


            {/* input data */}

            <View style={style.card}>
                <ScrollView>
                    <View>
                        <Text style={style.cardTitle}>Minha equipe</Text>
                    </View>

                    {TeamData.map((team) => (
                        <View key={team.id} style={{ marginTop: 20 }}>
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
                                <Text style={style.quantMembro}>
                                    {team.members ? team.members.length : 0} membros
                                </Text>

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

                </ScrollView>

            </View>




            {/* card adicionar membro */}
            <ScrollView nestedScrollEnabled>
                <View style={style.cardAdicionar}>
                    <Text style={style.tituloAdicionar}>Adicionar Membro</Text>
                    <View style={{ marginTop: 12 }}>
                        <Text style={style.labelAdicionar}>Nome da equipe:</Text>
                        <DropDownPicker
                            open={teamOpen}
                            value={teamValue}
                            items={teamItems}
                            setOpen={setTeamOpen}
                            setValue={setTeamValue}
                            setItems={setTeamItems}
                            placeholder="Selecione a equipe"
                            style={style.inputAdicionar}
                            dropDownContainerStyle={{
                                backgroundColor: '#e6e6e6',
                                borderRadius: 10,
                                borderColor: 'transparent',
                                maxHeight: 300,
                            }}
                            listMode="SCROLLVIEW" // 👈 importante
                            scrollViewProps={{
                                nestedScrollEnabled: true, // 👈 permite rolar dentro do card
                            }}
                            placeholderStyle={{ color: '#6c6c6c' }}
                            disabledItemLabelStyle={{ color: '#6c6c6c' }}
                            textStyle={{ color: teamValue ? '#000' : '#6c6c6c' }}
                            zIndex={1000} // 👈 evita que um dropdown cubra o outro
                            zIndexInverse={999}
                        />
                    </View>
                    <View style={{ marginTop: 12, marginBottom: 4 }}>
                        <Text style={style.labelAdicionar}>Membro:</Text>
                        <DropDownPicker
                            open={employeeOpen}
                            value={employeeValue}
                            items={employeeItems}
                            setOpen={setEmployeeOpen}
                            setValue={setEmployeeValue}
                            setItems={setEmployeeItems}
                            placeholder="Selecione o membro"
                            style={[style.inputAdicionar, { borderWidth: 0, borderColor: 'transparent' }]}
                            dropDownContainerStyle={{
                                backgroundColor: '#e6e6e6',
                                borderRadius: 10,
                                borderColor: 'transparent',
                                maxHeight: 100, // altura máxima do menu
                            }}
                            listMode="SCROLLVIEW" 
                            scrollViewProps={{
                                nestedScrollEnabled: true, // ✅ permite rolar dentro do card
                            }}
                            dropDownDirection="BOTTOM" // 👈 força abrir pra baixo (ajuda a não sair do card)
                            placeholderStyle={{ color: '#6c6c6c' }}
                            disabledItemLabelStyle={{ color: '#6c6c6c' }}
                            textStyle={{ color: employeeValue ? '#000' : '#6c6c6c' }}
                            zIndex={1000} // 👈 evita sobreposição
                            zIndexInverse={999}

                        />
                    </View>
                    <TouchableOpacity onPress={handleAddMember}>
                        <View style={{ alignItems: "center", marginTop: 18 }}>
                            <View style={style.botaoAdicionar}>
                                <Text style={style.textoBotaoAdicionar}>Adicionar membro</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {feedback ? (
                        <Text style={{ color: feedback.includes("Erro") ? "red" : "green", marginTop: 10, textAlign: "center" }}>
                            {feedback}
                        </Text>
                    ) : null}
                </View>
            </ScrollView>
        </ScrollView >
    )
}

const style = StyleSheet.create({
    EquipesHeader: {
        flexDirection: "row",
        gap: 100
    },
    buttonEquipes: {
        gap: 12,
        flexDirection: "row",
        transform: [{ translateY: -5 }],


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
    cardTitle: {
        fontSize: 18,
        fontWeight: "500",
        color: "#222",

        textAlign: "center",
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
        borderRadius: 10,
        backgroundColor: '#e6e6e6',
        padding: 10,
        borderColor: '#e6e6e6', // Garante que a borda tenha a mesma cor
        borderWidth: 1,
    },
    inputTextAdicionar: {
        color: "#8B8686",
        fontSize: 14,
    },
    botaoAdicionar: {
        backgroundColor: "#A50702",
        color: "#fff",
        borderRadius: 10,
        paddingVertical: 12,
        width: "62%",
        marginTop: 10,
        marginBottom: 30,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center"

    },
    textoBotaoAdicionar: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "400",
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