import Logo from "@/components/logo";
import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Link } from "expo-router";
import { Download, FileText } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// ...existing code...
export default function Documento() {
  const [filtro, setFiltro] = useState("todas");

  // Exemplo de dados
  const documentos = [
    { id: 1, nome: "Documento A", status: "analise" },
    { id: 2, nome: "Documento B", status: "concluida" },
    { id: 3, nome: "Documento C", status: "analise" },
  ];

  const documentosFiltrados = documentos.filter((doc) => {
    if (filtro === "todas") return true;
    if (filtro === "analise") return doc.status === "analise";
    if (filtro === "concluida") return doc.status === "concluida";
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
        {/* primeiro item agora usa a mesma estrutura / estilização dos demais */}
        <Link href="/(tabs)/documento/ordemServicoManu" asChild>
          <TouchableOpacity style={styles.infosDocumentos}>
            <View style={{ flexDirection: "row", gap: 15 }}>
              <View style={{ padding: 8, borderRadius: 5, backgroundColor: "#dd3b3b", marginTop: 3 }}>
                <FileText color={"#fff"} />
              </View>
              <Text style={styles.documentosNome}>Ordem de serviço 100</Text>
            </View>
            <Text style={styles.documentosDescricao}>3,4 MB • 19/09/2025</Text>
            <Download style={styles.downloadIcon} />
          </TouchableOpacity>
        </Link>

        <View style={styles.infosDocumentos}>
          <View style={{ flexDirection: "row", gap: 15 }}>
            <View style={{ padding: 8, borderRadius: 5, backgroundColor: "#dd3b3b", marginTop: 3 }}>
              <FileText color={"#fff"} />
            </View>
            <Text style={styles.documentosNome}>Ordem de serviço 99</Text>
          </View>
          <Text style={styles.documentosDescricao}>3,4 MB • 17/09/2025</Text>
          <Download style={styles.downloadIcon} />
        </View>

        <View style={styles.infosDocumentos}>
          <View style={{ flexDirection: "row", gap: 15 }}>
            <View style={{ padding: 8, borderRadius: 5, backgroundColor: "#dd3b3b", marginTop: 3 }}>
              <FileText color={"#fff"} />
            </View>
            <Text style={styles.documentosNome}>Ordem de serviço 98</Text>
          </View>
          <Text style={styles.documentosDescricao}>3,4 MB • 17/09/2025</Text>
          <Download style={styles.downloadIcon} />
        </View>

        <View style={styles.infosDocumentos}>
          <View style={{ flexDirection: "row", gap: 15 }}>
            <View style={{ padding: 8, borderRadius: 5, backgroundColor: "#dd3b3b", marginTop: 3 }}>
              <FileText color={"#fff"} />
            </View>
            <Text style={styles.documentosNome}>Ordem de serviço 97</Text>
          </View>
          <Text style={styles.documentosDescricao}>3,4 MB • 17/09/2025</Text>
          <Download style={styles.downloadIcon} />
        </View>

        <View style={styles.infosDocumentos}>
          <View style={{ flexDirection: "row", gap: 15 }}>
            <View style={{ padding: 8, borderRadius: 5, backgroundColor: "#dd3b3b", marginTop: 3 }}>
              <FileText color={"#fff"} />
            </View>
            <Text style={styles.documentosNome}>Ordem de serviço 97</Text>
          </View>
          <Text style={styles.documentosDescricao}>3,4 MB • 17/09/2025</Text>
          <Download style={styles.downloadIcon} />
        </View>
      </View>
    </ScrollView>
  );
}
// ...existing code...
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
});