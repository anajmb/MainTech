import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Calendar, LocaleConfig, DateObject } from "react-native-calendars";
import { api } from "../../../lib/axios";

LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
  ],
  monthNamesShort: [
    "jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"
  ],
  dayNames: [
    "Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"
  ],
  dayNamesShort: ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

interface Task {
  id: number;
  title: string;
  expirationDate: string;
  inspector?: { person?: { name: string } };
}

export default function AgendaScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks/get");
      const data = response.data;

      console.log("✅ Tarefas recebidas:", data);

      if (Array.isArray(data)) {
        setTasks(data);
        markTaskDates(data);
      } else {
        console.warn("⚠️ Resposta inesperada da API:", data);
      }
    } catch (error) {
      console.error("❌ Erro ao buscar tarefas:", error);
    }
  };

  const markTaskDates = (data: Task[]) => {
    const marks: any = {};

    data.forEach((task) => {
      if (!task.expirationDate) return;

      // Converte a data para o formato local YYYY-MM-DD (sem hora)
      const localDate = new Date(task.expirationDate);
      const dateString = localDate.toISOString().split("T")[0];

      marks[dateString] = {
        marked: true,
        dotColor: "red",
      };
    });

    console.log("📅 Datas marcadas:", marks);
    setMarkedDates(marks);
  };

  const handleDayPress = (day: DateObject) => {
    setSelectedDate(day.dateString);

    const filtered = tasks.filter((task) => {
      const localDate = new Date(task.expirationDate)
        .toISOString()
        .split("T")[0];
      return localDate === day.dateString;
    });

    console.log("📌 Tarefas do dia:", filtered);
    setFilteredTasks(filtered);
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <View style={styles.header}>
          <Image
            style={styles.logoImage}
            source={require("../../../assets/images/LogoBranca.png")}
          />
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
            hideExtraDays
            markedDates={{
              ...markedDates,
              ...(selectedDate
                ? { [selectedDate]: { selected: true, selectedColor: "#d10b03" } }
                : {}),
            }}
            onDayPress={handleDayPress}
          />
        </View>
      </View>

      <ScrollView style={styles.eventContainer}>
        <Text style={styles.sectionTitle}>Meus eventos</Text>

        {filteredTasks.length === 0 ? (
          <Text style={{ color: "#777", textAlign: "center" }}>
            {selectedDate
              ? "Nenhuma tarefa neste dia."
              : "Selecione uma data para ver as tarefas."}
          </Text>
        ) : (
          filteredTasks.map((task) => {
            const date = new Date(task.expirationDate);
            const day = date.getDate();
            const month = date.toLocaleString("pt-BR", { month: "long" });
            const responsible = task.inspector?.person?.name || "Não informado";

            return (
              <View key={task.id} style={styles.eventCard}>
                <View style={styles.eventDate}>
                  <Text style={styles.day}>{day}</Text>
                  <Text style={styles.month}>{month}</Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{task.title}</Text>
                  <Text style={styles.eventSubtitle}>
                    Responsável: {responsible}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  logoImage: { height: 150, width: 200, marginBottom: -50 },
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
  header: { alignItems: "center", paddingVertical: 10 },
  eventContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: { fontSize: 16, color: "#999", marginBottom: 18 },
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
  day: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  month: { fontSize: 12, color: "#fff" },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: 14, color: "#a50702", fontWeight: "600" },
  eventSubtitle: { fontSize: 12, color: "#888", marginTop: 4 },
  cardCalendar: {},
});
