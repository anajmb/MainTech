import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Wrench, MoreVertical } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function VerEquipe() {
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
                            <Text style={TabsStyles.tituloPrincipal}>Manutenção</Text>
                            <Text style={TabsStyles.subtituloPrincipal}>6 membros</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View>
                <Text style={style.fraseEquipe}>Equipe responsável pela manutenção de máquinas e equipamentos</Text>
            </View>

            <View style={style.usuarioItem}>
                <View style={style.avatar}>
                    <Text style={style.avatarText}>JS</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={style.nomeUsuario}>João Silva</Text>
                    <Text style={style.emailUsuario}>joaosilva@empresa.com</Text>
                </View>
                <View style={style.tagCargo}>
                    <Text style={style.tagCargoText}>Líder técnico</Text>
                </View>
                {/* Ícone de três pontinhos dentro do usuárioItem */}
                <TouchableOpacity style={style.menuIcon} onPress={() => {}}>
                    <MoreVertical color="#000" size={16} />
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
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
    fraseEquipe: {
        fontSize: 16,
        color: '#858585',
        marginTop: 0,
        marginLeft: 15,
        marginRight: 15
    },
    usuarioItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.10,
        shadowRadius: 20,
        elevation: 3,
        marginTop: 30,
        marginLeft: 1,
        marginRight: 1,
        marginBottom: 30,
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
        fontWeight: "bold",
        color: "#222",
    },
    nomeUsuario: {
        fontSize: 16,
        fontWeight: "600",
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
        fontWeight: "500",
    },
    menuIcon: {
        position: "absolute",
        top: 10,
        right: 15,
    },
})