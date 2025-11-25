import SetaVoltar from "@/components/setaVoltar";
import { api } from "@/lib/axios";
import { TabsStyles } from "@/styles/globalTabs";
import { Link } from "expo-router";
import { Wrench, UserPlus, Users } from "lucide-react-native";
import { useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useAuth } from "@/contexts/authContext";

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
  const { user } = useAuth();

  // Equipe do usuário
  const [userTeam, setUserTeam] = useState<Team | null>(null);

  // Todas as equipes (para usar nos dropdowns)
  const [allTeams, setAllTeams] = useState<Team[]>([]);

  // Funcionários
  const [employeesData, setEmployeesData] = useState<Employees[]>([]);

  // Dropdown states
  const [teamOpen, setTeamOpen] = useState(false);
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [teamItems, setTeamItems] = useState<any[]>([]);
  const [employeeItems, setEmployeeItems] = useState<any[]>([]);

  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);

  const [feedback, setFeedback] = useState("");

  // --------------------------------------------------------------------
  // BUSCA APENAS A EQUIPE DO USUÁRIO
  // --------------------------------------------------------------------
  async function loadMyTeam() {
    try {
      const res = await api.get(`/team/getByUSer/${user?.id}`);
      setUserTeam(res.data);
    } catch (err) {
      console.log("Erro ao buscar equipe do usuário:", err);
    }
  }

  // --------------------------------------------------------------------
  // BUSCA TODAS AS EQUIPES (só para mover/adicionar membros)
  // --------------------------------------------------------------------
  async function fetchAllTeams() {
    try {
      const res = await api.get("/team/get");
      setAllTeams(res.data);
    } catch (error) {
      console.log("Erro ao buscar equipes:", error);
    }
  }

  // --------------------------------------------------------------------
  // BUSCA TODOS OS FUNCIONÁRIOS
  // --------------------------------------------------------------------
  async function fetchEmployees() {
    try {
      const res = await api.get("/employees/get");
      setEmployeesData(res.data);
    } catch (error) {
      console.log("Erro ao buscar funcionários:", error);
    }
  }

  useEffect(() => {
    loadMyTeam();
    fetchAllTeams();
    fetchEmployees();
  }, []);

  // Dropdown de equipes
  useEffect(() => {
    setTeamItems(allTeams.map(t => ({ label: t.name, value: t.id })));
  }, [allTeams]);

  // Dropdown de funcionários
  useEffect(() => {
    setEmployeeItems(
      employeesData.map(e => ({
        label: `${e.name} (${e.email})`,
        value: e.id,
      }))
    );
  }, [employeesData]);

  // --------------------------------------------------------------------
  // ADICIONAR MEMBRO (remove da equipe antiga antes)
  // --------------------------------------------------------------------
  async function handleAddMember() {
    if (!selectedTeam || !selectedEmployee) {
      setFeedback("Selecione uma equipe e um membro.");
      return;
    }

    try {
      const oldTeam = allTeams.find(t =>
        t.members.some(m => m.id === selectedEmployee)
      );

      // remover da equipe antiga
      if (oldTeam) {
        await api.delete("/teamMember/delete", {
          data: {
            teamId: oldTeam.id,
            personId: selectedEmployee,
          },
        });
      }

      // adicionar na nova
      const res = await api.post("/teamMember/create", {
        teamId: selectedTeam,
        personId: selectedEmployee,
      });

      setFeedback(res.data.msg || "Membro movido com sucesso!");

      await loadMyTeam();
      await fetchAllTeams();

      setSelectedTeam(null);
      setSelectedEmployee(null);

    } catch (error: any) {
      setFeedback(error.response?.data?.msg || "Erro ao adicionar membro.");
    }
  }

  return (
    <ScrollView style={TabsStyles.container}>
      <View style={TabsStyles.headerPrincipal}>
        <SetaVoltar />

        <View style={TabsStyles.conjHeaderPrincipal}>
          <View style={style.EquipesHeader}>
            <Text style={TabsStyles.tituloPrincipal}>Equipes</Text>

            <View style={style.buttonEquipes}>
              <TouchableOpacity>
                <Link href={"/home/cadastrarUsuario"}>
                  <View style={style.iconeAcao}>
                    <UserPlus color="#fff" size={17} />
                  </View>
                </Link>
              </TouchableOpacity>

              <TouchableOpacity>
                <Link href={"/home/criarEquipe"}>
                  <View style={style.iconeAcao}>
                    <Users color="#fff" size={17} />
                  </View>
                </Link>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={TabsStyles.subtituloPrincipal}>
            Gerencie suas equipes e membros
          </Text>
        </View>
      </View>

      {/* ------------------------- MINHA EQUIPE ------------------------- */}
      <View style={TabsStyles.todosCard}>
        <View style={style.card}>
          <Text style={style.cardTitle}>Minha equipe</Text>

          {userTeam ? (
            <View style={{ marginTop: 20 }}>
              <View style={style.groupEqui}>
                <View style={style.iconeEquipe}>
                  <Wrench color="white" />
                </View>

                <View style={style.infoEqui}>
                  <Text style={style.tituloEqui}>{userTeam.name}</Text>
                  <Text style={style.descricaoEqui}>{userTeam.description}</Text>
                </View>
              </View>

              <View style={style.footerCard}>
                <Text style={style.quantMembro}>
                  {userTeam.members.length} membros
                </Text>

                <TouchableOpacity>
                  <Link href={`/home/verEquipe?teamId=${userTeam.id}`}>
                    <Text style={style.verEquipe}>Ver equipe</Text>
                  </Link>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Você não está em nenhuma equipe
            </Text>
          )}
        </View>

        {/* --------------------- ADICIONAR MEMBRO ----------------------- */}
        <View style={style.cardAdicionar}>
          <Text style={style.tituloAdicionar}>Adicionar Membro</Text>

          <Text style={style.labelAdicionar}>Nome da equipe:</Text>

          <DropDownPicker
            open={teamOpen}
            value={selectedTeam}
            items={teamItems}
            setOpen={setTeamOpen}
            setValue={setSelectedTeam}
            setItems={setTeamItems}
            placeholder="Selecione a equipe"
            style={style.inputAdicionar}
            dropDownContainerStyle={{
              backgroundColor: "#e6e6e6",
              borderRadius: 10,
              borderColor: "transparent",
            }}
            zIndex={1000}
            zIndexInverse={999}
          />

          <Text style={[style.labelAdicionar, { marginTop: 12 }]}>Membro:</Text>

          <DropDownPicker
            open={employeeOpen}
            value={selectedEmployee}
            items={employeeItems}
            setOpen={setEmployeeOpen}
            setValue={setSelectedEmployee}
            setItems={setEmployeeItems}
            placeholder="Selecione o membro"
            style={style.inputAdicionar}
            dropDownContainerStyle={{
              backgroundColor: "#e6e6e6",
              borderRadius: 10,
              borderColor: "transparent",
            }}
            zIndex={999}
            zIndexInverse={1000}
          />

          <TouchableOpacity onPress={handleAddMember}>
            <View style={{ alignItems: "center", marginTop: 22 }}>
              <View style={style.botaoAdicionar}>
                <Text style={style.textoBotaoAdicionar}>Adicionar membro</Text>
              </View>
            </View>
          </TouchableOpacity>

          {feedback ? (
            <Text
              style={{
                color: feedback.includes("Erro") ? "red" : "green",
                marginTop: 10,
                textAlign: "center",
              }}
            >
              {feedback}
            </Text>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
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
        marginBottom: 10,
        fontWeight: "400",
    },
    inputAdicionar: {
        borderRadius: 10,
        backgroundColor: '#e6e6e6',
        padding: 10,
        borderColor: '#e6e6e6',
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