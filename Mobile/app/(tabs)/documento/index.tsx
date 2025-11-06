import Logo from "@/components/logo";
import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Link } from "expo-router";
import { Download, FileText } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../../lib/axios"; 


interface OrdemServico {
  id: number;
  machineId: number;
  priority: 'low' | 'medium' | 'high';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'; 
  payload: any; 
  createdAt: string; 
}

// --- NOVO --- Função simples para formatar a data
function formatarData(isoString: string) {
  try {
    const data = new Date(isoString);
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  } catch (e) {
    return "Data inválida";
  }
}

export default function Documento() {
  const [filtro, setFiltro] = useState("todas");

  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrdens() {
      try {
        setLoading(true);
        const response = await api.get("/serviceOrders/get"); 
        setOrdens(response.data || []);
      } catch (error) {
        console.log("Erro ao buscar ordens:", error);
        Alert.alert("Erro", "Não foi possível carregar as ordens de serviço.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrdens();
  }, []); 

  const ordensFiltradas = ordens.filter((doc) => {
    if (filtro === "todas") return true;
    if (filtro === "analise") return doc.status === "PENDING" || doc.status === "IN_PROGRESS";
    if (filtro === "concluida") return doc.status === "COMPLETED";
    return true;
  });

  return (
    <ScrollView style={TabsStyles.container}>
      <Logo />

      <View style={TabsStyles.headerPrincipal}>
        <SetaVoltar />
        <View style={TabsStyles.conjHeaderPrincipal}>
          <Text style={TabsStyles.tituloPrincipal}>Documentos</Text>
          <Text style={TabsStyles.subtituloPrincipal}>Veja as O.S.</Text>
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
          <Text style={styles.textoVazio}>Nenhuma ordem de serviço encontrada para este filtro.</Text>
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
                <View style={{ flexDirection: "row", gap: 15 }}>
                  <View style={{ padding: 8, borderRadius: 5, backgroundColor: "#dd3b3b", marginTop: 3 }}>
                    <FileText color={"#fff"} />
                  </View>
                  {/* --- MODIFICADO --- Usando dados reais */}
                  <Text style={styles.documentosNome}>Ordem de serviço {ordem.id}</Text>
                </View>
                {/* --- MODIFICADO --- Usando dados reais */}
                <Text style={styles.documentosDescricao}>
                  Criada em: {formatarData(ordem.createdAt)}
                </Text>
                <Download style={styles.downloadIcon} />
              </TouchableOpacity>
            </Link>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "transparent",
    padding: 10,
    position: "relative",
    borderRadius: 10,
    textAlign: "auto",
  },
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
    backgroundColor: "#eeeeee",
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    flexDirection: "column",
  },
  documentosNome: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  documentosDescricao: {
    fontSize: 13,
    color: "#666",
    marginTop: 8,
    marginLeft: 55, 
  },
  downloadIcon: {
    color: "#333",
    marginLeft: "auto",
  },

  textoVazio: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  }
});