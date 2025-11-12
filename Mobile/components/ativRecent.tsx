import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { api } from "@/lib/axios";
import { useAuth } from "@/contexts/authContext";
import { CheckCircle } from "lucide-react-native";

function AtividadesRecentes() {
    const [historico, setHistorico] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchHistorico = async () => {
            if (!user) return;
            try {
                const response = await api.get(`/history/get/user/${user.id}`);
                // Pega as 2 últimas atividades
                const ultimas2 = response.data
                    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 2);
                setHistorico(ultimas2);
            } catch (error) {
                console.error("Erro ao carregar histórico:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistorico();
    }, [user]);

    if (loading) return <ActivityIndicator size="small" color="#CE221E" />;

    if (historico.length === 0) {
        return <Text style={{ color: "#777", textAlign: "center" }}>Nenhuma atividade recente</Text>;
    }

    return (
        <View>
            {historico.map((item, index) => (
                <View
                    key={index}
                    style={styles.ativRecenteCard}
                >
                    <View style={styles.iconAtivRecente}>
                        <CheckCircle color="#51C385" size={22} />
                    </View>
                    <View style={styles.ativInfo}>
                        <Text style={styles.ativInfoTitulo}>{item.action}</Text>
                        {/* {item.description && (
                            <Text style={styles.ativInfoSubtitulo}>{item.description}</Text>
                        )} */}
                        <Text style={styles.ativInfoSubtitulo}>
                            {new Date(item.createdAt).toLocaleDateString()} -{" "}
                            {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    ativRecenteCard: {
        flexDirection: 'row',
        boxShadow: '1px 5px 10px rgba(0, 0, 0, 0.25)',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20
    },
    iconAtivRecente: {
    backgroundColor: '#C7FFDD',
    borderRadius: '50%',
    padding: 7,
  },
  ativInfo: {
    flexDirection: 'column',
    marginLeft: 10,
    gap: 4
  },
  ativInfoTitulo: {
    fontSize: 16
  },
  ativInfoSubtitulo: {
    color: '#848484',
    fontSize: 11
  },
});

export default AtividadesRecentes;
