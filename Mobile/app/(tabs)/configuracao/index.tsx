import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Link } from "expo-router";
import { BellRing, CircleQuestionMark, LogOut, PersonStanding, Shield, User } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// add switch buttons na notificação e na acessibilidade
// vamos ter uma página Ajuda e Suporte?
// tirei a opção Perfil do usuário (estava repetido)
// ao clicar no texto o link não funciona, só no fundo -> o do perfil funciona
// o scroll da página não vai até o final
// add um subtitulo

export default function Configuracao() {
    return (

        <ScrollView style={TabsStyles.container}>

            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />

                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Configuração</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>Configuração</Text>
                </View>
            </View>

            <View style={styles.cardContainer}>

                <TouchableOpacity style={styles.card}>
                    {/* imagem de perfil */}
                    <Link href={'/(tabs)/configuracao/editarPerfil'}>
                        <View style={styles.opcao}>

                            <View style={TabsStyles.userFotoIcon}>
                                <User size={22} color={'#fff'} />
                            </View>

                            <View style={styles.infoCard}>
                                <Text style={styles.nomePerfil}>João Silva</Text>
                                <Text style={styles.emailPerfil}>joao.silva@email.com</Text>
                            </View>
                        </View>
                    </Link>
                </TouchableOpacity>

                {/* Conta */}
                <View style={styles.bloco}>
                    <Text style={styles.tituloCard}>Conta</Text>

                    <View style={styles.card}>

                        <TouchableOpacity style={styles.opcao}>
                            <Link href={'/(tabs)/configuracao/privacidade'}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Shield />
                                    <View style={styles.infoCard}>
                                        <Text style={styles.tituloOpcao}>Privacidade e Segurança</Text>
                                        <Text style={styles.subtitulo}>Gerenciar senha e autenticação</Text>
                                    </View>
                                </View>
                            </Link>
                        </TouchableOpacity>

                    </View>
                </View>

                {/* Preferências */}
                <View style={styles.bloco}>
                    <Text style={styles.tituloCard}>Preferências</Text>

                    <View style={styles.card}>
                        <TouchableOpacity style={styles.opcao}>
                            <View style={{ flexDirection: 'row' }}>
                                <BellRing />

                                <View style={styles.infoCard}>
                                    <Text style={styles.tituloOpcao}>Notificações</Text>
                                    <Text style={styles.subtitulo}>Controlar alertas e avisos</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.opcao}>
                            <View style={{ flexDirection: 'row' }}>
                                <PersonStanding />

                                <View style={styles.infoCard}>
                                    <Text style={styles.tituloOpcao}>Acessibilidade</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                    </View>
                </View>

                {/* Suporte */}
                <View style={styles.bloco}>
                    <Text style={styles.tituloCard}>Suporte</Text>

                    <View style={styles.card}>
                        <TouchableOpacity style={styles.opcao}>
                            <View style={{ flexDirection: 'row' }}>

                                <CircleQuestionMark />

                                <View style={styles.infoCard}>
                                    <Text style={styles.tituloOpcao}>Ajuda e suporte</Text>
                                    <Text style={styles.subtitulo}>Central de ajuda e FAQ</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Outros */}
                <View style={styles.bloco}>
                    <Text style={styles.tituloCard}>Outros</Text>

                    <View style={styles.card}>

                        <TouchableOpacity style={styles.opcao}>
                            <Link href="/">
                                <View style={{ flexDirection: 'row' }}>
                                    <LogOut color={'#F24040'} />

                                    <View style={styles.infoCard}>
                                        <Text style={styles.tituloOpcaoSair}>Sair</Text>
                                        <Text style={styles.subtitulo}>Desconectar da conta</Text>
                                    </View>
                                </View>
                            </Link>
                        </TouchableOpacity>

                    </View>
                </View>

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        paddingBottom: 90
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
        padding: 20,
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