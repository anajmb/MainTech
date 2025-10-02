import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";

export default function CadastrarUsuario() {
    return (
        <ScrollView style={TabsStyles.container}>
            
            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                <Text style={TabsStyles.tituloPrincipal}>Cadastrar Usuário</Text>
                <Text style={TabsStyles.subtituloPrincipal}>Cadastre</Text>
            </View>
            </View>

            /* Card de cadastro */
            <View style={style.cardCadastro}>
                <Text style={style.tituloCardCadastro}>Informe os dados para liberar o cadastro</Text>
                <Text style={style.label}>Nome  Completo</Text>
                <TextInput
                    style={style.input}
                    placeholder="Nome do Usuário"
                    placeholderTextColor="#C4C4C4"
                />
                <Text style={style.label}>CPF</Text>
                <TextInput
                    style={style.input}
                    placeholder="Digite o CPF"
                    placeholderTextColor="#C4C4C4"
                />
                <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={style.label}>Cargo</Text>
                        <View style={style.input}>
                            <Text style={style.inputText}>Selecione</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={style.label}>Equipe</Text>
                        <View style={style.input}>
                            <Text style={style.inputText}>Selecione</Text>
                        </View> 
                    </View>
                </View>
                <TouchableOpacity style={style.botaoCadastro}>
                    <Text style={style.textoBotaoCadastro}>Cadastrar usuário</Text>
                </TouchableOpacity>
            </View>

            // Card de usuários cadastrados 
            <View style={style.cardUsuarios}>
                <Text style={style.tituloUsuarios}>Usuários cadastrados</Text>
                
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
                </View>
            </View>
        </ScrollView>
    )
}

const style = StyleSheet.create({
    
    tituloHeader: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#222",
        left: 10,           
    },
    cardCadastro: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        

    },
    tituloCardCadastro: {
       fontSize: 18,
        fontWeight: "500",
        color: "#222",
        marginBottom: 25,
        textAlign: "center",
        marginTop: 3,
       
    },
    label: {
        fontSize: 15,
        color: "#222",
        marginBottom: 4,
        fontWeight: "400",
    },
    input: {
        backgroundColor: "#F5F5F5",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        justifyContent: "center",
    },
    inputText: {
        color: "#C4C4C4",
        fontSize: 14,
    },
    botaoCadastro: {
        backgroundColor: "#CE221E",
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        width: 230,
        alignSelf: "center",     
    },
    textoBotaoCadastro: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "500",
    },
    cardUsuarios: {
        backgroundColor: "#fff",
        margin: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 4,
        elevation: 3,
        borderRadius: 16,
        padding: 16,
    },
    tituloUsuarios: {
        fontSize: 17 ,
        color: "#000000",
        fontWeight: "500",
        marginBottom: 12,
        textAlign: "center",
    },
    usuarioItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
       
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#E5E5E5",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
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
        paddingVertical: 4,
        marginLeft: 8,
        color: "#000000",
        
    },
    tagCargoText: {
        color: "#000000",
        fontSize: 12,
        fontWeight: "500",
    },
});