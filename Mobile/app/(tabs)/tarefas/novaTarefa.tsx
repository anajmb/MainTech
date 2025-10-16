import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Calendar, User } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface Tasks {
    id: number;
    title: string;
    inspectorId: number;
    machineId: number;
    status: string;
    expirationDate: string;
    updateDate: string;
}

export default function NovaTarefa() {

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [date, setDate] = useState<Date | null>(null);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [time, setTime] = useState<Date | null>(null);
    const today = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const handleConfirm = (selectedDate: Date) => {
        setDate(selectedDate);
        hideDatePicker();
    };

    const showTimePicker = () => setTimePickerVisibility(true);
    const hideTimePicker = () => setTimePickerVisibility(false);
    const handleConfirmTime = (selectedTime: Date) => {
        setTime(selectedTime);
        hideTimePicker();
    };

    let minimumTime: Date | undefined = undefined;
    let maximumTime: Date | undefined = undefined;


    if (date) {
        const now = new Date();


        maximumTime = new Date(date);
        maximumTime.setHours(22, 0, 0, 0);

        const isToday = date.toDateString() === now.toDateString();

        if (isToday) {
            const minimumTimeBasedOnNow = now;


            const minimumTimeBasedOnRule = new Date(date);
            minimumTimeBasedOnRule.setHours(7, 0, 0, 0);
            minimumTime = minimumTimeBasedOnNow > minimumTimeBasedOnRule ? minimumTimeBasedOnNow : minimumTimeBasedOnRule;

        } else {
            minimumTime = new Date(date);
            minimumTime.setHours(7, 0, 0, 0);
        }
    }

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [inspectorId, setInspectorId] = useState('');
    const [machines, setMachines] = useState('');

    const handleCreateTask = async () => {
  if (!title || !description || !inspectorId || !machines || !date) {
    alert("Por favor, preencha todos os campos obrigatórios!");
    return;
  }

  try {
    const expirationDate = date.toISOString(); // formato esperado pelo backend

    const response = await fetch("https://maintech-backend-r6yk.onrender.com/tasks/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,
        inspectorId: Number(inspectorId),
        machineId: Number(machines),
        expirationDate: expirationDate,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Erro ao criar tarefa:", errorData);
      alert("Erro ao criar tarefa!");
      return;
    }

    const data = await response.json();
    console.log("Tarefa criada com sucesso:", data);
    alert("Tarefa criada com sucesso!");
    
    // limpar os campos
    setTitle("");
    setDescription("");
    setInspectorId("");
    setMachines("");
    setDate(null);
    setTime(null);

  } catch (error) {
    console.error("Erro:", error);
    alert("Erro de conexão com o servidor!");
  }
};

    return (
        <ScrollView style={TabsStyles.container}>
            {/* Logo */}

            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />

                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Nova Tarefa</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>Nova Tarefa</Text>
                </View>
            </View>

            {/* <KeyboardAvoidingView behavior="padding" style={styles.todosCard}> */}

            {/* Titulo e descrição */}
            <View style={styles.todosCard}>
                <View style={styles.card}>

                    <View>
                        <Text style={styles.label}>Titulo</Text>
                        <TextInput placeholder="Digite o título da tarefa"
                            placeholderTextColor={'#8B8686'}
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle} />
                    </View>

                    <View>
                        <Text style={styles.label}>Descrição</Text>
                        <TextInput placeholder="Descreva os detalhes"
                            placeholderTextColor={'#8B8686'}
                            multiline={true}
                            numberOfLines={5}
                            style={styles.inputDescricao}
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    <View>
                        <Text style={styles.label}>Máquina</Text>
                        <TextInput placeholder="Digite o ID da máquina"
                            placeholderTextColor={'#8B8686'}
                            style={styles.inputDescricao}
                            value={machines}
                            onChangeText={setMachines}
                        />
                        {/* <DropDownPicker
                            open={open}
                            value={machinesSelecionada}
                            items={machines}
                            setOpen={setOpen}
                            setValue={setMachinesSelecionada}
                            setItems={setMachines}
                            placeholder="Selecione"
                            style={styles.inputSelecionar}
                            dropDownContainerStyle={{ backgroundColor: '#e6e6e6', borderRadius: 10, borderColor: '#e6e6e6' }}
                            placeholderStyle={{ color: '#6c6c6c' }}
                            textStyle={{ color: machinesSelecionada ? '#000' : '#6c6c6c' }}
                            disabledItemLabelStyle={{ color: '#6c6c6c' }}
                        /> */}
                    </View>
                </View>

                {/* Data e Hora */}
                <View style={styles.card}>

                    <View style={styles.groupTitulo}>
                        <Calendar size={20} color={'#5C5C5C'} strokeWidth={1.6} style={styles.iconCard} />
                        <Text style={styles.tituloCard}>Data e Hora</Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 100 }}>
                        <View style={styles.subtituloData}>
                            <Text style={styles.label}>Data de vencimento</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={showDatePicker}
                                activeOpacity={0.7}
                            >
                                <Text style={{ color: date ? "#000" : "#B9B9B9" }}>
                                    {date ? date.toLocaleDateString("pt-BR") : "DD/MM/AA"}
                                </Text>
                            </TouchableOpacity>

                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                                minimumDate={today}
                                maximumDate={sixMonthsFromNow}
                                locale="pt-BR"
                            />
                        </View>

                        <View style={styles.subtituloData}>
                            <Text style={styles.label}>Horário</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={showTimePicker}
                                activeOpacity={0.7}
                                disabled={!date}
                            >
                                <Text style={{ color: time ? "#000" : "#B9B9B9" }}>
                                    {time ? time.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }) : "HH:MM"}
                                </Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isTimePickerVisible}
                                mode="time"
                                onConfirm={handleConfirmTime}
                                onCancel={hideTimePicker}
                                locale="pt-BR"
                                is24Hour={true}
                                minimumDate={minimumTime}
                                maximumDate={maximumTime}

                            />
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.groupTitulo}>
                        <User size={22} color={'#5C5C5C'} strokeWidth={1.6} style={styles.iconCard} />
                        <Text style={styles.tituloCard}>Inspetor</Text>
                    </View>

                    <TextInput placeholder="Atribuir a..."
                        style={styles.inputDescricao}
                        placeholderTextColor={'#8B8686'}
                        value={inspectorId}
                        onChangeText={setInspectorId}
                    />
                </View>
                {/* </KeyboardAvoidingView> */}

                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        style={TabsStyles.viewBotaoPrincipal}
                        onPress={handleCreateTask}
                        activeOpacity={0.8}
                    >
                        <Text style={TabsStyles.botaoText}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    todosCard: {
        gap: 30,
        paddingBottom: 90,
        // marginTop: 40
    },
    card: {
         backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 15,
        color: "#222",
        marginBottom: 4,
        fontWeight: "400",
        marginTop: 10,
    },
    tituloCard: {
        fontSize: 15,
        fontWeight: 600
    },
    groupTitulo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    input: {
         backgroundColor: "#F5F5F5",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 8,
        fontSize: 14,
    },
    inputSelecionar: {
        borderRadius: 10,
        backgroundColor: '#e6e6e6',
        padding: 10,
        textAlign: 'left',
        borderColor: 'transparent',
    },
    inputDescricao: {
         backgroundColor: "#F5F5F5",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 8,
        fontSize: 14,
    },
    iconCard: {
        marginRight: 8
    },
    subtituloData: {
        // flexDirection: 'row'
    },
})