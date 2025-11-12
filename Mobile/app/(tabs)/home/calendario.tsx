import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Calendar, LocaleConfig, DateObject } from "react-native-calendars";
import { api } from "../../../lib/axios";
import { useAuth } from "@/contexts/authContext";

LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro",
  ],
  monthNamesShort: [
    "jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez",
  ],
  dayNames: [
    "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado",
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

interface TaskItem {
  id: number;
  title: string;
  status: string;
  expirationDate: string;
  inspector?: { id: number; person?: { name: string } };
}

interface ServiceOrderItem {
  id: number;
  status: string;
  createdAt: string;
  inspectorId?: number;
  inspectorName?: string;
}

type CalendarItem = TaskItem | ServiceOrderItem;

export default function AgendaScreen() {
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState<CalendarItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      let data: CalendarItem[] = [];

      if (user?.role === "INSPECTOR") {
        const res = await api.get("/tasks/get");
        data = res.data.filter((task: TaskItem) => task.inspector?.id === user.id);
      } else if (user?.role === "MAINTAINER") {
        const res = await api.get("/serviceOrders/get");
        data = res.data.filter((os: ServiceOrderItem) => os.inspectorId === user.id);
      } else if (user?.role === "ADMIN") {
        const resTasks = await api.get("/tasks/get");
        const resOS = await api.get("/serviceOrders/get");
        data = [...resTasks.data, ...resOS.data];
      }

      // remover concluídas
      data = data.filter((item) =>
        ("status" in item ? item.status !== "COMPLETED" : true)
      );

      setItems(data);
      markDates(data, selectedDate);
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
    }
  };

  const markDates = (data: CalendarItem[], selected: string | null) => {
    const marks: any = {};

    data.forEach((item) => {
      let dateStr = "expirationDate" in item ? item.expirationDate : item.createdAt;
      if (!dateStr) return;

      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return;

      const isoDate = date.toISOString().split("T")[0];
      const isOverdue = new Date() > date;
      const isSelected = selected === isoDate;

      marks[isoDate] = {
        selected: isSelected,
        selectedColor: isOverdue ? "yellow" : "#d10b03",
        selectedTextColor: isOverdue ? "#000" : "#fff",
        // só marca o dot se NÃO estiver selecionado
        marked: !isSelected,
        dotColor: !isSelected ? (isOverdue ? "yellow" : "#fff") : undefined,
      };
    });

    setMarkedDates(marks);
  };


  const handleDayPress = (day: DateObject) => {
    setSelectedDate(day.dateString);

    const filtered = items.filter((item) => {
      const dateStr = "expirationDate" in item ? item.expirationDate : item.createdAt;
      if (!dateStr) return false;
      return new Date(dateStr).toISOString().split("T")[0] === day.dateString;
    });

    setFilteredItems(filtered);
    markDates(items, day.dateString); // atualizar cores
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
              todayTextColor: "#f7c6c6",
              dayTextColor: "#fff",
              arrowColor: "#fff",
              textDisabledColor: "#b36b6b",
            }}
            hideExtraDays
            markedDates={markedDates}
            onDayPress={handleDayPress}
          />
        </View>
      </View>

      <ScrollView style={styles.eventContainer}>
        <Text style={styles.sectionTitle}>Meus eventos</Text>

        {filteredItems.length === 0 ? (
          <Text style={{ color: "#777", textAlign: "center" }}>
            {selectedDate ? "Nenhum evento neste dia." : "Selecione uma data para ver os eventos."}
          </Text>
        ) : (
          filteredItems.map((item) => {
            const dateStr = "expirationDate" in item ? item.expirationDate : item.createdAt;
            const date = new Date(dateStr);
            const day = date.getDate();
            const month = date.toLocaleString("pt-BR", { month: "long" });

            let responsible = "Não informado";
            if ("inspector" in item && item.inspector?.person?.name) {
              responsible = item.inspector.person.name;
            } else if ("inspectorName" in item && item.inspectorName) {
              responsible = item.inspectorName;
            }

            return (
              <View key={item.id} style={styles.eventCard}>
                <View style={styles.eventDate}>
                  <Text style={styles.day}>{day}</Text>
                  <Text style={styles.month}>{month}</Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{"title" in item ? item.title : "Ordem de Serviço"}</Text>
                  <Text style={styles.eventSubtitle}>Responsável: {responsible}</Text>
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
  day: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  month: { fontSize: 12, color: "#fff" },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: 14, color: "#a50702", fontWeight: "600" },
  eventSubtitle: { fontSize: 12, color: "#888", marginTop: 4 },
  cardCalendar: {},
});
