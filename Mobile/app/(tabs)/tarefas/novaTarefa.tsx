import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Calendar, User } from "lucide-react-native";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

// editar o subtituloPrincipal

export default function NovaTarefa() {
    return (
        <ScrollView style={TabsStyles.container}>
            {/* Logo */}

            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />

                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Nova Tarefa</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>Nova Tarefa</Text>
                </View>
            </View>

            <KeyboardAvoidingView behavior="padding" style={styles.todosCard}>
                {/* Titulo e descrição */}
                <View style={styles.card}>

                    <View style={{ marginBottom: 20 }}>
                        <Text style={styles.label}>Titulo</Text>
                        <TextInput placeholder="Digite o título da tarefa"
                            placeholderTextColor={'#8B8686'}
                            style={styles.input} />
                    </View>

                    <View>
                        <Text style={styles.label}>Descrição</Text>
                        <TextInput placeholder="Descreva os detalhes"
                            placeholderTextColor={'#8B8686'}
                            multiline={true}
                            numberOfLines={5}
                            style={styles.inputDescricao}
                        />
                    </View>
                </View>

                {/* Data e Hora */}
                <View style={styles.card}>

                    <View style={styles.groupTitulo}>
                        <Calendar size={20} color={'#5C5C5C'} strokeWidth={1.6} style={styles.iconCard} />
                        <Text style={styles.tituloCard}>Data e Hora</Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 100 }}>
                        <View style={styles.subtituloData}>
                            <Text style={styles.label}>Data de vencimento</Text>
                            {/* input de data */}
                        </View>

                        <View style={styles.subtituloData}>
                            <Text style={styles.label}>Horário</Text>
                            {/* input de horário */}
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.groupTitulo}>
                        <User size={22} color={'#5C5C5C'} strokeWidth={1.6} style={styles.iconCard} />
                        <Text style={styles.tituloCard}>Manutentor</Text>
                    </View>

                    <TextInput placeholder="Atribuir a..."
                        style={styles.inputDescricao}
                        placeholderTextColor={'#8B8686'}
                    />
                </View>
            </KeyboardAvoidingView>

            <View style={{alignItems: 'center', marginTop: 30}}>
                <View style={styles.botao} >
                    <Text style={{ padding: 8, textAlign: 'center', color: '#fff' }}>Salvar</Text>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    todosCard: {
        gap: 25,
        marginTop: 40
    },
    card: {
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        backgroundColor: '#eeeeee',
        padding: 20,
        // borderRadius: 10,
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
    groupTitulo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    input: {
        borderRadius: 10,
        backgroundColor: '#e6e6e6',
        padding: 10,
        textAlign: 'left'
    },
    inputDescricao: {
        borderRadius: 10,
        backgroundColor: '#e6e6e6',
        padding: 10,
        textAlign: 'left',
    },
    iconCard: {
        marginRight: 8
    },
    subtituloData: {
        flexDirection: 'row'
    },
    botao: {
        backgroundColor: '#CE221E',
        borderRadius: 10,
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
})