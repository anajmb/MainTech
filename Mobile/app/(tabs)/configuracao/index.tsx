import SetaVoltar from "@/components/setaVoltar";
import { fetchCurrentUser, removeToken } from "@/lib/auth";
import { TabsStyles } from "@/styles/globalTabs";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Link, useRouter } from "expo-router";
import { BellRing, LogOut, PersonStanding, Shield, User } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";


// add switch buttons na notificação e na acessibilidade
// vamos ter uma página Ajuda e Suporte?
// ao clicar no texto o link não funciona, só no fundo -> o do perfil funciona
// o scroll da página não vai até o final
// add um subtitulo

export default function Configuracao() {
    const router = useRouter(); 
    const [inAppNotificationsEnabled, setInAppNotificationsEnabled] = useState(false);

    const [user, setUser] = useState<any | null>(null); 
    const [loadingUser, setLoadingUser] = useState(true); 

    useEffect(() => {
        (async () => {
            setLoadingUser(true);
            const u = await fetchCurrentUser();
            if (u) setUser(u);
            setLoadingUser(false);
        })();

        const syncPermissionStatus = async () => {
            const storedValue = await AsyncStorage.getItem('notificationsEnabled');
            if (storedValue !== null) {
                setInAppNotificationsEnabled(storedValue === 'true');
                return;
            }

            // se não existir valor salvo, pega permissão atual
            const { status } = await Notifications.getPermissionsAsync();
            setInAppNotificationsEnabled(status === 'granted');
        };
        syncPermissionStatus();
    }, []);

    const handleLogout = async () => { 
        await removeToken();
        router.replace("/"); 
    };
    
    const handleToggleNotifications = async () => {
        try {
            // desligar
            if (inAppNotificationsEnabled) {
                setInAppNotificationsEnabled(false);
                await AsyncStorage.setItem('notificationsEnabled', 'false');
                Alert.alert("Notificações Desativadas", "Você não receberá mais notificações.");
                return;
            }

            // checa permissão atual
            const { status } = await Notifications.getPermissionsAsync();
            if (status === 'granted') {
                setInAppNotificationsEnabled(true);
                await AsyncStorage.setItem('notificationsEnabled', 'true');
                Alert.alert("Notificações Ativadas", "Você voltará a receber notificações.");
                return;
            }

            // solicita permissão
            const { status: newStatus } = await Notifications.requestPermissionsAsync();
            if (newStatus === 'granted') {
                setInAppNotificationsEnabled(true);
                await AsyncStorage.setItem('notificationsEnabled', 'true');
                Alert.alert("Notificações Ativadas", "Você voltará a receber notificações.");
            } else {
                setInAppNotificationsEnabled(false);
                await AsyncStorage.setItem('notificationsEnabled', 'false');
                Alert.alert("Permissão negada", "Não foi possível ativar as notificações.");
            }
        } catch (error) {
            console.log('Erro ao alternar notificações:', error);
        }
    };

    return (
        <ScrollView style={TabsStyles.container}>

            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />

                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Configuração</Text>
                </View>
            </View>

            <View style={styles.cardContainer}>

                <Link href={'/(tabs)/configuracao/editarPerfil'} asChild>
                    <TouchableOpacity style={styles.card}>
                        <View style={styles.opcao}>
                            <View style={TabsStyles.userFotoIcon}>
                                <User size={22} color={'#fff'} />
                            </View>
                            <View style={styles.infoCard}>
                                <Text style={styles.nomePerfil}>
                                    {loadingUser ? "Carregando..." : (user?.name ?? "Usuário")}
                                </Text>
                                <Text style={styles.emailPerfil}>
                                    {loadingUser ? "" : (user?.email ?? "")}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Link>

                {/* Conta */}
                <View style={styles.bloco}>
                    <Text style={styles.tituloCard}>Conta</Text>

                    <View style={styles.card}>

                        <Link href={'/(tabs)/configuracao/privacidade'} asChild>
                            <TouchableOpacity style={styles.opcao}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Shield />
                                    <View style={styles.infoCard}>
                                        <Text style={styles.tituloOpcao}>Privacidade e Segurança</Text>
                                        <Text style={styles.subtitulo}>Gerenciar senha e autenticação</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Link>

                        <Link href={'/(tabs)/configuracao/privacidade'} asChild>
                            <TouchableOpacity style={styles.opcao}>
                                <View style={styles.infoCardButton}>
                                    <PersonStanding />

                                    <View style={styles.infoCard1}>
                                        <Text style={styles.tituloOpcao}>Politica de Privacidade</Text>
                                        <Text style={styles.subtitulo}>Entenda o uso dos seus dados</Text>
                                    </View>

                                </View>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>

                {/* Preferências */}
                <View style={styles.bloco}>
                    <Text style={styles.tituloCard}>Preferências</Text>

                    <View style={styles.card}>
                        <View style={styles.opcao}>
                            <View style={styles.infoCardButton}>
                                <BellRing style={{ marginRight: 12 }} />
                                <View style={styles.infoCard1}>
                                    <Text style={styles.tituloOpcao}>Notificações</Text>
                                    <Text style={styles.subtitulo}>Controlar alertas e avisos</Text>
                                </View>
                                <Switch
                                    trackColor={{ false: "#767577", true: "#D10B03" }}
                                    thumbColor={"#f4f3f4"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={handleToggleNotifications}
                                    value={inAppNotificationsEnabled}
                                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                />
                            </View>
                        </View>

                    </View>
                </View>

                {/* Suporte */}
                {/* <View style={styles.bloco}>
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
                </View> */}

                {/* Outros */}
                <View style={styles.bloco}>
                    <Text style={styles.tituloCard}>Outros</Text>

                    <View style={styles.card}>
                        <TouchableOpacity onPress={handleLogout} style={styles.opcao}>
                            <LogOut color={'#F24040'} />
                            <View style={styles.infoCard}>
                                <Text style={styles.tituloOpcaoSair}>Sair</Text>
                                <Text style={styles.subtitulo}>Desconectar da conta</Text>
                            </View>
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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 2,
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 2,
        boxShadow: "1px 4px 4px rgba(0, 0, 0, 0.25)",
    },
    infoCard: {
        flexDirection: 'column',
        marginLeft: 16,
        justifyContent: 'center'
    },
    infoCard1: {
        flexDirection: 'column',
        marginLeft: 16,
        justifyContent: 'center',
        flex: 1
    },
    infoCardButton: {
        flexDirection: 'row',
        justifyContent: "space-between",
        flex: 1,
        alignItems: 'center'
    },
    opcao: {
        padding: 20,
        flexDirection: 'row',
    },
    nomePerfil: {
        fontSize: 16,
        fontWeight: "700",

    },
    emailPerfil: {
        fontSize: 12,
        fontWeight: "500",
        color: '#00000075'
    },
    bloco: {
        
    },
    tituloCard: {
        fontSize: 15,
        fontWeight: "500",
        marginTop: 20,
        marginBottom: 10
    },
    tituloOpcao: {
        fontSize: 14,
        fontWeight: "500"
    },
    tituloOpcaoSair: {
        fontSize: 14,
        fontWeight: "500",
        color: '#F24040'
    },
    subtitulo: {
        fontSize: 12,
        fontWeight: "500",
        color: '#00000075'
    },
})