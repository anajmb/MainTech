import { Lock, Shield, TriangleAlert } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";

export default function Privacidade() {
    return (
        <SafeAreaView style={styles.screenContainer}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={[TabsStyles.headerPrincipal, styles.headerContainer]}>
                    <SetaVoltar />
                    <View style={TabsStyles.conjHeaderPrincipal}>
                        <Text style={TabsStyles.tituloPrincipal}>Privacidade e Segurança</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardIconContainer}>
                            <Shield color="#4CAF50" size={28} />
                        </View>
                        <View style={styles.cardTextContainer}>
                            <Text style={styles.cardTitle}>Conta Protegida</Text>
                            <Text style={styles.cardSubtitle}>Seu nível de segurança está alto</Text>
                        </View>
                    </View>
                    
                    <View style={styles.separator} />

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>95%</Text>
                            <Text style={styles.statLabel}>Segurança</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>2</Text>
                            <Text style={styles.statLabel}>Fatores</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>24h</Text>
                            <Text style={styles.statLabel}>Ativo</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Lock color="#555" size={20} />
                        <Text style={styles.sectionTitle}>Alterar Senha</Text>
                    </View>

                    <Text style={styles.inputLabel}>Senha atual:</Text>
                    <TextInput secureTextEntry style={styles.textInput} />

                    <Text style={styles.inputLabel}>Nova senha:</Text>
                    <TextInput secureTextEntry style={styles.textInput} />

                    <Text style={styles.inputLabel}>Confirmar nova senha:</Text>
                    <TextInput secureTextEntry style={styles.textInput} />

                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.buttonText}>Alterar Senha</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <TriangleAlert color="#FFA000" size={20} />
                        <Text style={styles.sectionTitle}>Dicas de Segurança</Text>
                    </View>
                    
                    <View style={styles.tipItem}>
                        <Text style={styles.tipBullet}>•</Text>
                        <Text style={styles.tipText}>Use senhas únicas e complexas</Text>
                    </View>
                    <View style={styles.tipItem}>
                        <Text style={styles.tipBullet}>•</Text>
                        <Text style={styles.tipText}>Mantenha o aplicativo sempre atualizado</Text>
                    </View>
                    <View style={styles.tipItem}>
                        <Text style={styles.tipBullet}>•</Text>
                        <Text style={styles.tipText}>Não compartilhe suas credenciais</Text>
                    </View>
                    <View style={styles.tipItem}>
                        <Text style={styles.tipBullet}>•</Text>
                        <Text style={styles.tipText}>Faça logout em dispositivos desconhecidos</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: "#F8F8F8",
    },
    headerContainer: {
        paddingHorizontal: 0,
        paddingTop: 10,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        marginHorizontal: 20, 
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIconContainer: {
        backgroundColor: '#E8F5E9',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardTextContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    cardSubtitle: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    separator: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginVertical: 16,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    statItem: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
    },
    statLabel: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginLeft: 10,
    },
    inputLabel: {
        fontSize: 15,
        color: "#555",
        marginBottom: 6,
        marginTop: 10,
    },
    textInput: {
        backgroundColor: "#F5F5F5",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0'
    },
    actionButton: {
        backgroundColor: "#D32F2F",
        paddingVertical: 15,
        borderRadius: 12,
        marginTop: 24,
        alignItems: 'center',
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    tipBullet: {
        fontSize: 16,
        color: '#666',
        marginRight: 10,
        lineHeight: 24,
    },
    tipText: {
        fontSize: 15,
        color: '#666',
        flex: 1,
        lineHeight: 24,
    },
});