import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Calendar, User } from "lucide-react-native";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

// editar o subtituloPrincipal
// colocar os inputs data e hora

export default function NovaTarefa() {
    return (
        <ScrollView style={TabsStyles.container}>
            {/* Logo */}

            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />

                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Indentificação</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>de Máquinas</Text>
                </View>
            </View>

            {/* <KeyboardAvoidingView behavior="padding" style={styles.todosCard}> */}

            {/* Titulo e descrição */}
            <View style={styles.containerCard}>
                <View style={styles.card}>
                    <Text style={styles.titleCard}>Indentifique a máquina que deseja ter mais informações</Text>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={styles.label}>ID</Text>
                        <TextInput placeholder="Digite o id da máquina"
                            placeholderTextColor={'#8B8686'}
                            style={styles.input} />
                    </View>
                </View>
                {/* </KeyboardAvoidingView> */}

                <View style={{ alignItems: 'center'}}>
                    <View style={TabsStyles.viewBotaoPrincipal} >
                        <Text style={TabsStyles.botaoText}>Confirmar</Text>
                    </View>
                </View>

                 <View style={styles.card}>
                    <View>
                        <Text style={styles.qrCodeCard}> QRCodes gerados</Text>
                        <View style={styles.subCard}>
                            <Text>QRCode</Text>
                        </View>

                         <View>
                        <View style={styles.subCard}>
                            <Text>QRCode</Text>
                        </View>
                    </View>
                </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    containerCard: {
        gap: 30,
        // marginTop: 40
    },
    titleCard: {
         fontSize: 21,
        fontWeight: "500",
        color: "gray",
        marginBottom: 30,
        textAlign: "center",
    },
     qrCodeCard: {
         fontSize: 19,
        fontWeight: "500",
        color: "gray",
        marginBottom: 40,
        textAlign: "center",
    },
    card: {
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        backgroundColor: '#eeeeee',
        padding: 20,
        borderRadius: 10,
    },
    label: {
        fontSize: 12,
        textAlign: 'left',
        marginBottom: 8
    },
    tituloCard: {
        fontSize: 15,
        fontWeight: 600
    },
    input: {
        borderRadius: 10,
        backgroundColor: '#e6e6e6',
        padding: 10,
        textAlign: 'left'
    },

    subCard: {
        backgroundColor: "#fff",
        padding: 40,
        borderRadius: 10,
        marginBottom: 15
    },
})