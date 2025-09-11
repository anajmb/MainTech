import { Link } from "expo-router";
import { Bell, Calendar, ChartColumn, Plus, User, Users } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TabsStyles } from "../../styles/globalTabs";
import NovaTarefa from "../pages/novaTarefa";


export default function Home() {

  return (
    <ScrollView style={TabsStyles.container}>
      {/* Logo */}

      <TouchableOpacity style={styles.header}>

        <View style={{ flexDirection: 'row', gap: 10 }}>

          <View style={TabsStyles.userFotoIcon}>
            <User color={'#fff'} size={22} />
          </View>

          <View>
            <Text style={styles.tituloHeader}>Olá, Usuário</Text>
            <Text style={styles.subtitulo}>Bem-vindo de volta</Text>
          </View>
        </View>

        <Bell color={"#D6231C"} fill={"#D6231C"} size={20} />
      </TouchableOpacity>

      {/* Ações rápidas */}
      <View>
        <Text style={styles.titulo}>Ações Rápidas</Text>

        <View style={styles.cardsAcoes} >
          
          <TouchableOpacity style={styles.acaoCard} >
            <Plus color={"#CE221E"} size={40} style={styles.iconAcao} />
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

        </View>

        <View style={styles.ativRecente}>
          <Text style={styles.titulo}>Atividades Recentes</Text>
        </View>

      </View>

      <Link href="../auth/login">Go to Login</Link>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#eeeeee69",
    boxShadow: '1px 5px 10px rgba(0, 0, 0, 0.25)',
    padding: 18,
    margin: 9,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  tituloHeader: {
    fontSize: 16,
    fontWeight: 700
  },
  subtitulo: {
    color: '#676565'
  },
  titulo: {
    fontSize: 23,
    fontWeight: 600,
    textAlign: "left",
    marginTop: 40,
    marginBottom: 40
  },
  acaoCard: {
    backgroundColor: "#eeeeee69",
    boxShadow: '1px 5px 10px rgba(0, 0, 0, 0.25)',
    height: 130,
    width: 160,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    gap: 15
  },
  cardsAcoes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 30,
    justifyContent: "space-evenly",
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