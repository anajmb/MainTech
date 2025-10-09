import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Calendar } from "react-native-calendars";
import { LocaleConfig } from "react-native-calendars";

// interface AgendaCards {
//     id: number;
//     title: string;
//     expirationDate: string 
// }

LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ],
  dayNames: [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};

// Define o idioma padrão
LocaleConfig.defaultLocale = "pt-br";


export default function AgendaScreen() {

  return (
    <View style={styles.container}>
      {/* Calendário */}
      <View style={styles.calendarContainer}>
        <View style={styles.header}>
          <Image style={styles.logoImage} source={require("../../../assets/images/LogoBranca.png")} />

        </View>

        <View style={styles.cardCalendar}>

          <Calendar
            theme={{
              backgroundColor: "#a50702",
              calendarBackground: "#a50702",
              textSectionTitleColor: "#fff",
              monthTextColor: "#fff",
              textMonthFontWeight: "bold",
              textMonthFontSize: 18,
              selectedDayBackgroundColor: "#d10b03",
              selectedDayTextColor: "#fff",
              todayTextColor: "#f7c6c6",
              dayTextColor: "#fff",
              arrowColor: "#fff",
              textDisabledColor: "#b36b6b",
            }}
            hideExtraDays={true}
            markedDates={{
              "2025-03-09": { selected: true },
              "2025-03-18": { selected: true },
            }}
          />
        </View>
      </View>

      {/* Eventos */}
      <ScrollView style={styles.eventContainer}>
        <Text style={styles.sectionTitle}>Meus eventos</Text>

        <View style={styles.eventCard}>
          <View style={styles.eventDate}>
            <Text style={styles.day}>9</Text>
            <Text style={styles.month}>Março</Text>
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>Inspeção de Equipamento Elétrico</Text>
            <Text style={styles.eventSubtitle}>Prazo: 10/03/2025</Text>
          </View>
        </View>

        <View style={styles.eventCard}>
          <View style={styles.eventDate}>
            <Text style={styles.day}>18</Text>
            <Text style={styles.month}>Março</Text>
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>Manutenção Preventiva – Setor B</Text>
            <Text style={styles.eventSubtitle}>Responsável: Maria Souza</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoImage: {
    height: 150,
    width: 200,
    marginBottom: -50
  },
  calendarContainer: {
    marginBottom: 16,
    backgroundColor: "#a50702",
    borderRadius: 12,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    alignItems: "center",
    paddingVertical: 10,
  },
  logo: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  year: {
    color: "#fff",
    fontSize: 16,
    marginTop: 4,
  },
  eventContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    padding: 16,

  },
  sectionTitle: {
    fontSize: 16,
    color: "#999",
    marginBottom: 18,
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: "#fef2f2",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
  },
  eventDate: {
    width: 60,
    height: 60,
    backgroundColor: "#a50702",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  day: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  month: {
    fontSize: 12,
    color: "#fff",
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    color: "#a50702",
    fontWeight: "600",
  },
  eventSubtitle: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
  },
  centerButton: {
    backgroundColor: "#a50702",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -25,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  cardCalendar: {

  }
});
