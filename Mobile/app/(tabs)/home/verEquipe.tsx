import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { useLocalSearchParams } from "expo-router";
import { MoreVertical, Wrench } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../../lib/axios";
import { useAuth } from "@/contexts/authContext";
import TresPontinhos from "@/hooks/tresPontinhos";

export interface Team {
  id: number;
  name: string;
  description: string;
  members: {
    id: number;
    person: {
      name: string;
      email: string;
      role: 'INSPECTOR' | 'MAINTAINER';
    };
  }[];
}

type Role = 'INSPECTOR' | 'MAINTAINER' | 'ADMIN' | string;

export const formatRole = (role: Role): string => {
  switch (role) {
    case 'INSPECTOR':
      return 'Inspetor';
    case 'MAINTAINER':
      return 'Manutentor';
    case 'ADMIN':
      return 'Administrador';
    default:
      return role || 'Desconhecido';
  }
};

export default function VerEquipe() {
  const { user } = useAuth();
  const { teamId } = useLocalSearchParams();
  const temaid = Number(teamId);

  const [teamData, setTeamData] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeamMembers() {
      if (!user) return;
      setLoading(true);
      try {
        const res = await api.get(`/team/getUnique/${temaid}`);
        setTeamData(res.data);
      } catch (error) {
        console.error("Error fetching team members:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTeamMembers();
  }, [temaid, user]); // dependências corretas

  const getDescriptionByTeam = (name: string | undefined) => {
    switch (name?.toLowerCase()) {
      case "manutenção":
        return "Equipe responsável por realizar reparos, ajustes e manutenção das máquinas e equipamentos.";
      case "inspeção":
        return "Equipe responsável por inspecionar equipamentos, garantir a segurança e o bom funcionamento das máquinas.";
      case "administrativa":
        return "Equipe responsável pela parte administrativa, organização e suporte às demais equipes.";
      default:
        return "Equipe responsável por tarefas específicas dentro da empresa.";
    }
  };

  return (
    <ScrollView style={TabsStyles.container} contentContainerStyle={{ paddingBottom: 200 }}>
      <View style={TabsStyles.headerPrincipal}>
        <SetaVoltar />
        <View style={TabsStyles.conjHeaderPrincipal}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={style.iconeEquipe}>
              <Wrench color="white" />
            </View>
            <View>
              <Text style={style.tituloPrincipal}>
                {teamData?.name}
              </Text>
              <Text style={TabsStyles.subtituloPrincipal}>
                {teamData?.members?.length || 0} membros
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={TabsStyles.todosCard}>
        <View>
          <Text style={style.fraseEquipe}>
            {(teamData?.description)}
          </Text>
        </View>

        {!loading && teamData?.members?.length ? (
          teamData.members.map((member) => (
            <View style={style.usuarioItem} key={member.id}>
              <View style={style.avatar}>
                <Text style={style.avatarText}>
                  {member.person.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={style.nomeUsuario}>{member.person.name}</Text>
                <Text style={style.emailUsuario}>{member.person.email}</Text>
              </View>

              <View style={style.tagCargo}>
                <Text style={style.tagCargoText}>
                  {formatRole(member.person.role)}
                </Text>
              </View>

              {user?.role === "ADMIN" && (
                <View style={style.menuIcon}>
                  <TresPontinhos
                    memberId={member.id}
                    onRemoved={() => {
                      setTeamData((prev) => ({
                        ...prev!,
                        members: prev!.members.filter((m) => m.id !== member.id),
                      }));
                    }}
                  />
                </View>
              )}
            </View>
          ))
        ) : (
          !loading && (
            <Text style={{ textAlign: "center", marginTop: 30, color: "#777" }}>
              Nenhum membro encontrado nesta equipe.
            </Text>
          )
        )}
      </View>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  iconeEquipe: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#1E9FCE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
  tituloPrincipal: {
    fontSize: 28,
    flexWrap: "wrap",
    width: "85%",
    overflow: "hidden",
  },
  fraseEquipe: {
    fontSize: 16,
    color: "#858585",
    marginBottom: 5,
    marginLeft: 15,
    marginRight: 15,
  },
  usuarioItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 3,
    marginLeft: 1,
    marginRight: 1,
    marginBottom: 5,
    position: "relative",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
    marginTop: 5,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },
  nomeUsuario: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
  },
  emailUsuario: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  tagCargo: {
    backgroundColor: "#9AABEF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginLeft: 8,
    color: "#000000",
    marginTop: 18,
  },
  tagCargoText: {
    color: "#000000",
    fontSize: 12,
    textTransform: "none",
  },
  menuIcon: {
    position: "absolute",
    top: 8,
    right: 15,
  },
});
