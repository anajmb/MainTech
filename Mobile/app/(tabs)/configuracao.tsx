import { BellRing, CircleQuestionMark, LogOut, PersonStanding, Shield, UserCircle } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Tarefas() {
    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.titulo}>Configuração</Text>
            </View>

            <TouchableOpacity style={styles.card}>
                {/* imagem de perfil */}
                <Text style={styles.nomePerfil}>João Silva</Text>
                <Text style={styles.emailPerfil}>joao.silva@email.com</Text>
            </TouchableOpacity>

            {/* Conta */}
            <View style={styles.bloco}>
                <Text style={styles.tituloCard}>Conta</Text>

                <View style={styles.card}>
                    <View style={styles.opcao}>
                        <UserCircle/>
                        <Text style={styles.tituloOpcao}>Perfil do Usuário</Text>
                        <Text style={styles.subtitulo}>Editar informações pessoais</Text>
                    </View>

                    <View style={styles.opcao}>
                        <Shield/>
                        <Text style={styles.tituloOpcao}>Privacidade e Segurança</Text>
                        <Text style={styles.subtitulo}>Gerenciar senha e autenticação</Text>
                    </View>
                </View>
            </View>

            {/* Preferências */}
            <View style={styles.bloco}>
                <Text style={styles.tituloCard}>Preferências</Text>

                <View style={styles.card}>
                    <View style={styles.opcao}>
                        <BellRing/>
                        <Text style={styles.tituloOpcao}>Notificações</Text>
                        <Text style={styles.subtitulo}>Controlar alertas e avisos</Text>
                    </View>

                    <View style={styles.opcao}>
                        <PersonStanding/>
                        <Text style={styles.tituloOpcao}>Acessibilidade</Text>
                    </View>
                </View>
            </View>

            {/* Suporte */}
            <View style={styles.bloco}>
                <Text style={styles.tituloCard}>Suporte</Text>

                <View style={styles.card}>
                    <View style={styles.opcao}>
                        <CircleQuestionMark/>
                        <Text style={styles.tituloOpcao}>Ajuda e suporte</Text>
                        <Text style={styles.subtitulo}>Central de ajuda e FAQ</Text>
                    </View>
                </View>
            </View>

            {/* Outros */}
            <View style={styles.bloco}>
                <Text style={styles.tituloCard}>Outros</Text>

                <View style={styles.card}>
                    <View style={styles.opcao}>
                        <LogOut/>
                        <Text style={styles.tituloOpcao}>Sair</Text>
                        <Text style={styles.subtitulo}>Desconectar da conta</Text>
                    </View>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    header: {

    },
    titulo: {

    },
    card: {

    },
    nomePerfil:{

    },
    emailPerfil:{

    },
    bloco: {

    },
    tituloCard: {

    },
    opcao: {

    },
    tituloOpcao: {

    },
    subtitulo: {
        
    },
})