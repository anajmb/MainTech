import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Calendar, IdCard, Mail, Phone, User } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function EditarPerfil() {
    return (
        <ScrollView style={TabsStyles.container}>
            {/* Logo */}

            <View style={styles.header}>
                <SetaVoltar />
                <Text style={TabsStyles.tituloPrincipal}>Editar Perfil</Text>
                <Text style={TabsStyles.subtituloPrincipal}>Atualize suas informações</Text>
            </View>

            <View style={styles.cardFoto}>
                <View>
                    {/* foto de perfil */}
                    <Text>Toque para editar a foto</Text>
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.formEditar}>

                    <View style={styles.opcaoForm}>
                        <User/>
                        <Text style={styles.label}>Nome completo</Text>
                        <TextInput style={styles.input}/>
                    </View>

                    <View style={styles.opcaoForm}>
                        <Mail/>
                        <Text style={styles.label}>E-mail</Text>
                        <TextInput style={styles.input}/>
                    </View>

                    <View style={styles.opcaoForm}>
                        <Phone/>
                        <Text style={styles.label}>Telefone</Text>
                        <TextInput style={styles.input}/>
                    </View>

                    <View style={styles.opcaoForm}>
                        <IdCard/>
                        <Text style={styles.label}>CPF</Text>
                        <TextInput style={styles.input}/>
                    </View>

                    <View style={styles.opcaoForm}>
                        <Calendar/>
                        <Text style={styles.label}>Data de nascimento</Text>
                        {/* input data */}
                    </View>

                </View>
            </View>

            <View style={styles.botao}>
                <Text>Salvar Alterações</Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    header: {

    },
    cardFoto: {

    },
    formEditar: {

    },
    card: {

    },
    opcaoForm: {

    },
    input: {

    },
    label: {

    },
    botao: {

    },
})