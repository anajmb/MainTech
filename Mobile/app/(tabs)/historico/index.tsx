import { useEffect, useState } from "react";
import Logo from "@/components/logo";
import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { CheckCircle } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { api } from "@/lib/axios";
import { useAuth } from "@/contexts/authContext";


export default function Historico() {
    const [historico, setHistorico] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchHistorico = async () => {
            if (!user) return;
            try {
                console.log("🔍 Buscando histórico para o usuário:", user.id);
                const response = await api.get(`/history/get/user/${user.id}`);
                console.log("📦 Histórico recebido:", response.data);
                setHistorico(response.data);
            } catch (error) {
                console.error("Erro ao carregar histórico:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistorico();
    }, [user]);



    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#CE221E" />
            </View>
        );
    }

    return (
        <ScrollView style={TabsStyles.container}>
            <Logo />
            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Histórico</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>Suas atividades recentes</Text>
                </View>
            </View>

            <View style={TabsStyles.todosCard}>
                {historico.length === 0 ? (
                    <Text style={{ textAlign: "center", marginTop: 20, color: "#888" }}>
                        Nenhum histórico encontrado.
                    </Text>
                ) : (
                    historico.map((item, index) => (
                        <View key={index} style={style.cardHistorico}>
                            <View>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                    <View style={{ backgroundColor: "#E0F7EF", padding: 6, borderRadius: 50 }}>
                                        <CheckCircle color="#6FCF97" size={21} />
                                    </View>
                                    <Text style={style.tituloHistorico}>
                                        {item.action}
                                    </Text>
                                </View>
                                <Text style={style.subtituloHistorico}>
                                    {item.description}
                                </Text>
                                <Text style={style.dataHistorico}>
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </Text>
                                <Text style={style.horaHistorico}>
                                    {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </Text>
                            </View>
                            <Text style={style.ConcluidoText}>
                                {item.entityType}
                            </Text>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const style = StyleSheet.create({
    cardStats: {
        backgroundColor: "#fff",
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 18,
        paddingHorizontal: 24,
        marginHorizontal: 8,
        marginTop: 18, marginBottom: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10, shadowRadius: 4, elevation: 3,
    },
    statsItem: {
        alignItems: "center",
        flex: 1,
    },
    statsNum: {
        fontSize: 22,
        fontWeight: 400,
        color: "#CE221E",
        marginBottom: 2,
    },
    statsTexto: {
        fontSize: 14,
        color: "#888",
    },
    cardHistorico: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 18,
        marginHorizontal: 8,
        marginBottom: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 4,
        elevation: 3,
    },
    tituloHistorico: {
        fontSize: 15,
        fontWeight: 400,
        color: "#222",
        marginTop: -10,
    },
    subtituloHistorico: {
        fontSize: 13,
        color: "#888",
        marginTop: -8,
        marginLeft: 51,
    },
    dataHistorico: {
        fontSize: 12,
        color: "#888",
        marginLeft: 51,
    },
    horaHistorico: {
        fontSize: 12,
        color: "#888",
        marginLeft: 115,
        marginTop: -11.5,
    },
    ConcluidoText: {
        color: "#CE221E",
        fontSize: 15,
        fontWeight: "400",
        marginLeft: 240,
    },
});
