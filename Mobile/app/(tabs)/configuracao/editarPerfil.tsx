import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Calendar, Camera, IdCard, Mail, Phone, User } from "lucide-react-native";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// falta o input data
// falta a foto de perfil

export default function EditarPerfil() {
    return (
        <ScrollView style={TabsStyles.container}>
            {/* Logo */}

            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />

                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Editar Perfil</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>Atualize suas informações</Text>
                </View>
            </View>

            <View style={styles.todosCard}>

                <View style={styles.card}>
                    <View style={styles.cardFoto}>

                        <View>
                            <View style={{
                                backgroundColor: '#CE221E', height: 90, width: 90,
                                borderRadius: 50, alignItems: 'center', justifyContent: 'center',
                                position: "relative"
                            }}>
                                <User color={'#fff'} size={50} strokeWidth={1.5} />
                            </View>

                            <View style={{
                                backgroundColor: '#fff', height: 30, width: 30,
                                borderRadius: 50, alignItems: 'center', justifyContent: 'center',
                                boxShadow: '1px 5px 10px rgba(0, 0, 0, 0.25)',
                                position: "absolute", right: 0, bottom: 0,
                            }}>
                                <Camera color={'#CE221E'} size={20} />
                            </View>
                        </View>

                        <Text style={{ color: '#858585', fontSize: 14 }}>Toque para editar a foto</Text>
                    </View>
                </View>

                {/* <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ padding: 2 }}> */}
                    <View style={styles.card}>
                        <View style={styles.formEditar}>

                            <View style={styles.opcaoForm}>
                                <View style={styles.iconELabel}>
                                    <User strokeWidth={1.5} size={22} />
                                    <Text style={styles.label}>Nome completo</Text>
                                </View>
                                <TextInput style={styles.input} />
                            </View>

                            <View style={styles.opcaoForm}>
                                <View style={styles.iconELabel}>
                                    <Mail strokeWidth={1.5} size={22} />
                                    <Text style={styles.label}>E-mail</Text>
                                </View>

                                <TextInput style={styles.input} />
                            </View>

                            <View style={styles.opcaoForm}>
                                <View style={styles.iconELabel}>
                                    <Phone strokeWidth={1.5} size={22} />
                                    <Text style={styles.label}>Telefone</Text>
                                </View>

                                <TextInput style={styles.input} />
                            </View>

                            <View style={styles.opcaoForm}>
                                <View style={styles.iconELabel}>
                                    <IdCard strokeWidth={1.5} size={22} />
                                    <Text style={styles.label}>CPF</Text>
                                </View>

                                <TextInput style={styles.input} />
                            </View>

                            <View style={styles.opcaoForm}>
                                <View style={styles.iconELabel}>
                                    <Calendar strokeWidth={1.5} size={22} />
                                    <Text style={styles.label}>Data de nascimento</Text>
                                </View>
                                {/* input data */}
                                <TextInput style={styles.input} />
                            </View>

                        </View>
                    </View>
                {/* </KeyboardAvoidingView> */}

                <TouchableOpacity style={{ alignItems: 'center' }}>
                    <View style={TabsStyles.viewBotaoPrincipal}>
                        <Text style={TabsStyles.botaoText}>Salvar Alterações</Text>
                    </View>
                </TouchableOpacity>

            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    cardFoto: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15
    },
    formEditar: {
        padding: 35,
        gap: 25
    },
    card: {
        backgroundColor: "#eeeeee69",
        boxShadow: '1px 5px 10px rgba(0, 0, 0, 0.25)',
        borderRadius: 10
    },
    todosCard: {
        gap: 30,
        paddingBottom: 90
    },
    opcaoForm: {

    },
    input: {
        backgroundColor: '#E6E6E6',
        padding: 10,
        borderRadius: 10
    },
    label: {
        fontSize: 14,
        fontWeight: 600
    },
    iconELabel: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        marginBottom: 5
    },
})