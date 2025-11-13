import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Tabs } from "expo-router";
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
            const expirationDate = date.toISOString();

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
            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Nova Tarefa</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>Nova Tarefa</Text>
                </View>
            </View>

            <View style={TabsStyles.todosCard}>
                <View style={styles.card}>
                    <View>
                        <Text style={styles.label}>Titulo</Text>
                        <TextInput placeholder="Digite o título da tarefa"
                            placeholderTextColor={'#6c6c6c'}
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle} />
                    </View>
                    <View>
                        <Text style={styles.label}>Descrição</Text>
                        <TextInput style={styles.inputDescreva}
                            placeholder="Descreva os detalhes"
                            placeholderTextColor="#6c6c6c"
                            multiline={true}
                            numberOfLines={8}
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>
                    <View>
                        <Text style={styles.label}>Máquina</Text>
                        <TextInput placeholder="Digite o ID da máquina"
                            placeholderTextColor={'#6c6c6c'}
                            style={styles.inputDescricao}
                            value={machines}
                            onChangeText={setMachines}
                        />
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.groupTitulo}>
                        <Calendar size={20} color={'#5C5C5C'} strokeWidth={1.6} style={styles.iconCard} />
                        <Text style={styles.tituloCard}>Data e Hora</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 49, marginLeft: 18 }}>
                        <View style={styles.subtituloData}>
                            <Text style={styles.label}>Data de vencimento</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={showDatePicker}
                                activeOpacity={0.7}
                            >
                                <Text style={{ color: date ? "#000" : "#8B8686" }}>
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
                                <Text style={{ color: time ? "#000" : "#8B8686" }}>
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

                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity style={styles.botaoSalvar} onPress={handleCreateTask} activeOpacity={0.8}>
                        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "400" }}>
                            Salvar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    botaoSalvar: {
        backgroundColor: "#A50702",
        color: "#fff",
        borderRadius: 10,
        paddingVertical: 12,
        width: "62%",
        marginTop: 25,
        marginBottom: 30,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center"
    },
    card: {
        backgroundColor: '#eeeeee',
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4
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
        backgroundColor: "#e6e6e6",
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
        backgroundColor: "#e6e6e6",
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
        marginTop: 8,
        marginBottom: 8,
        marginRight: 20,
    },
    inputDescreva: {
        backgroundColor: "#e6e6e6",
        borderRadius: 8,
        marginBottom: 8,
        fontSize: 14,
        textAlignVertical: "top",
        paddingHorizontal: 12,
        paddingVertical: 10,
        height: 65,
    }
})