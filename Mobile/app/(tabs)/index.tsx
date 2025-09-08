import { Link } from "expo-router";
import { Bell, Calendar, Plus, TrendingUp } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
            {/* Logo */}

            <View style={styles.header}>
                {/* foto de perfil */}
                <Text style={styles.tituloHeader}>Olá, Usuário</Text>
                <Text style={styles.subtitulo}>Bem-vindo de volta</Text>
                <Bell/>
            </View>

            {/* Ações rápidas */}
            <View>
              <Text style={styles.titulo}>Ações Rápidas</Text>

              <View style={styles.acaoCard}>
                <Plus/>
                <Text style={styles.tituloAcao}>Nova Tarefa</Text>
              </View>

              <View style={styles.acaoCard}>
                <Calendar/>
                <Text style={styles.tituloAcao}>Agenda</Text>
              </View>

              <View style={styles.acaoCard}>
                <Text style={styles.tituloAcao}>Equipes</Text>
              </View>

              <View style={styles.acaoCard}>
                <TrendingUp/>
                <Text style={styles.tituloAcao}>Dashboard</Text>
              </View>

              <View style={styles.ativRecente}>
                <Text style={styles.titulo}>Atividades Recentes</Text>
              </View>
            </View>

      <Link href="../auth/login">Go to Login</Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

  },
  header: {

  },
  tituloHeader: {

  },
  subtitulo: {

  },
  titulo: {

  },
  acaoCard: {

  },
  tituloAcao: {

  },
  ativRecente: {

  },
})