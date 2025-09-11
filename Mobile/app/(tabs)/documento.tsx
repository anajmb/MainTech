import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Download, FileText, Search } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Documento() {
    const [filtro, setFiltro] = useState("todas");

    // Exemplo de dados
    const documentos = [
        { id: 1, nome: "Documento A", status: "analise" },
        { id: 2, nome: "Documento B", status: "concluida" },
        { id: 3, nome: "Documento C", status: "analise" },
    ];

    // Filtra os documentos conforme o filtro selecionado
    const documentosFiltrados = documentos.filter(doc => {
        if (filtro === "todas") return true;
        if (filtro === "analise") return doc.status === "analise";
        if (filtro === "concluida") return doc.status === "concluida";
        return true;
    });

    return (
        <View style={TabsStyles.container}>
            {/* Logo */}

            <View style={styles.header}>
                <SetaVoltar />

                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Documentos</Text>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchCard}>
                    <Search style={styles.searchIcon} />
                    <TextInput placeholderTextColor={'#9D9D9D'} placeholder="Buscar documentos" style={styles.input} />
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
                <TouchableOpacity onPress={() => setFiltro("analise")}>
                    <Text
                        style={[
                            styles.filtroTitulo,
                            filtro === "analise" && { color: "#fff", backgroundColor: '#CF0000' }
                        ]}
                    >
                        Em análise
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

            <ScrollView contentContainerStyle={{ paddingBottom: 250 }}>
                <View style={styles.documentosList}>
                    <View style={styles.infosDocumentos}>
                        <View style={{ flexDirection: 'row', gap: 15 }}>
                            <View style={{ padding: 8, borderRadius: 5, backgroundColor: '#dd3b3b', marginTop: 3 }}>
                                <FileText color={styles.documentosIcon.color} />
                            </View>
                            <Text style={styles.documentosNome}>Ordem de serviço 100</Text>
                        </View>
                        <Text style={styles.documentosDescricao}>3,4 MB • 19/09/2025</Text>
                        <Download style={styles.downloadIcon} />
                    </View>

                    <View style={styles.infosDocumentos}>
                        <View style={{ flexDirection: 'row', gap: 15 }}>
                            <View style={{ padding: 8, borderRadius: 5, backgroundColor: '#dd3b3b', marginTop: 3 }}>
                                <FileText color={styles.documentosIcon.color} />
                            </View>
                            <Text style={styles.documentosNome}>Ordem de serviço 99</Text>
                        </View>
                        <Text style={styles.documentosDescricao}>3,4 MB • 17/09/2025</Text>
                        <Download style={styles.downloadIcon} />
                    </View>

                    <View style={styles.infosDocumentos}>
                        <View style={{ flexDirection: 'row', gap: 15 }}>
                            <View style={{ padding: 8, borderRadius: 5, backgroundColor: '#dd3b3b', marginTop: 3 }}>
                                <FileText style={styles.documentosIcon} />
                            </View>
                            <Text style={styles.documentosNome}>Ordem de serviço 98</Text>
                        </View>
                        <Text style={styles.documentosDescricao}>3,4 MB • 17/09/2025</Text>
                        <Download style={styles.downloadIcon} />
                    </View>

                    <View style={styles.infosDocumentos}>
                        <View style={{ flexDirection: 'row', gap: 15 }}>
                            <View style={{ padding: 8, borderRadius: 5, backgroundColor: '#dd3b3b', marginTop: 3 }}>
                                <FileText style={styles.documentosIcon} />
                            </View>
                            <Text style={styles.documentosNome}>Ordem de serviço 97</Text>
                        </View>
                        <Text style={styles.documentosDescricao}>3,4 MB • 17/09/2025</Text>
                        <Download style={styles.downloadIcon} />
                    </View>

                     <View style={styles.infosDocumentos}>
                        <View style={{ flexDirection: 'row', gap: 15 }}>
                            <View style={{ padding: 8, borderRadius: 5, backgroundColor: '#dd3b3b', marginTop: 3 }}>
                                <FileText style={styles.documentosIcon} />
                            </View>
                            <Text style={styles.documentosNome}>Ordem de serviço 97</Text>
                        </View>
                        <Text style={styles.documentosDescricao}>3,4 MB • 17/09/2025</Text>
                        <Download style={styles.downloadIcon} />
                    </View>

                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchContainer: {
        backgroundColor: '#eeeeee',
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 10

    },
    searchCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E6E6E6',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginVertical: 8,
        marginTop: 20,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 6,
        color: '#9D9D9D',
    },
    input: {
        backgroundColor: 'transparent',
        padding: 10,
        position: 'relative',
        borderRadius: 10,
        textAlign: 'auto'
    },
    filtro: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 32,
        marginTop: 5,
        backgroundColor: '#eeeeee',
        paddingVertical: 30,
        borderRadius: 10,
        paddingHorizontal: 5,
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'

    },
    filtroTitulo: {
        padding: 10,
        borderRadius: 20,
        paddingHorizontal: 20,
    },
    documentosList: {
        gap: 20,
    },
    infosDocumentos: {
        backgroundColor: '#eeeeee',
        padding: 20,
        borderRadius: 10,
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    },
    documentosIcon: {
        color: '#fff',
    },
    documentosNome: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    documentosDescricao: {
        fontSize: 13,
        color: '#666',
        marginTop: -6,
        marginLeft: 55
    },
    downloadIcon: {
        color: '#333',
        marginLeft: 'auto',

    }
})