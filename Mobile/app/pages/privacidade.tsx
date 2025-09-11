import { CircleArrowLeft, Lock, Shield, TriangleAlert } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function Privacidade() {
    return (
        <ScrollView style={styles.container}>

            <View style={styles.header}>
                <CircleArrowLeft />
                <Text style={styles.tituloHeader}>Privacidade e Segurança</Text>
            </View>

            <View style={styles.card}>

                <View>
                    <Shield/>
                    <Text style={styles.contaProtegida}>Conta Protegida</Text>
                    <Text style={styles.subtitulo}>Seu nível de segurança está alto</Text>
                </View>

                <View>
                    <View>
                        <Text style={styles.numero}>95%</Text>
                        <Text style={styles.subtitulo}>Segurança</Text>
                    </View>

                    <View>
                        <Text style={styles.numero}>2</Text>
                        <Text style={styles.subtitulo}>Fatores</Text>
                    </View>

                    <View>
                        <Text style={styles.numero}>24h</Text>
                        <Text style={styles.subtitulo}>Ativo</Text>
                    </View>
                </View>

            </View>

            <View style={styles.card}>
                <Lock/>
                <Text style={styles.tituloCard}>Alterar Senha</Text>

                <Text style={styles.label}>Senha atual</Text>
                <TextInput secureTextEntry style={styles.input} />

                <Text style={styles.label}>Nova Senha</Text>
                <TextInput secureTextEntry style={styles.input} />

                <Text style={styles.label}>Confirmação da Nova Senha</Text>
                <TextInput secureTextEntry style={styles.input} />
                {/* eye icon */}

                <Text style={styles.botao}>Alterar Senha</Text>
            </View>

            <View style={styles.card}>
                <TriangleAlert/>
                <Text style={styles.tituloCard}>Dicas de Segurança</Text>

                <Text style={styles.dicas}>Use senhas únicas e complexas;</Text>
                <Text style={styles.dicas}>Mantenha o aplicativo sempre atualizado;</Text>
                <Text style={styles.dicas}>Não compartilhe suas credenciais;</Text>
                <Text style={styles.dicas}>Faça logout em dispositivos desconhecidos.</Text>
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    header: {

    },
    tituloHeader: {

    },
    card: {

    },
    contaProtegida: {

    },
    subtitulo: {

    },
    numero: {

    },
    tituloCard: {

    },
    label: {

    },
    input: {

    },
    botao: {

    },
    dicas: {

    },
})