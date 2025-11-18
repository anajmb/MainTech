import SetaVoltar from "@/components/setaVoltar";
import { api } from "@/lib/axios";
import { TabsStyles } from "@/styles/globalTabs";
import { Link } from "expo-router";
import { Users, Wrench } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';

export interface Team {
    id: number;
    name: string;
    description: string;
    members: any[];
}

export default function CriarEquipe() {
    // Dados da Lista
    const [teamData, setTeamData] = useState<Team[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);
    
    // --- NOVO: Lista de IDs de funcionários que já estão em equipes ---
    const [idsOcupados, setIdsOcupados] = useState<number[]>([]);

    // Dados do Formulário
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    // Configuração do Dropdown (Membros)
    const [openMembros, setOpenMembros] = useState(false);
    const [membrosSelecionados, setMembrosSelecionados] = useState<number[]>([]);
    const [funcionarios, setFuncionarios] = useState([
        { label: 'Carregando...', value: -1, disabled: true },
    ]);

    // 1. Busca as Equipes e CALCULA quem já está ocupado
    useEffect(() => {
        async function fetchTeams() {
            try {
                const res = await api.get('/team/get'); 
                const equipes: Team[] = res.data;
                setTeamData(equipes);

                // --- LÓGICA DE FILTRO ---
                // Extrai o ID de cada membro de todas as equipes
                const idsEmUso: number[] = [];
                equipes.forEach(equipe => {
                    if (equipe.members) {
                        equipe.members.forEach((membro: any) => {
                            // 'personId' é o campo que liga o membro ao funcionário no Prisma
                            if (membro.personId) idsEmUso.push(membro.personId);
                        });
                    }
                });
                setIdsOcupados(idsEmUso);

            } catch (error) {
                console.log("Erro ao buscar equipes:", error);
            }
        }
        fetchTeams();
    }, [refreshKey]);

    // 2. Busca os Funcionários e FILTRA os disponíveis
    useEffect(() => {
        async function fetchEmployees() {
            try {
                const res = await api.get('/employees/get');
                const todosFuncionarios = res.data;

                // --- LÓGICA DE FILTRO ---
                // Mantém apenas quem NÃO está na lista de IDs ocupados
                const disponiveis = todosFuncionarios.filter((emp: any) => !idsOcupados.includes(emp.id));

                const formatted = disponiveis.map((emp: any) => ({
                    label: emp.name,
                    value: emp.id
                }));

                // Se não houver ninguém disponível, mostra aviso no dropdown
                if (formatted.length === 0) {
                    setFuncionarios([{ label: 'Nenhum funcionário disponível', value: -1, disabled: true }]);
                } else {
                    setFuncionarios(formatted);
                }

            } catch (error) {
                console.log("Erro ao buscar funcionários:", error);
                setFuncionarios([{ label: 'Erro ao carregar', value: -1, disabled: true }]);
            }
        }
        // Executa sempre que a lista de ocupados mudar (ou seja, quando as equipes carregarem)
        fetchEmployees();
    }, [idsOcupados]); 

    // 3. Função para Criar a Equipe
    async function handleCriarEquipe() {
        if (!nome.trim() || !descricao.trim() || membrosSelecionados.length === 0) {
            Alert.alert("Erro", "Por favor, preencha todos os campos e selecione ao menos um membro.");
            return;
        }

        setLoadingSubmit(true);

        const payload = {
            name: nome,
            description: descricao,
            members: membrosSelecionados 
        };

        try {
            await api.post('/team/create', payload); 
            Alert.alert("Sucesso", "Equipe criada com sucesso!");
            
            // Limpar campos
            setNome("");
            setDescricao("");
            setMembrosSelecionados([]);
            
            // Atualizar a lista (isso vai recalcular os ocupados automaticamente)
            setRefreshKey(prev => prev + 1);

        } catch (error: any) {
            console.error("Erro ao criar equipe:", error.response?.data || error.message);
            Alert.alert("Erro", "Não foi possível criar a equipe.");
        } finally {
            setLoadingSubmit(false);
        }
    }

    return (
        <ScrollView style={TabsStyles.container} nestedScrollEnabled={true}>
            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Criar Equipe</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>Informe os dados da equipe</Text>
                </View>
            </View>

            {/* Card de cadastro */}
            <View style={style.cardCriarEquipe}>
                <Text style={style.tituloCardCriarEquipe}>Informe os dados para criar uma equipe</Text>
                
                <Text style={style.label}>Nome da Equipe</Text>
                <TextInput
                    style={style.input}
                    placeholder="Nome da Equipe"
                    placeholderTextColor="#8B8686"
                    value={nome}
                    onChangeText={setNome}
                />

                <Text style={style.labelDescrição}>Descrição</Text>
                <TextInput
                    style={style.inputDescrição}
                    placeholder="Descreva os detalhes"
                    placeholderTextColor="#8B8686"
                    multiline={true}
                    numberOfLines={4}
                    value={descricao}
                    onChangeText={setDescricao}
                />

                {/* Dropdown de Membros */}
                <View style={{ marginBottom: 10, marginTop: 5, zIndex: 2000 }}>
                    <Text style={style.label}>Membros (Disponíveis)</Text>
                    <DropDownPicker
                        open={openMembros}
                        value={membrosSelecionados}
                        items={funcionarios}
                        setOpen={setOpenMembros}
                        setValue={setMembrosSelecionados}
                        setItems={setFuncionarios}
                        multiple={true}
                        mode="BADGE"
                        placeholder="Selecione os membros"
                        style={style.input}
                        dropDownContainerStyle={{ backgroundColor: '#e6e6e6', borderColor: '#e6e6e6' }}
                        placeholderStyle={{ color: '#8B8686' }}
                        textStyle={{ color: '#222' }}
                        listMode="SCROLLVIEW"
                        zIndex={3000}
                        zIndexInverse={1000}
                        ListEmptyComponent={() => (
                            <Text style={{padding: 10, color: '#666', textAlign: 'center'}}>
                                Todos os funcionários já estão em equipes.
                            </Text>
                        )}
                    />
                </View>

                <TouchableOpacity 
                    style={style.botaoCriarEquipe} 
                    onPress={handleCriarEquipe}
                    disabled={loadingSubmit}
                >
                    {loadingSubmit ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={style.textoBotaoCriarEquipe}>Criar Equipe</Text>
                    )}
                </TouchableOpacity>
            </View>

            
            {/* Lista de Equipes Cadastradas */}
            <View style={[style.cardEquipesCadastradas, { zIndex: -1 }]}>
                <Text style={style.tituloCadastradas}>Equipes cadastradas</Text>

                {teamData.map((team) => (
                    <View key={team.id} style={style.card}>
                        <View style={style.groupEqui}>
                            <View style={style.iconeEquipe}>
                                <Users color="white" size={24} />
                            </View>
                            <View style={style.infoEqui}>
                                <Text style={style.tituloEqui}>{team.name}</Text>
                                <Text style={style.descricaoEqui}>{team.description}</Text>
                            </View>
                        </View>

                        <View style={style.footerCard}>
                             <TouchableOpacity>
                                <Link href={`/home/verEquipe?teamId=${team.id}`} asChild>
                                    <TouchableOpacity>
                                        <Text style={style.verEquipe}>Ver equipe</Text>
                                    </TouchableOpacity>
                                </Link>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                
                {teamData.length === 0 && (
                    <Text style={{textAlign: 'center', color: '#888', marginTop: 10}}>
                        Nenhuma equipe cadastrada.
                    </Text>
                )}
            </View>

        </ScrollView>
    )
}

const style = StyleSheet.create({
    tituloHeader: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#222",
        left: 10,
    },
    cardCriarEquipe: {
        backgroundColor: "#eeeeee",
        borderRadius: 10,
        marginVertical: 12,
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        padding: 20,
        elevation: 4,
        zIndex: 2000 
    },
    tituloCardCriarEquipe: {
        fontSize: 18,
        fontWeight: "500",
        color: "#222",
        marginBottom: 25,
        textAlign: "center"
    },
    label: {
        fontSize: 15,
        color: "#222",
        marginBottom: 4,
        fontWeight: "400",
    },
    input: {
        backgroundColor: "#e6e6e6",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 8,
        fontSize: 14,
        borderWidth: 0, 
    },
    labelDescrição: {
        fontSize: 15,
        color: "#222",
        marginBottom: 4,
        fontWeight: "400",
    },
    inputDescrição: {
        backgroundColor: "#e6e6e6",
        borderRadius: 8,
        marginBottom: 8,
        fontSize: 14,
        textAlignVertical: "top",
        paddingHorizontal: 12,
        paddingVertical: 10,
        height: 95,
    },
    botaoCriarEquipe: {
        backgroundColor: "#A50702",
        color: "#fff",
        borderRadius: 10,
        paddingVertical: 12,
        width: "62%",
        marginTop: 25,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center"
    },
    textoBotaoCriarEquipe: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "400",
    },
    cardEquipesCadastradas: {
        backgroundColor: "#eeeeee",
        borderRadius: 10,
        
        marginVertical: 12,
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        padding: 20,
        elevation: 4, 
        zIndex: -1,
    },
    tituloCadastradas: {
        fontSize: 17,
        color: "#000000",
        fontWeight: "500",
        marginBottom: 12,
        textAlign: "center",
        marginTop: -5,
    },
    card: {
        backgroundColor: "#eeeeee",
        borderRadius: 10,
        marginVertical: 12,
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        padding: 20,
        elevation: 4
    },
    groupEqui: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    infoEqui: {
        flex: 1,
    },
    tituloEqui: {
        fontSize: 16,
        color: "#000000",
        marginBottom: 2,
        fontWeight: "500",
    },
    descricaoEqui: {
        fontSize: 15,
        color: "#8B8686",
        marginBottom: 8,
        fontWeight: "400",
        marginTop: 10,
    },
    verEquipe: {
        fontSize: 13,
        marginTop: 4,
        color: "#CE221E",
        marginRight: 12,
        fontWeight: "500",
    },
    footerCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        marginTop: 12,
    },
    iconeEquipe: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: "#1E9FCE",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
});