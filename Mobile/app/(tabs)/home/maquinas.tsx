import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { useEffect, useState, useRef } from 'react';
import { Pencil, Trash2, Wrench } from "lucide-react-native";
import { api } from "../../../lib/axios";
import { SafeAreaView } from "react-native-safe-area-context";

interface Machines {
    id: number;
    name: string;
    description: string;
    location: string;
    qrCode: string
}

interface SetFromAPI {
    id: number;
    name: string;
}

export default function Maquinas() {
    const [machines, setMachines] = useState<Machines[]>([]);
    const [oficinaSelecionada, setOficinaSelecionada] = useState("");
    const [open, setOpen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    // edição
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedMachine, setSelectedMachine] = useState<Machines | null>(null);
    const [editName, setEditName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const editInputRef = useRef<TextInput | null>(null);

    // conjuntos
    const [conjuntoSelecionado, setConjuntoSelecionado] = useState<string[]>([]);
    const [openConjunto, setOpenConjunto] = useState(false);
    const [conjuntos, setConjuntos] = useState([
        { label: 'Carregando...', value: '', disabled: true },
    ]);

    // formulário novo
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const [oficinas, setOficinas] = useState([
        { key: "default", label: 'Selecione', value: '', disabled: true },
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
                const response = await api.get('/machines/get');
                setMachines(response.data);
            } catch (error) {
                console.error('Error fetching machines:', error);
            }
        }

        async function fetchSets() {
            try {
                const response = await api.get('/sets/get');
                const data: SetFromAPI[] = response.data;
                const formattedSets = data.map(set => ({
                    key: `set-${set.id}`,
                    label: set.name,
                    value: set.id.toString(),
                    disabled: false
                }));

                setConjuntos([
                    { key: 'default', label: 'Selecione', value: '', disabled: true },
                    ...formattedSets
                ]);

            } catch (error) {
                console.error('Error fetching sets:', error);
                setConjuntos([
                    { label: 'Falha ao carregar', value: '', disabled: true }
                ]);
            }
        }

        fetchMachines();
        fetchSets();
    }, [refreshKey]);

    // foco automático ao entrar em edição
    useEffect(() => {
        if (isEditing) {
            const t = setTimeout(() => {
                editInputRef.current?.focus();
            }, 50);
            return () => clearTimeout(t);
        }
    }, [isEditing]);

    function handleDelete() {
        console.log("Deletando...");
        setModalVisible(false);
    }

    function openEditModal(machine: Machines) {
        setSelectedMachine(machine);
        setEditName(machine.name);
        setIsEditing(true);
        setEditModalVisible(true);
    }

    async function handleEditDelete() {
        if (!selectedMachine) return;
        const id = selectedMachine.id;
        try {
            await api.delete(`/machines/delete/${id}`);
            setMachines(prev => prev.filter(m => m.id !== id));
        } catch (err) {
            console.warn('Delete API failed, atualizando localmente', err);
            setMachines(prev => prev.filter(m => m.id !== id));
        } finally {
            setEditModalVisible(false);
            setSelectedMachine(null);
            setRefreshKey(k => k + 1);
        }
    }
    async function handleSaveEdit() {
        if (!selectedMachine) return;

        // Garante que editName sempre é string antes de trim()
        const trimmed = (editName ?? "").trim();

        if (!trimmed) {
            Alert.alert('Erro', 'Nome não pode ficar vazio.');
            return;
        }

        const id = selectedMachine.id;

        try {
            const response = await api.put(`/machines/update/${id}`, {
                name: trimmed,
            });
            setMachines(prev =>
                prev.map(m =>
                    m.id === id ? { ...m, name: trimmed } : m
                )
            );

            Alert.alert('Sucesso', 'Máquina atualizada.');
        } catch (err: any) {
            console.error('Erro ao atualizar máquina:', err.response?.data || err.message);
            Alert.alert('Erro', 'Não foi possível atualizar a máquina.');
        } finally {
            setEditModalVisible(false);
            setSelectedMachine(null);
            setEditName("");
            setIsEditing(false);
        }
    }


    async function handleCadastro() {
        if (!nome.trim() || !descricao.trim() || !oficinaSelecionada || conjuntoSelecionado.length === 0) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        setLoadingSubmit(true);

        const oficinaLabel = oficinas.find(o => o.value === oficinaSelecionada)?.label;

        const payload = {
            name: nome,
            description: descricao,
            location: oficinaLabel,
            sets: conjuntoSelecionado.map(Number)
        };

        try {
            await api.post('/machines/create', payload);
            Alert.alert("Sucesso", "Máquina cadastrada com sucesso!");
            setNome("");
            setDescricao("");
            setOficinaSelecionada("");
            setConjuntoSelecionado([]);
            setRefreshKey(key => key + 1);
        } catch (error: any) {
            console.error("Erro ao cadastrar máquina:", error.response?.data || error.message);
            Alert.alert("Erro", "Não foi possível cadastrar a máquina.");
        } finally {
            setLoadingSubmit(false);
        }
    }

    return (
        // <SafeAreaView>

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
                        <TextInput
                            placeholder="Digite o nome da máquina"
                            placeholderTextColor={"#6c6c6c"}
                            style={styles.input}
                            value={nome}
                            onChangeText={setNome}
                        />
                    </View>

                    <View style={{ marginBottom: 20, marginTop: 10 }}>
                        <Text style={styles.label}>Descrição da Máquina:</Text>
                        <TextInput
                            placeholder="Escreva uma descrição para a máquina"
                            placeholderTextColor={"#6c6c6c"}
                            style={styles.input}
                            value={descricao}
                            onChangeText={setDescricao}
                        />
                    </View>

                    <View style={{ marginBottom: 20, marginTop: 10, zIndex: 2000 }}>
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
                            dropDownContainerStyle={{
                                backgroundColor: '#e6e6e6',
                                borderRadius: 10,
                                borderColor: '#e6e6e6',
                                maxHeight: 200
                            }}
                            placeholderStyle={{ color: '#6c6c6c' }}
                            textStyle={{ color: oficinaSelecionada ? '#000' : '#6c6c6c' }}
                            disabledItemLabelStyle={{ color: '#6c6c6c' }}
                            listMode="SCROLLVIEW"
                        />
                    </View>

                    <View style={{ marginBottom: 20, marginTop: 10, zIndex: 1000 }}>
                        <Text style={styles.label}>Conjuntos:</Text>
                        <DropDownPicker
                            open={openConjunto}
                            value={conjuntoSelecionado}
                            items={conjuntos}
                            setOpen={setOpenConjunto}
                            setValue={setConjuntoSelecionado}
                            setItems={setConjuntos}
                            multiple={true}
                            mode="BADGE"
                            placeholder="Selecione"
                            style={styles.input}
                            dropDownContainerStyle={{ backgroundColor: '#e6e6e6', borderRadius: 10, borderColor: '#e6e6e6' }}
                            placeholderStyle={{ color: '#6c6c6c' }}
                            textStyle={{ color: conjuntoSelecionado.length > 0 ? '#000' : '#6c6c6c' }}
                            disabledItemLabelStyle={{ color: '#6c6c6c' }}
                            listMode="SCROLLVIEW"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.botaoCad}
                        onPress={handleCadastro}
                        disabled={loadingSubmit}
                    >
                        <Text style={{ color: '#fff' }}>
                            {loadingSubmit ? "Cadastrando..." : "Cadastrar Máquina"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.cardCad}>
                    <Text style={[styles.tituloCard, styles.tituloCardCompact]}>Máquinas Cadastradas</Text>

                    {machines.map((machine) => (
                        <View key={`machine-${machine.id}`} style={styles.cardMaq}>
                            <View style={styles.leftIcon}>
                                <Wrench color="#1E9FCE" size={24} />
                            </View>

                            <View style={styles.cardContent}>
                                <Text style={styles.maqTitle}>{machine.name}</Text>
                                <Text style={styles.maqSubTitle}>{machine.location}</Text>
                                <Text style={styles.maqId}>ID: {machine.id}</Text>
                            </View>

                            <View style={styles.editIcons}>
                                <TouchableOpacity style={[styles.iconButton]} accessibilityLabel="Editar máquina" onPress={() => openEditModal(machine)}>
                                    <Pencil size={18} color="#666" style={{ marginRight: -12 }} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.iconButton, styles.iconDelete]} onPress={() => setModalVisible(true)} accessibilityLabel="Excluir máquina">
                                    <Trash2 size={18} color="#dc0606ff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Deseja realmente deletar?</Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.modalDeleteButton} onPress={handleDelete} accessibilityLabel="Deletar">
                                <Text style={styles.modalDeleteText}>Deletar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisible(false)} accessibilityLabel="Cancelar">
                                <Text style={styles.modalCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={editModalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Editar máquina</Text>

                        <TextInput
                            ref={editInputRef}
                            style={styles.modalEditInput}
                            value={editName}
                            onChangeText={setEditName}
                            placeholder="Novo nome"
                            placeholderTextColor="#6c6c6c"
                            onSubmitEditing={handleSaveEdit}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalSaveButton]}
                                onPress={handleSaveEdit}
                                accessibilityLabel="Salvar"
                                disabled={!editName.trim()}
                            >
                                <Text style={styles.modalSaveText}>Salvar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.modalCancelButton} onPress={() => { setEditModalVisible(false); setSelectedMachine(null); setIsEditing(false); setEditName(""); }} accessibilityLabel="Cancelar">
                                <Text style={styles.modalCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </ScrollView>

    );
}

const styles = StyleSheet.create({
    todosCard: {
        width: '90%',
        alignSelf: 'center',
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
        fontSize: 18,
        textAlign: "center",
        marginTop: 20,
        color: "#222",
        fontWeight: "500",
    },
    tituloCardCompact: {
        fontSize: 18,
        textAlign: "center",
        marginTop: 20,
        color: "#222",
        fontWeight: "500",
    },
    label: {
        fontSize: 15,
        color: "#222",
        marginBottom: 10,
        fontWeight: "400",
    },
    input: {
        borderRadius: 10,
        backgroundColor: '#e6e6e6',
        padding: 10,
        borderColor: '#e6e6e6',
        borderWidth: 1,
    },
    botaoCad: {
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
    cardMaq: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#eeeeee",
        borderRadius: 8,
        padding: 16,
        marginTop: 25,
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
    iconButton: {
        padding: 8,
        borderRadius: 8,
    },
    iconDelete: {
        marginLeft: 6,
    },

    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalBox: {
        backgroundColor: '#fff',
        padding: 28,
        borderRadius: 16,
        alignItems: 'center',
        width: '85%',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 18,
        color: '#000',
    },
    modalNameText: {
        fontSize: 18,
        color: '#000',
        marginBottom: 12,
    },
    modalEditInput: {
        width: '100%',
        borderRadius: 10,
        backgroundColor: '#f2f2f2',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderColor: '#e6e6e6',
        borderWidth: 1,
        marginBottom: 12,
        color: '#000'
    },
    modalActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12
    },
    modalDeleteButton: {
        backgroundColor: '#fdecea',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginRight: 12,
    },
    modalSecondaryButton: {},
    modalDeleteText: {
        color: '#dc0606ff',
        fontSize: 16,
        fontWeight: '600',
    },
    modalSaveButton: {
        backgroundColor: '#e6f7ee',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginRight: 12,
    },
    modalSaveText: {
        color: '#077a3a',
        fontSize: 16,
        fontWeight: '600',
    },
    modalCancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginLeft: 8
    },
    modalCancelText: {
        color: '#333333',
        fontSize: 16,
        fontWeight: '600',
    },
});