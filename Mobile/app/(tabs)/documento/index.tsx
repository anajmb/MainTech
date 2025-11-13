import Logo from "@/components/logo";
import SetaVoltar from "@/components/setaVoltar"; // ❗️ Verifique se a importação está correta (com ou sem {})
import { TabsStyles } from "@/styles/globalTabs";
import { Link, useFocusEffect } from "expo-router"; // ❗️ Importe useFocusEffect
import { Download, FileText, UserCheck } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../../lib/axios";
import { useAuth } from "@/contexts/authContext"; // ❗️ Importe useAuth

// --- MUDANÇA 1: Interface atualizada ---
interface OrdemServico {
  id: number;
  machineId: number;
  machineName: string;
  location: string;
  priority: 'low' | 'medium' | 'high';
  // Adicionados os novos status
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED';
  payload: any;
  createdAt: string;
  inspectorName: string;
  maintainerName?: string;
}
// --- Fim da Mudança 1 ---

function formatarData(isoString: string) {
  try {
    const data = new Date(isoString);
    return data.toLocaleDateString('pt-BR');
  } catch (e) {
    return "Data inválida";
  }
}

function getStatusStyle(status: OrdemServico['status']) {
  switch (status) {
    case 'PENDING': return styles.statusPending;
    case 'ASSIGNED': return styles.statusAssigned;
    case 'IN_PROGRESS':
    case 'IN_REVIEW':
      return styles.statusInProgress;
    case 'COMPLETED':
      return styles.statusCompleted;
    default: return {};
  }
}

export default function Documento() {
  const [filtro, setFiltro] = useState("todas");
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Pega o usuário logado

  // --- MUDANÇA 2: Usar 'useFocusEffect' ---
  // Isso garante que a lista recarregue toda vez que você voltar para esta tela
  const fetchOrdens = useCallback(() => {
    async function loadData() {
      try {
        setLoading(true);
        // ❗️ CHAMA A ROTA CORRETA (agora é a raiz '/')
        const response = await api.get("/serviceOrders/get");

        // O backend já filtrou (Manutentor só recebe o dele, Admin vê tudo)
        setOrdens(response.data || []);

      } catch (error: any) {
        console.log("Erro ao buscar ordens:", error.response?.data || error.message);
        Alert.alert("Erro", "Não foi possível carregar as ordens de serviço.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useFocusEffect(fetchOrdens);
  // --- Fim da Mudança 2 ---

  // --- MUDANÇA 3: Filtros atualizados ---
  const ordensFiltradas = ordens.filter((doc) => {
    if (filtro === "todas") return true;
    // "Em análise" agora inclui PENDING, ASSIGNED, IN_PROGRESS, e IN_REVIEW
    if (filtro === "analise") {
      return doc.status !== "COMPLETED";
    }
    if (filtro === "concluida") return doc.status === "COMPLETED";
    return true;
  });
  // --- Fim da Mudança 3 ---

  return (
    <ScrollView style={TabsStyles.container}>
      <Logo />

      <View style={TabsStyles.headerPrincipal}>
        <SetaVoltar />
        <View style={TabsStyles.conjHeaderPrincipal}>
          <Text style={TabsStyles.tituloPrincipal}>Documentos</Text>
          <Text style={TabsStyles.subtituloPrincipal}>
            {user?.role === 'ADMIN' ? "Todas as O.S." : "Minhas O.S."}
          </Text>
        </View>
      </View>

      <View style={styles.filtro}>
        <TouchableOpacity onPress={() => setFiltro("todas")}>
          <Text style={[styles.filtroTitulo, filtro === "todas" && { color: "#fff", backgroundColor: "#CF0000" }]}>Todas</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFiltro("analise")}>
          <Text style={[styles.filtroTitulo, filtro === "analise" && { color: "#fff", backgroundColor: "#CF0000" }]}>Em análise</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFiltro("concluida")}>
          <Text style={[styles.filtroTitulo, filtro === "concluida" && { color: "#fff", backgroundColor: "#CF0000" }]}>Concluídas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.documentosList}>
        {loading ? (
          <ActivityIndicator size="large" color="#CF0000" style={{ marginTop: 30 }} />
        ) : ordensFiltradas.length === 0 ? (
          <Text style={styles.textoVazio}>Nenhuma ordem de serviço encontrada.</Text>
        ) : (
          ordensFiltradas.map((ordem) => (
            <Link
              key={ordem.id}
              href={{
                pathname: "/(tabs)/documento/ordemServicoManu",
                params: { id: ordem.id.toString() },
              }}
              asChild
            >
              <TouchableOpacity style={styles.infosDocumentos}>
                <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: "row", gap: 15 }}>
                    <View style={{ padding: 8, borderRadius: 5, backgroundColor: "#dd3b3b", alignSelf: 'flex-start' }}>
                      <FileText color={"#fff"} />
                    </View>
                    <View>
                      <Text style={styles.documentosNome}>Ordem de serviço #{ordem.id}</Text>
                      <Text style={styles.documentosDescricao}>
                        Máquina: {ordem.machineName || 'N/A'}
                      </Text>
                      <Text style={styles.documentosDescricao}>
                        Criada em: {formatarData(ordem.createdAt)}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.statusText, getStatusStyle(ordem.status)]}>
                    {ordem.status}
                  </Text>
                </View>

                {ordem.maintainerName && (
                  <View style={styles.maintainerInfo}>
                    <UserCheck size={16} color="#000000ff" />
                    <Text style={styles.maintainerText}>
                      Atribuído a: {ordem.maintainerName}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </Link>
          ))
        )}
      </View>
    </ScrollView>
  );
}

// (Os estilos são os mesmos que você me enviou na outra mensagem)
const styles = StyleSheet.create({
  filtro: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
    marginTop: 5,
    backgroundColor: "#eeeeee",
    paddingVertical: 18,
    borderRadius: 12,
    paddingHorizontal: 5,
    elevation: 2,
  },
  filtroTitulo: {
    padding: 10,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  documentosList: {
    gap: 20,
    marginBottom: 40,
  },
  infosDocumentos: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: '#eee',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    flexDirection: "column",
    gap: 15,
  },
  documentosNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  documentosDescricao: {
    fontSize: 13,
    color: "#666",
  },
  downloadIcon: {
    color: "#333",
    position: 'absolute',
    right: 15,
    top: 15,
  },
  textoVazio: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: 'hidden',
    alignSelf: 'flex-start'
  },
  statusPending: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    color: '#dc3545',
  },
  statusAssigned: {
    backgroundColor: 'rgba(23, 162, 184, 0.1)',
    color: '#17a2b8',
  },
  statusInProgress: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    color: '#ffc107',
  },
  statusCompleted: {
    backgroundColor: 'rgba(40, 167, 69, 0.1)',
    color: '#28a745',
  },
  maintainerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
    marginTop: 5,
  },
  maintainerText: {
    fontSize: 14,
    color: '#000000ff',
    fontWeight: '500',
  }
});