import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function NovaTarefa() {
    return (
        <ScrollView style={TabsStyles.container}>
            {/* Logo */}

            <View style={styles.header}>
                <SetaVoltar/>
                <Text style={styles.tituloHeader}>Nova Tarefa</Text>
            </View>

            {/* Titulo e descrição */}
            <View style={styles.card}>
                <Text style={styles.label}>Titulo</Text>
                <TextInput placeholder="Digite o título da tarefa" />

                <Text style={styles.label}>Descrição</Text>
                <TextInput placeholder="Descreva os detalhes da tarefa" />
            </View>

            {/* Data e Hora */}
            <View style={styles.card}>
                <Text style={styles.tituloCard}>Data e Hora</Text>

                <Text style={styles.label}>Data de vencimento</Text>
                {/* input de data */}

                <Text style={styles.label}>Horário</Text>
                {/* input de horário */}
            </View>

            <View style={styles.card}>
                <Text style={styles.tituloCard}>Prioridade</Text>

                <View>
                    <TouchableOpacity>
                        <Text>Baixa</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text>Media</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text>Alta</Text>
                    </TouchableOpacity>
                </View>

            </View>

            <View style={styles.card}>
                <Text style={styles.tituloCard}>Manutentor</Text>
                <TextInput placeholder="Atribuir a..." />
            </View>

            <View style={styles.botao}>
                <Text>Salvar</Text>
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
    label: {

    },
    tituloCard: {

    },
    botao: {

    },
})