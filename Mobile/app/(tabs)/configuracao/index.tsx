import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Link, useRouter, useFocusEffect } from "expo-router";
import { BellRing, CircleQuestionMark, LogOut, PersonStanding, Shield, User, LockKeyhole, PersonStandingIcon } from "lucide-react-native";
import { useEffect, useState, useCallback } from "react";
import { Alert, Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "@/contexts/authContext";


// add switch buttons na notificação e na acessibilidade -> FEITO
// vamos ter uma página Ajuda e Suporte?
// ao clicar no texto o link não funciona, só no fundo -> o do perfil funciona -> CORRIGIDO (estava invertido)
// o scroll da página não vai até o final -> CORRIGIDO
// add um subtitulo -> FEITO

export default function Configuracao() {

    const { user } = useAuth();
    const [inAppNotificationsEnabled, setInAppNotificationsEnabled] = useState(false);


    const [_, setForceUpdate] = useState(0);

    if (!user) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    useFocusEffect(
        useCallback(() => {

            setForceUpdate(c => c + 1);
        }, [])
    );

    useEffect(() => {
        const loadPreference = async () => {
            const storedValue = await AsyncStorage.getItem('notificationsEnabled');
            setInAppNotificationsEnabled(storedValue === 'true');
        };
        loadPreference();
    }, []);

    const handleToggleNotifications = async () => {
        if (inAppNotificationsEnabled) {
            setInAppNotificationsEnabled(false);
            await AsyncStorage.setItem('notificationsEnabled', 'false');
            Alert.alert("Notificações Desativadas", "Você não receberá mais notificações.");
            return;
        }

        const { status, canAskAgain } = await Notifications.getPermissionsAsync();

        if (canAskAgain || status === 'undetermined') {
            const { status: newStatus } = await Notifications.requestPermissionsAsync();
            if (newStatus === 'granted') {
                setInAppNotificationsEnabled(true);
                await AsyncStorage.setItem('notificationsEnabled', 'true');
                Alert.alert("Notificações Ativadas", "Você voltará a receber notificações.");
            }
        } else if (status === 'granted') {
            setInAppNotificationsEnabled(true);
            await AsyncStorage.setItem('notificationsEnabled', 'true');
            Alert.alert("Notificações Ativadas", "Você voltará a receber notificações.");
        } else {
            Alert.alert(
                "Ação Necessária",
                "As notificações estão bloqueadas nas configurações do seu celular. Vá até as configurações do app para ativá-las.",
                [{ text: "OK" }]
            );
        }
    };

    console.log("Usuário no Configuração:", user);

    return (
        // 🔥 7. Corrigido o problema do Scroll (aumentado padding)
        <ScrollView style={TabsStyles.container} contentContainerStyle={{ paddingBottom: 120 }}>

            <View style={TabsStyles.headerPrincipal}>
                <View>
                    <SetaVoltar />
                </View>

                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Configuração</Text>
                    {/* 🔥 8. Subtítulo adicionado */}
                    <Text style={TabsStyles.subtituloPrincipal}>Gerencie sua conta e preferências</Text>
                </View>
            </View>

            <View style={styles.cardContainer}>

                {/* 🔥 9. Corrigido o Link do Perfil para usar o padrão asChild */}
                <Link href={'/(tabs)/configuracao/editarPerfil'} asChild>
                    <TouchableOpacity style={styles.card}>
                        <View style={styles.opcao}>
                            <View style={TabsStyles.userFotoIcon}>
                                {user?.photo ? (
                                    <Image
                                        source={{ uri: user.photo }}
                                        style={TabsStyles.userFoto}
                                        resizeMode="cover" // faz a imagem cobrir o espaço
                                    />
                                ) : (
                                    <User size={22} color="#fff" />
                                )}
                            </View>
                            <View style={styles.infoCard}>
                                <Text style={styles.nomePerfil}>{user?.name?.split(" ")[0] || "Usuário"}</Text>
                                <Text style={styles.emailPerfil}>{user?.email || " "}</Text>
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

                        <Link href={'/(tabs)/configuracao/politica'} asChild>
                            <TouchableOpacity style={styles.opcao}>
                                <View style={styles.infoCardButton}>
                                    <LockKeyhole />

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
                                <TouchableOpacity>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#D10B03" }}
                                        thumbColor={"#f4f3f4"}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={handleToggleNotifications}
                                        value={inAppNotificationsEnabled}
                                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Outros */}
                <View style={styles.bloco}>
                    <Text style={styles.tituloCard}>Outros</Text>

                    <View style={styles.card}>

                        <Link href={"/"} asChild>
                            <TouchableOpacity style={styles.opcao}>
                                <View style={{ flexDirection: 'row' }}>
                                    <LogOut color={'#F24040'} />

                                    <View style={styles.infoCard}>
                                        <Text style={styles.tituloOpcaoSair}>Sair</Text>
                                        <Text style={styles.subtitulo}>Desconectar da conta</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                        </Link>
                    </View>
                </View>

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        // paddingBottom: 90 // (original)
        paddingBottom: 90 // Apenas garantir que o container principal não tenha o padding
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
        flex: 1
    },
    opcao: {
        padding: 20,
        flexDirection: 'row',
    },
    nomePerfil: {
        fontSize: 16,
        fontWeight: '700', // mudei de 700 para '700' string

    },
    emailPerfil: {
        fontSize: 12,
        fontWeight: '500', // mudei de 'medium' para '500'
        color: '#00000075'
    },
    bloco: {

    },
    tituloCard: {
        fontSize: 15,
        fontWeight: '500', // mudei de 500 para '500' string
        marginTop: 20,
        marginBottom: 10
    },
    tituloOpcao: {
        fontSize: 14,
        fontWeight: '500' // mudei de 'medium' para '500'
    },
    tituloOpcaoSair: {
        fontSize: 14,
        fontWeight: '500', // mudei de 'medium' para '500'
        color: '#F24040'
    },
    subtitulo: {
        fontSize: 12,
        fontWeight: '500', // mudei de 'medium' para '500'
        color: '#00000075'
    },
})