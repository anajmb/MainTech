import { Link } from "expo-router";
import { Bell, Calendar, ChartColumn, CheckCircle, Plus, User, Users, AlertTriangle } from "lucide-react-native";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TabsStyles } from "../../../styles/globalTabs";
import { useState } from "react";

// achar um icone de máquina para por no lugar de Nova Tarefa
// colocar função para que ao clicar no icone ativo, recarregue a página

const mockNotificacoes = [
  { id: '1', title: 'Análise de O.S.', description: 'uma nova O.S. precisa ser analisada', time: '2h' },
  { id: '2', title: 'Manutenção Preventiva', description: 'uma manutenção preventiva foi concluída', time: '5h' },
];

interface NotificacoesModalProps {
  visible: boolean;
  onClose: () => void;
}

const NotificacoesModal: React.FC<NotificacoesModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      // animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownTitle}>Notificações</Text>
          {mockNotificacoes.map((notificacoes) => (
            <View key={notificacoes.id} style={styles.notificacaoItem}>
              <View style={styles.notificacaoIcon}>
                <AlertTriangle color="#fde4b6ff" size={20} />
              </View>
              <View style={styles.notificacaoContent}>
                <Text style={styles.itemTitle}>{notificacoes.title}</Text>
                <Text style={styles.itemDescription}>{notificacoes.description}</Text>
              </View>
              <Text style={styles.itemTime}>{notificacoes.time}</Text>
            </View>
          ))}
        </View>
      </Pressable>
    </Modal>
  )
}

export default function Home() {
  const [isNotificacoesVisible, setNotificacoesVisible] = useState(false);                            

  return (
    <ScrollView style={TabsStyles.container}>
      {/* Logo */}

      <View>
        <TouchableOpacity style={styles.header}>
          {/* <Link href={'/(tabs)/configuracao/editarPerfil'} style={{ alignItems: 'center', justifyContent: 'center', }}> */}

          <View style={{ flexDirection: 'row', gap: 10 }}>

            <View style={TabsStyles.userFotoIcon}>
              <User color={'#fff'} size={22} />
            </View>

            <View>
              <Text style={styles.tituloHeader}>Olá, Usuário</Text>
              <Text style={styles.subtitulo}>Bem-vindo de volta</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => setNotificacoesVisible(true)}>
            <Bell color={"#D6231C"} fill={"#D6231C"} size={20} style={{ right: 2 }} />
          </TouchableOpacity>
          {/* </Link> */}
        </TouchableOpacity>
      </View>

      {/* Ações rápidas */}
      <View>
        <Text style={styles.titulo}>Ações Rápidas</Text>

        <View style={styles.cardsAcoes} >

          <Link href="/(tabs)/home/maquinas" asChild>
            <TouchableOpacity style={styles.acaoCard}>
              <Plus color={"#CE221E"} size={40} style={styles.iconAcao} />
              <Text style={styles.tituloAcao}>Máquinas</Text>
            </TouchableOpacity>
          </Link>

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

      {/* Notificações Modal */}
      <NotificacoesModal visible={isNotificacoesVisible} 
      onClose={() => setNotificacoesVisible(false)}/>

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
    width: '95%',
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
  },

  // modal styles
  modalOverlay: {
    flex: 1,
    
  },
  dropdownContainer:{
    position: 'absolute',
    top: 125,     
    right: 35,    
    width: 300,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    alignSelf: 'center'
  },
  notificacaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0ff'
  },
  notificacaoIcon:{
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#c96d03ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    margin: 4
  },
  notificacaoContent:{
    flex: 1
  },
  itemTitle:{
     fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  itemDescription: {
     fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  itemTime: {
    fontSize: 12,
    color: '#aaa',
    margin: 4
  }

})