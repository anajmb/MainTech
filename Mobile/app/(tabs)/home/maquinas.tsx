import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { useEffect, useState } from 'react';
import { Pencil, Trash2, Wrench } from "lucide-react-native";
import { api } from "../../../lib/axios"; // É uma boa prática usar a instância do Axios se você a tiver

interface Machines {
    id: number;
    name: string;
    location: string;
    qrCode: string
}

// Interface para os dados vindos da API /sets/get
interface SetFromAPI {
    id: number;
    name: string;
}

export default function Maquinas() {
    const [machines, setMachines] = useState<Machines[]>([]);
    const [oficinaSelecionada, setOficinaSelecionada] = useState("");
    const [open, setOpen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    
    // --- MODIFICADO ---
    // 1. O estado agora é um array de strings (para IDs) para permitir múltipla seleção
    const [conjuntoSelecionado, setConjuntoSelecionado] = useState<string[]>([]);
    const [openConjunto, setOpenConjunto] = useState(false);

    // 2. O estado inicial agora é 'Carregando...'
    const [conjuntos, setConjuntos] = useState([
        { label: 'Carregando...', value: '', disabled: true },
    ]);
    // --- FIM DA MODIFICAÇÃO ---
    
    // --- NOVOS ESTADOS PARA O FORMULÁRIO ---
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // Para atualizar a lista
    // --- FIM DOS NOVOS ESTADOS ---

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
                // Usando a instância 'api' se ela estiver configurada com a baseURL
                const response = await api.get('/machines/get');
                setMachines(response.data);
            } catch (error) {
                console.error('Error fetching machines:', error);
            }
        }

        // --- NOVO ---
        // 3. Função para buscar os conjuntos (sets)
        async function fetchSets() {
            try {
                const response = await api.get('/sets/get');
                const data: SetFromAPI[] = response.data; // Tipamos a resposta

                // 4. Transformamos os dados da API (ex: {id: 1, name: 'Conjunto 1'})
                //    para o formato do DropDownPicker (ex: {label: 'Conjunto 1', value: '1'})
                const formattedSets = data.map(set => ({
                    label: set.name,
                    value: set.id.toString() // Convertemos o ID para string
                }));

                // 5. Atualizamos o estado dos conjuntos
                setConjuntos([
                    { label: 'Selecione', value: '', disabled: true },
                    ...formattedSets
                ]);

            } catch (error) {
                console.error('Error fetching sets:', error);
                setConjuntos([
                    { label: 'Falha ao carregar', value: '', disabled: true }
                ]);
            }
        }
        // --- FIM DO NOVO ---

        fetchMachines();
        fetchSets(); // 6. Chamamos a nova função
    }, [refreshKey]); // <-- MODIFICADO: Adiciona refreshKey para recarregar a lista

    // --- CORREÇÃO DE BUG ---
    // Lógica para o botão de deletar no modal
    function handleDelete() {
        // Coloque sua lógica de API delete aqui
        console.log("Deletando...");
        setModalVisible(false); // Fecha o modal após a ação
    }

    // --- NOVA FUNÇÃO PARA CADASTRAR A MÁQUINA ---
    async function handleCadastro() {
        // 1. Validação
        if (!nome.trim() || !descricao.trim() || !oficinaSelecionada || conjuntoSelecionado.length === 0) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        setLoadingSubmit(true);

        // 2. Encontra o 'label' da oficina (ex: "Oficina de Manutenção")
        const oficinaLabel = oficinas.find(o => o.value === oficinaSelecionada)?.label;

        // 3. Montar Payload
        const payload = {
            name: nome,
            description: descricao,
            location: oficinaLabel, // Envia o nome da oficina
            sets: conjuntoSelecionado.map(Number) // Converte o array de strings (IDs) para números
        };

        console.log("Enviando cadastro de máquina:", payload);

        // 4. Chamar API
        try {
            await api.post('/machines/create', payload);
            Alert.alert("Sucesso", "Máquina cadastrada com sucesso!");

            // 5. Limpar formulário e recarregar lista
            setNome("");
            setDescricao("");
            setOficinaSelecionada("");
            setConjuntoSelecionado([]);
            setRefreshKey(key => key + 1); // Dispara o useEffect para recarregar

        } catch (error: any) {
            console.error("Erro ao cadastrar máquina:", error.response?.data || error.message);
            Alert.alert("Erro", "Não foi possível cadastrar a máquina.");
        } finally {
            setLoadingSubmit(false);
        }
    }
    // --- FIM DA NOVA FUNÇÃO ---

    return (
        <ScrollView style={TabsStyles.container}>

            {/* Header */}
            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Cadastrar máquinas</Text>
                </View>
            </View>

            <View style={styles.todosCard}>
                <View style={styles.cardCad}>
                    <Text style={styles.tituloCard}>Informe os dados para cadastrar</Text>

                    {/* Input Nome */}
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

                    {/* Input Descrição */}
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

                    {/* Dropdown Oficina */}
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
                            listMode="SCROLLVIEW" // Adicionado para melhor performance
                        />
                    </View>

                    {/* Dropdown Conjuntos */}
                    <View style={{ marginBottom: 20, marginTop: 10, zIndex: 1000 }}>
                        <Text style={styles.label}>Conjuntos:</Text>
                        <DropDownPicker
                            open={openConjunto}
                            value={conjuntoSelecionado} // Agora é um array: ['1', '2']
                            items={conjuntos}
                            setOpen={setOpenConjunto}
                            setValue={setConjuntoSelecionado}
                            setItems={setConjuntos}
                            
                            multiple={true} // Permite selecionar múltiplos
                            mode="BADGE" // Mostra os itens selecionados como "badges"
                            
                            placeholder="Selecione"
                            style={styles.input}
                            dropDownContainerStyle={{ backgroundColor: '#e6e6e6', borderRadius: 10, borderColor: '#e6e6e6' }}
                            placeholderStyle={{ color: '#6c6c6c' }}
                            textStyle={{ color: conjuntoSelecionado.length > 0 ? '#000' : '#6c6c6c' }}
                            disabledItemLabelStyle={{ color: '#6c6c6c' }}
                            listMode="SCROLLVIEW" // Adicionado para melhor performance
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

                {/* Máquinas cadastradas */}
                <View style={styles.cardCad}>
                    <Text style={styles.tituloCard}>Máquinas Cadastradas</Text>

                    {machines.map((machine) => (
                        <View key={machine.id} style={styles.cardMaq}>
                            <View style={styles.leftIcon}>
                                <Wrench color="#1E9FCE" size={24} />
                            </View>

                            <View style={styles.cardContent}>
                                <Text style={styles.maqTitle}>{machine.name}</Text>
                                <Text style={styles.maqSubTitle}>{machine.location}</Text>
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

            {/* Modal de Confirmação (com bug corrigido) */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <View style={{ backgroundColor: '#fff', padding: 40, borderRadius: 20, alignItems: 'center' }}>
                        <Text style={{ fontSize: 22 }}>Deseja realmente deletar?</Text>
                        <View style={{ flexDirection: 'row', marginTop: 24 }}>
                            
                            <TouchableOpacity onPress={handleDelete}>
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
        width: '90%', // Adicionado para centralizar
        alignSelf: 'center', // Adicionado para centralizar
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
        borderColor: '#e6e6e6', // Garante que a borda tenha a mesma cor
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