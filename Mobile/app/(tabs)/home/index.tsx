import { Link } from "expo-router";
import { Bell, BellOff, Calendar, ChartColumn, CheckCircle, Plus, User, Users, AlertTriangle, Grid2X2, Grid2X2Plus } from "lucide-react-native";
import { Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TabsStyles } from "../../../styles/globalTabs";
import { useCallback, useState } from "react";
import { CustomText } from "@/components/customText";
import NotificationDropdown from "@/components/notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "expo-router";


export default function Home() {
  const [isNotificacoesVisible, setNotificacoesVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

useFocusEffect(
  useCallback(() => {
    const loadPreference = async () => {
      const storedValue = await AsyncStorage.getItem('notificationsEnabled');
      setNotificationsEnabled(storedValue === 'true');
    };
    loadPreference();
  }, [])
);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    console.log("Recarregando dados da página Home...");
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


  return (
    <ScrollView
      style={TabsStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#CE221E"]} />
      }
    >

      <View>
        <View style={styles.header}>
          {/* <Link href={'/(tabs)/configuracao/editarPerfil'} style={{ alignItems: 'center', justifyContent: 'center', }}> */}

          <View style={{ flexDirection: 'row', gap: 10 }}>

              <Link href={"/configuracao"}>
            <TouchableOpacity style={TabsStyles.userFotoIcon}>
                <User color={'#fff'} size={22} />
            </TouchableOpacity>
              </Link>

            <View>
              <Text style={styles.tituloHeader}>Olá, Usuário</Text>
              <Text style={styles.subtitulo}>Bem-vindo de volta</Text>
            </View>
          </View>

          {notificationsEnabled ? (

            <TouchableOpacity onPress={() => setNotificacoesVisible(true)}>
            <Bell color={"#D6231C"} fill={"#D6231C"} size={23} style={{ right: 2 }} />
          </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => {}}>
            <BellOff color={"#D6231C"} fill={"#D6231C"} size={23} style={{ right: 2 }} />
          </TouchableOpacity>
          )}
          
          <NotificationDropdown 
          visible={isNotificacoesVisible} 
                onClose={() => setNotificacoesVisible(false)}
            />
        </View>
      </View>

      {/* Ações rápidas */}
      <View>
        <CustomText style={styles.titulo}>Ações Rápidas</CustomText>

        <View style={styles.cardsAcoes} >

          <Link href="/(tabs)/home/maquinas" asChild>
            <TouchableOpacity style={styles.acaoCard}>
              <Grid2X2Plus color={"#CE221E"} size={40} style={styles.iconAcao} />
              <Text style={styles.tituloAcao}>Máquinas</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/(tabs)/home/calendario" asChild>
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
      {/* <NotificacoesModal visible={isNotificacoesVisible} 
      onClose={() => setNotificacoesVisible(false)}/> */}

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
  dropdownContainer: {
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
  notificacaoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#c96d03ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    margin: 4
  },
  notificacaoContent: {
    flex: 1
  },
  itemTitle: {
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