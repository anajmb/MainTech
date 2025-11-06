import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { useEffect, useState } from 'react';
import { Pencil, Trash2, Wrench } from "lucide-react-native";

interface Machines {
    id: number;
    name: string;
    location: string;
    qrCode: string
}

export default function Maquinas() {
    const [machines, setMachines] = useState<Machines[]>([]);
    const [oficinaSelecionada, setOficinaSelecionada] = useState("");
    const [open, setOpen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [conjuntoSelecionado, setConjuntoSelecionado] = useState("");
    const [openConjunto, setOpenConjunto] = useState(false);

    const [conjuntos, setConjuntos] = useState([
        { label: 'Selecione', value: '', disabled: true },
        { label: 'Conjunto 1', value: 'conjunto1' },
        { label: 'Conjunto 2', value: 'conjunto2' },
    ])

    const [oficinas, setOficinas] = useState([
        { label: 'Selecione', value: '', disabled: true },
        { label: 'Oficina de Manutenção', value: 'oficina1' },
        { label: 'Oficina de Usinagem', value: 'oficina2' },
        { label: 'Oficina de Soldagem', value: 'oficina3' },
        { label: 'Oficina Elétrica', value: 'oficina4' },
        { label: 'Oficina Mecânica', value: 'oficina5' },
        { label: 'Oficina Automotiva', value: 'oficina6' },
    ]);

    useEffect(() => {
        async function fetchMachines() {
            try {
                const response = await fetch('https://maintech-backend-r6yk.onrender.com/machines/get');
                const data = await response.json();
                setMachines(data);
            } catch (error) {
                console.error('Error fetching machines:', error);
            }
        }

        fetchMachines();
    }, []);

    return (
        <ScrollView style={TabsStyles.container}>
            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Cadastrar máquinas</Text>
                </View>
            </View>

            <View style={styles.todosCard}>
                <View style={styles.cardCad}>
                    <Text style={styles.tituloCard}>Informe os dados para cadastrar</Text>

                    <View style={{ marginBottom: 20, marginTop: 30 }}>
                        <Text style={styles.label}>Nome da Máquina:</Text>
                        <TextInput placeholder="Digite o nome da máquina" placeholderTextColor={"#6c6c6c"} style={styles.input} />
                    </View>

                    <View style={{ marginBottom: 20, marginTop: 10 }}>
                        <Text style={styles.label}>ID da Máquina:</Text>
                        <TextInput placeholder="_ _ _ _ _ _" placeholderTextColor={"#6c6c6c"} style={styles.input} />
                    </View>

                    <View style={{ marginBottom: 20, marginTop: 10 }}>
                        <Text style={styles.label}>Oficina:</Text>
                        <DropDownPicker
                            open={open}
                            value={oficinaSelecionada}
                            items={oficinas}
                            setOpen={setOpen}
                            setValue={setOficinaSelecionada}
                            setItems={setOficinas}
                            placeholder="Selecione"
                            style={styles.input}
                            dropDownContainerStyle={{ backgroundColor: '#e6e6e6', borderRadius: 10, borderColor: '#e6e6e6' }}
                            placeholderStyle={{ color: '#6c6c6c' }}
                            textStyle={{ color: oficinaSelecionada ? '#000' : '#6c6c6c' }}
                            disabledItemLabelStyle={{ color: '#6c6c6c' }}
                        />
                    </View>

                    <View style={{ marginBottom: 20, marginTop: 10 }}>
                        <Text style={styles.label}>Conjuntos:</Text>
                        <DropDownPicker
                            open={openConjunto}
                            value={conjuntoSelecionado}
                            items={conjuntos}
                            setOpen={setOpenConjunto}
                            setValue={setConjuntoSelecionado}
                            setItems={setConjuntos}
                            placeholder="Selecione"
                            style={styles.input}
                            dropDownContainerStyle={{ backgroundColor: '#e6e6e6', borderRadius: 10, borderColor: '#e6e6e6' }}
                            placeholderStyle={{ color: '#6c6c6c' }}
                            textStyle={{ color: conjuntoSelecionado ? '#000' : '#6c6c6c' }}
                            disabledItemLabelStyle={{ color: '#6c6c6c' }}
                        />
                    </View>

                    <TouchableOpacity style={styles.botaoCad}>
                        <Text style={{ color: '#fff' }}>Cadastrar Máquina</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.cardCad}>
                    <Text style={styles.tituloCard}>Máquinas Cadastradas</Text>

                    {machines.map((machine) => (
                        <View key={machine.id} style={styles.cardMaq}>
                            <View style={styles.leftIcon}>
                                <Wrench color="#1E9FCE" size={24} />
                            </View>

                            <View style={styles.cardContent}>
                                <Text style={styles.maqTitle}>{machine.name}</Text>
                                <Text style={styles.maqSubTitle}>Oficina Mecânica</Text>
                                <Text style={styles.maqId}>ID: {machine.id}</Text>
                            </View>

                            <View style={styles.editIcons}>
                                <TouchableOpacity>
                                    <Pencil size={18} color="#666" style={{ marginRight: 8 }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setModalVisible(true)}>
                                    <Trash2 size={18} color="#dc0606ff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <View style={{ backgroundColor: '#fff', padding: 40, borderRadius: 20, alignItems: 'center' }}>
                        <Text style={{ fontSize: 22 }}>Deseja realmente deletar?</Text>
                        <View style={{ flexDirection: 'row', marginTop: 24 }}>
                            <TouchableOpacity onPress={() => { setModalVisible(true); }}>
                                <Text style={{ color: 'red', marginRight: 16, fontSize: 18 }}>Deletar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={{ fontSize: 18 }}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    todosCard: {
        gap: 30,
        paddingBottom: 90,
    },
    cardCad: {
        backgroundColor: '#eeeeee',
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4
    },
    tituloCard: {
        fontSize: 20,
        textAlign: "center",
        color: "#6c6c6c",
        marginTop: 20
    },
    label: {
        fontSize: 13,
        textAlign: 'left',
        marginBottom: 12
    },
    input: {
        borderRadius: 10,
        backgroundColor: '#e6e6e6',
        padding: 10,
        borderColor: 'transparent',
    },
    botaoCad: {
        backgroundColor: "#A50702",
        color: "#fff",
        borderRadius: 10,
        paddingVertical: 12,
        width: "62%",
        marginTop: 10,
        marginBottom: 30,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center"
    },
    cardMaq: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    leftIcon: {
        marginRight: 12,
    },
    cardContent: {
        flex: 1,
    },
    maqTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#000",
    },
    maqSubTitle: {
        fontSize: 14,
        color: "#666",
        marginTop: 2,
    },
    maqId: {
        fontSize: 12,
        color: "#666",
        marginTop: 2,
    },
    editIcons: {
        flexDirection: "row",
        alignItems: "center",
    },
});