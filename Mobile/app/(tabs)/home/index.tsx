import { Link } from "expo-router";
import { Bell, Calendar, ChartColumn, CheckCircle, Plus, User, Users } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TabsStyles } from "../../../styles/globalTabs";

// achar um icone de máquina para por no lugar de Nova Tarefa
// colocar função para que ao clicar no icone ativo, recarregue a página

export default function Home() {

  return (
    <ScrollView style={TabsStyles.container}>
      {/* Logo */}

      <TouchableOpacity style={styles.header}>
        <Link href={'/(tabs)/configuracao/editarPerfil'} style={{ alignItems: 'center', justifyContent: 'center' }}>

          <View style={{ flexDirection: 'row', gap: 10 }}>

            <View style={TabsStyles.userFotoIcon}>
              <User color={'#fff'} size={22} />
            </View>

            <View>
              <Text style={styles.tituloHeader}>Olá, Usuário</Text>
              <Text style={styles.subtitulo}>Bem-vindo de volta</Text>
            </View>
          </View>

          <Bell color={"#D6231C"} fill={"#D6231C"} size={20} style={{right: 2}} />
        </Link>
      </TouchableOpacity>

      {/* Ações rápidas */}
      <View>
        <Text style={styles.titulo}>Ações Rápidas</Text>

        <View style={styles.cardsAcoes} >

          {/* <Link href="/(tabs)/tarefas/novaTarefa" asChild> */}
          <TouchableOpacity style={styles.acaoCard}>
            <Plus color={"#CE221E"} size={40} style={styles.iconAcao} />
            <Text style={styles.tituloAcao}>Máquinas</Text>
          </TouchableOpacity>
          {/* </Link>  */}

          <Link href="/(tabs)/home/agenda" asChild>
            <TouchableOpacity style={styles.acaoCard}>
              <Calendar color={'#438BE9'} size={30} style={styles.iconAcao} />
              <Text style={styles.tituloAcao}>Agenda</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/(tabs)/home/equipes" asChild>
            <TouchableOpacity style={styles.acaoCard}>
              <Users color={'#11C463'} size={35} style={styles.iconAcao} />
              <Text style={styles.tituloAcao}>Equipes</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/(tabs)/home/dashboard" asChild>
            <TouchableOpacity style={styles.acaoCard}>
              <ChartColumn color={'#AC53F3'} size={35} style={styles.iconAcao} />
              <Text style={styles.tituloAcao}>Dashboard</Text>
            </TouchableOpacity>
          </Link>

        </View>

        <View style={styles.ativRecente}>
          <Text style={styles.titulo}>Atividades Recentes</Text>

          <View style={styles.ativRecenteCard}>

            <View style={styles.iconAtivRecente}>
              <CheckCircle color={'#51C385'} size={22} />
            </View>

            <View style={styles.ativInfo}>
              <Text style={styles.ativInfoTitulo}>Verificação da máquina</Text>
              <Text style={styles.ativInfoSubtitulo}>2h atrás</Text>
            </View>
          </View>
        </View>

      </View>

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
    width: '100%',
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
  ativRecenteCard: {
    flexDirection: 'row',
    boxShadow: '1px 5px 10px rgba(0, 0, 0, 0.25)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20
  },
  iconAtivRecente: {
    backgroundColor: '#C7FFDD',
    borderRadius: '50%',
    padding: 7,
  },
  ativInfo: {
    flexDirection: 'column',
    marginLeft: 10,
    gap: 4
  },
  ativInfoTitulo: {
    fontSize: 16
  },
  ativInfoSubtitulo: {
    color: '#848484',
    fontSize: 11
  }
})