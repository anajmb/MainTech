import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Calendar, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, LogBox } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from 'react-native-dropdown-picker';
import { api } from "../../../lib/axios";
import { Toast } from "toastify-react-native";

// Ignora avisos de listas aninhadas
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

export default function NovaTarefa() {

    // --- LÓGICA DE DATA E HORA ---
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [date, setDate] = useState<Date | null>(null);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [time, setTime] = useState<Date | null>(null);
    const today = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    const [erroMsg, setErroMsg] = useState("");

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

    // --- ESTADOS DO FORMULÁRIO ---
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // --- ESTADOS DO DROPDOWN ---
    const [openMachine, setOpenMachine] = useState(false);
    const [machineValue, setMachineValue] = useState(null);
    const [machineItems, setMachineItems] = useState<{ label: string, value: number }[]>([]);

    const [openInspector, setOpenInspector] = useState(false);
    const [inspectorValue, setInspectorValue] = useState(null);
    const [inspectorItems, setInspectorItems] = useState<{ label: string, value: number }[]>([]);

    const [loadingOptions, setLoadingOptions] = useState(true);

    // --- BUSCAR DADOS DA API ---
    useEffect(() => {
        async function loadOptions() {
            try {
                setLoadingOptions(true);
                const [machinesResp, employeesResp] = await Promise.all([
                    api.get('/machines/get'),
                    api.get('/employees/get')
                ]);

                const machinesData = machinesResp.data || [];
                const formattedMachines = machinesData.map((m: any) => ({
                    label: m.name,
                    value: m.id
                }));
                setMachineItems(formattedMachines);

                const employeesData = employeesResp.data || [];
                const inspectors = employeesData.filter((e: any) => !e.role || e.role === 'INSPECTOR' || e.role === 'Inspector');
                const formattedInspectors = inspectors.map((i: any) => ({
                    label: i.name,
                    value: i.id
                }));
                setInspectorItems(formattedInspectors);

            } catch (err) {
                console.error('Erro ao buscar opções:', err);
                setErroMsg('Não foi possível carregar as opções.');
            } finally {
                setLoadingOptions(false);
            }
        }
        loadOptions();
    }, []);

    const onOpenMachine = () => setOpenInspector(false);
    const onOpenInspector = () => setOpenMachine(false);

    const handleCreateTask = async () => {
        if (!title || !description || !inspectorValue || !machineValue || !date) {
            setErroMsg("Por favor, preencha todos os campos obrigatórios!");
            return;
        }

        try {
            const expirationDate = date.toISOString();
            const response = await api.post("/tasks/create", {
                title: title,
                description: description,
                inspectorId: Number(inspectorValue),
                machineId: Number(machineValue),
                expirationDate: expirationDate,
            });

            if (response.status !== 200 && response.status !== 201) {
                const errorMessage = response.data?.msg || "Erro ao criar tarefa.";
                Toast.error(errorMessage);
                return;
            }

            Toast.success("Tarefa criada com sucesso!");
            setTitle("");
            setDescription("");
            setInspectorValue(null);
            setMachineValue(null);
            setDate(null);
            setTime(null);

        } catch (error: any) {
            console.error("Erro:", error);
            Toast.error(error.response?.data?.msg || "Erro de conexão!");
        }
    };

    return (
        <ScrollView style={TabsStyles.container} nestedScrollEnabled={true}>
            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Nova Tarefa</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>Nova Tarefa</Text>
                </View>
            </View>

            <View style={TabsStyles.todosCard}>

                {/* --- CARD 1: DADOS BÁSICOS + MÁQUINA --- */}
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

                    {/* DROPDOWN MÁQUINA */}
                    <View>
                        <Text style={styles.label}>Máquina</Text>
                        {loadingOptions ? (
                            <ActivityIndicator color="#A50702" />
                        ) : (
                            <DropDownPicker
                                open={openMachine}
                                value={machineValue}
                                items={machineItems}
                                setOpen={setOpenMachine}
                                setValue={setMachineValue}
                                setItems={setMachineItems}
                                onOpen={onOpenMachine}
                                placeholder="Selecione"
                                listMode="SCROLLVIEW"
                                style={styles.input}
                                // Container da lista (a caixa que abre)
                                dropDownContainerStyle={{
                                    backgroundColor: '#e6e6e6',
                                    borderRadius: 10,
                                    borderColor: '#e6e6e6',
                                    position: 'relative', // Mantém dentro do card
                                    top: 0,
                                    marginTop: -2, // Puxa levemente pra cima pra colar no input
                                }}
                                // Estilo de cada item individual (para ficarem compactos e juntos)
                                listItemContainerStyle={{
                                    height: 40,
                                    borderBottomWidth: 0,
                                    margin: 0
                                }}
                                placeholderStyle={{ color: '#6c6c6c' }}
                                textStyle={{ color: machineValue ? '#000' : '#6c6c6c' }}
                                disabledItemLabelStyle={{ color: '#6c6c6c' }}
                            />
                        )}
                    </View>
                </View>

                {/* --- CARD 2: DATA E HORA --- */}
                <View style={styles.card}>
                    <View style={styles.groupTitulo}>
                        <Calendar size={20} color={'#5C5C5C'} strokeWidth={1.6} style={styles.iconCard} />
                        <Text style={styles.tituloCard}>Data e Hora</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={styles.subtituloData}>
                            <Text style={styles.label}>Data de vencimento</Text>
                            <TouchableOpacity style={styles.input} onPress={showDatePicker}>
                                <Text style={{ color: date ? "#000" : "#6c6c6c", marginTop: 2 }}>
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
                        <View style={styles.subtituloData2}>
                            <Text style={styles.label}>Horário</Text>
                            <TouchableOpacity style={styles.input} onPress={showTimePicker} disabled={!date}>
                                <Text style={{ color: time ? "#000" : "#6c6c6c", marginTop: 2 }}>
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

                {/* --- CARD 3: INSPETOR --- */}
                <View style={[styles.card, { marginBottom: 10 }]}>
                    <View style={styles.groupTitulo}>
                        <User size={22} color={'#5C5C5C'} strokeWidth={1.6} style={styles.iconCard} />
                        <Text style={styles.tituloCard}>Inspetor</Text>
                    </View>

                    {/* DROPDOWN INSPETOR */}
                    <View>
                        {loadingOptions ? (
                            <ActivityIndicator color="#A50702" />
                        ) : (
                            <DropDownPicker
                                open={openInspector}
                                value={inspectorValue}
                                items={inspectorItems}
                                setOpen={setOpenInspector}
                                setValue={setInspectorValue}
                                setItems={setInspectorItems}
                                onOpen={onOpenInspector}
                                placeholder="Atribuir a..."
                                listMode="SCROLLVIEW"
                                style={styles.input}
                                // Container da lista
                                dropDownContainerStyle={{
                                    backgroundColor: '#e6e6e6',
                                    borderRadius: 10,
                                    borderColor: '#e6e6e6',
                                    position: 'relative',
                                    top: 0,
                                    marginTop: -2
                                }}
                                // Estilo dos itens
                                listItemContainerStyle={{
                                    height: 40,
                                    borderBottomWidth: 0,
                                    margin: 0
                                }}
                                placeholderStyle={{ color: '#6c6c6c' }}
                                textStyle={{ color: inspectorValue ? '#000' : '#6c6c6c' }}
                                disabledItemLabelStyle={{ color: '#6c6c6c' }}
                            />
                        )}
                    </View>
                </View>

                {erroMsg !== "" && (
                    <View style={TabsStyles.erroMsg}>
                        <Text style={TabsStyles.erroMsgText}>{erroMsg}</Text>
                    </View>
                )}

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
        marginTop: 10,
        marginBottom: 50,
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
        elevation: 4,
        marginBottom: 10
    },
    label: {
        fontSize: 15,
        color: "#222",
        marginBottom: 10,
        fontWeight: "400",
        marginTop: 10,
    },
    tituloCard: {
        fontSize: 15,
        fontWeight: "600"
    },
    groupTitulo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    input: {
        borderRadius: 10,
        backgroundColor: '#e6e6e6',
        padding: 10,
        borderColor: '#e6e6e6',
        borderWidth: 1,
        marginBottom: 8,
        minHeight: 50,
        justifyContent: 'center'
    },
    inputDescreva: {
        backgroundColor: "#e6e6e6",
        borderRadius: 10,
        marginBottom: 8,
        fontSize: 14,
        textAlignVertical: "top",
        paddingHorizontal: 12,
        paddingVertical: 10,
        height: 80,
        borderColor: '#e6e6e6',
        borderWidth: 1,
    },
    iconCard: {
        marginRight: 8
    },
    subtituloData: {
        marginBottom: 8,
        marginRight: 20,
        width: 130,
        flex: 1
    },
    subtituloData2: {
        marginBottom: 8,
        marginRight: 20,
        width: 130,
        flex: 1
    }
})