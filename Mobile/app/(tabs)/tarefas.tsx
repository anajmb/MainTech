import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Tarefas() {

    const [filtro, setFiltro] = useState("todas");

    // Exemplo de dados
    const documentos = [
        { id: 1, nome: "Documento A", status: "Pendente" },
        { id: 2, nome: "Documento B", status: "concluida" },
        { id: 3, nome: "Documento C", status: "Pendente" },
    ];

    // Filtra os documentos conforme o filtro selecionado
    const tarefasFiltrados = documentos.filter(doc => {
        if (filtro === "todas") return true;
        if (filtro === "pendente") return doc.status === "Pendente";
        if (filtro === "concluida") return doc.status === "concluida";
        return true;
    });

    return (
        <View style={TabsStyles.container}>
            {/* Logo */}

            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />

                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Tarefas</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>Minhas tarefas</Text>
                </View>

                <View style={{ backgroundColor: "#D10B03", borderRadius: "50%", padding: 8 }} >
                    <Plus color={"#fff"} strokeWidth={1.8} size={30} />
                </View>
            </View>

            <View style={styles.filtro}>
                <TouchableOpacity onPress={() => setFiltro("todas")}>
                    <Text
                        style={[
                            styles.filtroTitulo,
                            filtro === "todas" && { color: "#fff", backgroundColor: '#CF0000' }
                        ]}
                    >
                        Todas
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFiltro("pendente")}>
                    <Text
                        style={[
                            styles.filtroTitulo,
                            filtro === "pendente" && { color: "#fff", backgroundColor: '#CF0000' }
                        ]}
                    >
                        Pendentes
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFiltro("concluida")}>
                    <Text
                        style={[
                            styles.filtroTitulo,
                            filtro === "concluida" && { color: "#fff", backgroundColor: '#CF0000' }
                        ]}
                    >
                        Concluídas
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    titulo: {

    },
    subtitulo: {

    },
    filtro: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 32,
        marginTop: 40,
        backgroundColor: '#eeeeee',
        paddingVertical: 30,
        borderRadius: 12,
        paddingHorizontal: 5,
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'

    },
    filtroTitulo: {
        padding: 10,
        borderRadius: 20,
        paddingHorizontal: 20,
    },
})