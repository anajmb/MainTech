import SetaVoltar from "@/components/setaVoltar";
import { api } from "@/lib/axios";
import { TabsStyles } from "@/styles/globalTabs";
import { Link } from "expo-router";
import { Wrench, UserPlus, Users } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Modal } from "react-native";

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
    const [modalTeamVisible, setModalTeamVisible] = useState(false);
    const [modalEmployeeVisible, setModalEmployeeVisible] = useState(false);
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

                            <TouchableOpacity style={style.iconeAcao}>
                                <Link href={'/home/cadastrarUsuario'}>
                                    <View>
                                        <UserPlus color="#fff" size={17} style={{ alignItems: "center" }} />
                                    </View >
                                </Link>
                            </TouchableOpacity>

                            <TouchableOpacity style={style.iconeAcao}>
                                <Link href={'/home/criarEquipe'}>
                                    <Users color="#fff" size={17} />
                                </Link>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={TabsStyles.subtituloPrincipal}>Gerencie suas equipes e membros</Text>
                </View>

            </View>


            {/* input data */}

            <View style={style.card}>
                <ScrollView>

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

            <View style={style.cardAdicionar}>
                <Text style={style.tituloAdicionar}>Adicionar Membro</Text>
                <View style={{ marginTop: 12 }}>
                    <Text style={style.labelAdicionar}>Nome da equipe:</Text>
                    <TouchableOpacity
                        style={style.inputAdicionar}
                        onPress={() => setModalTeamVisible(true)}
                    >
                        <Text style={style.inputTextAdicionar}>
                            {selectedTeam ? selectedTeam.name : "Selecione a equipe"}
                        </Text>
                    </TouchableOpacity>
                    <Modal
                        visible={modalTeamVisible}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setModalTeamVisible(false)}
                    >
                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(0,0,0,0.3)"
                        }}>
                            <View style={{
                                backgroundColor: "#fff",
                                borderRadius: 10,
                                padding: 20,
                                minWidth: 250,
                                maxHeight: 300
                            }}>
                                {TeamData.map(team => (
                                    <TouchableOpacity
                                        key={team.id}
                                        style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#eee" }}
                                        onPress={() => {
                                            setSelectedTeam(team);
                                            setModalTeamVisible(false);
                                        }}
                                    >
                                        <Text>{team.name}</Text>
                                    </TouchableOpacity>
                                ))}
                                <TouchableOpacity
                                    style={{ marginTop: 10, alignSelf: "flex-end" }}
                                    onPress={() => setModalTeamVisible(false)}
                                >
                                    <Text style={{ color: "blue" }}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View style={{ marginTop: 12 }}>
                    <Text style={style.labelAdicionar}>Membro:</Text>
                    <TouchableOpacity
                        style={style.inputAdicionar}
                        onPress={() => setModalEmployeeVisible(true)}
                    >
                        <Text style={style.inputTextAdicionar}>
                            {selectedEmployee ? selectedEmployee.name : "Selecione o membro"}
                        </Text>
                    </TouchableOpacity>
                    <Modal
                        visible={modalEmployeeVisible}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setModalEmployeeVisible(false)}
                    >
                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(0,0,0,0.3)"
                        }}>
                            <View style={{
                                backgroundColor: "#fff",
                                borderRadius: 10,
                                padding: 20,
                                minWidth: 250,
                                maxHeight: 300
                            }}>
                                {employeesData.map(emp => (
                                    <TouchableOpacity
                                        key={emp.id}
                                        style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#eee" }}
                                        onPress={() => {
                                            setSelectedEmployee(emp);
                                            setModalEmployeeVisible(false);
                                        }}
                                    >
                                        <Text>{emp.name} ({emp.email})</Text>
                                    </TouchableOpacity>
                                ))}
                                <TouchableOpacity
                                    style={{ marginTop: 10, alignSelf: "flex-end" }}
                                    onPress={() => setModalEmployeeVisible(false)}
                                >
                                    <Text style={{ color: "blue" }}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
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