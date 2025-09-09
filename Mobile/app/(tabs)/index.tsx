import { Link } from "expo-router";
import { Bell, Calendar, ChartColumn, Plus, TrendingUp, Users } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TabsStyles } from "../../styles/globalTabs";


export default function Home() {
  return (
    <ScrollView style={TabsStyles.container}>
      {/* Logo */}

      <View style={styles.header}>
        {/* foto de perfil */}
        <Text style={styles.tituloHeader}>Olá, Usuário</Text>
        <Text style={styles.subtitulo}>Bem-vindo de volta</Text>
        <Bell />
      </View>

      {/* Ações rápidas */}
      <View>
        <Text style={styles.titulo}>Ações Rápidas</Text>

        <View style={styles.cardsAcoes}>
          <TouchableOpacity style={styles.acaoCard}>
            <Plus color={"#CE221E"} size={40} style={styles.iconAcao}/>
            <Text style={styles.tituloAcao}>Nova Tarefa</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.acaoCard}>
            <Calendar color={'#438BE9'} size={30} style={styles.iconAcao} />
            <Text style={styles.tituloAcao}>Agenda</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.acaoCard}>
            <Users color={'#11C463'} size={35} style={styles.iconAcao} />
            <Text style={styles.tituloAcao}>Equipes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.acaoCard}>
            <ChartColumn color={'#AC53F3'} size={35} style={styles.iconAcao} />
            <Text style={styles.tituloAcao}>Dashboard</Text>
          </TouchableOpacity>

          <View style={styles.ativRecente}>
            <Text style={styles.titulo}>Atividades Recentes</Text>
          </View>
        </View>

      </View>

      <Link href="../auth/login">Go to Login</Link>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  header: {

  },
  tituloHeader: {

  },
  subtitulo: {

  },
  titulo: {
    fontSize: 22,
    fontWeight: 600,
    textAlign: "left",
  },
  acaoCard: {
    backgroundColor: "#eeeeee69",
    boxShadow: '1px 5px 10px rgba(0, 0, 0, 0.25)',
    height: 130,
    width: 165,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    gap: 15
  },
  cardsAcoes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 30,
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 4,
    paddingRight: 4
    // justifyContent: "space-between",
  },
  tituloAcao: {
    fontSize: 16,
    fontWeight: 400,
  },
  iconAcao: {
    
  },
  ativRecente: {

  },
})