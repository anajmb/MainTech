import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { BellRing, CircleQuestionMark, LogOut, PersonStanding, Shield, User, UserRound } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Configuracao() {
    return (

        <ScrollView style={TabsStyles.container}>

            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />

                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Configuração</Text>
                </View>
            </View>

            <View style={styles.cardContainer}>

                <TouchableOpacity style={styles.card}>
                    {/* imagem de perfil */}
                    <View style={styles.opcao}>

                        <View style={TabsStyles.userFotoIcon}>
                            <User size={22} color={'#fff'} />
                        </View>

                        <View style={styles.infoCard}>
                            <Text style={styles.nomePerfil}>João Silva</Text>
                            <Text style={styles.emailPerfil}>joao.silva@email.com</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Conta */}
                <View style={styles.bloco}>
                    <Text style={styles.tituloCard}>Conta</Text>

                    <View style={styles.card}>
                        <View style={styles.opcao}>
                            <UserRound />

                            <View style={styles.infoCard}>
                                <Text style={styles.tituloOpcao}>Perfil do Usuário</Text>
                                <Text style={styles.subtitulo}>Editar informações pessoais</Text>
                            </View>
                        </View>

                        <View style={styles.opcao}>
                            <Shield />

                            <View style={styles.infoCard}>
                                <Text style={styles.tituloOpcao}>Privacidade e Segurança</Text>
                                <Text style={styles.subtitulo}>Gerenciar senha e autenticação</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Preferências */}
                <View style={styles.bloco}>
                    <Text style={styles.tituloCard}>Preferências</Text>

                    <View style={styles.card}>
                        <View style={styles.opcao}>
                            <BellRing />

                            <View style={styles.infoCard}>
                                <Text style={styles.tituloOpcao}>Notificações</Text>
                                <Text style={styles.subtitulo}>Controlar alertas e avisos</Text>
                            </View>
                        </View>

                        <View style={styles.opcao}>
                            <PersonStanding />

                            <View style={styles.infoCard}>
                                <Text style={styles.tituloOpcao}>Acessibilidade</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Suporte */}
                <View style={styles.bloco}>
                    <Text style={styles.tituloCard}>Suporte</Text>

                    <View style={styles.card}>
                        <View style={styles.opcao}>
                            <CircleQuestionMark />

                            <View style={styles.infoCard}>
                                <Text style={styles.tituloOpcao}>Ajuda e suporte</Text>
                                <Text style={styles.subtitulo}>Central de ajuda e FAQ</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Outros */}
                <View style={styles.bloco}>
                    <Text style={styles.tituloCard}>Outros</Text>

                    <View style={styles.card}>
                        <View style={styles.opcao}>
                            <LogOut color={'#F24040'} />

                            <View style={styles.infoCard}>
                                <Text style={styles.tituloOpcaoSair}>Sair</Text>
                                <Text style={styles.subtitulo}>Desconectar da conta</Text>
                            </View>
                        </View>
                    </View>
                </View>

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    header: {

    },
    titulo: {

    },
    cardContainer: {
        marginTop: 40,
    },
    card: {
        backgroundColor: "#eeeeee69",
        boxShadow: '1px 5px 10px rgba(0, 0, 0, 0.25)',
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 2,
    },
    infoCard: {
        flexDirection: 'column',
        marginLeft: 16,
    },
    opcao: {
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center'
    },
    nomePerfil: {
        fontSize: 16,
        fontWeight: 700,
    },
    emailPerfil: {
        fontSize: 12,
        fontWeight: 'medium',
        color: '#00000075'
    },
    bloco: {

    },
    tituloCard: {
        fontSize: 15,
        fontWeight: 500,
        marginTop: 20,
        marginBottom: 10
    },
    tituloOpcao: {
        fontSize: 14,
        fontWeight: 'medium'
    },
    tituloOpcaoSair: {
        fontSize: 14,
        fontWeight: 'medium',
        color: '#F24040'
    },
    subtitulo: {
        fontSize: 12,
        fontWeight: 'medium',
        color: '#00000075'
    },
})