import SetaVoltar from "@/components/setaVoltar";
import { api } from "@/lib/axios";
import { TabsStyles } from "@/styles/globalTabs";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export interface Employees {
    id: number;
    name: string;
    cpf: string;

    email: string;
    phone: string;
    birthDate: string;
    role: 'INSPECTOR' | 'MAINTAINER';
    createDate: string;
    updateDate: string;
}

type Role = 'INSPECTOR' | 'MAINTAINER' | 'ADMIN' | string;

export const formatRole = (role: Role): string => {
    switch (role) {
        case 'INSPECTOR':
            return 'Inspetor';
        case 'MAINTAINER':
            return 'Manutentor';
        case 'ADMIN':
            return 'Administrador';
        default:
            return role || 'Desconhecido';
    }
};

const getInitials = (name: string): string => {
    if (!name) return '?';
    const names = name.split(' ').filter(Boolean);
    if (names.length === 0) return '?';

    const firstInitial = names[0][0];
    const lastInitial = names.length > 1 ? names[names.length - 1][0] : '';

    return `${firstInitial}${lastInitial}`.toUpperCase();
};






export default function CadastrarUsuario() {
    const [employeesData, setEmployeesData] = useState<Employees[]>([]);
    const [cpfData, setCpfData] = useState("");
    const [name, setName] = useState("");
    const [cargo, setCargo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [openCargo, setOpenCargo] = useState(false);
    const [cargos, setCargos] = useState([
        { label: 'Inspetor', value: 'INSPECTOR' },
        { label: 'Manutentor', value: 'MAINTAINER' },
    ]);

    async function fetchEmployees() {
        try {
            const res = await api.get('/employees/get');
            setEmployeesData(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handlePreRegister = async () => {
        if (!name || !cpfData || !cargo) {
            alert("Preencha todos os campos!");
            return;
        }
        setIsLoading(true);
        try {
            await api.post('/employees/preRegister', {
                name: name,
                cpf: cpfData,
                role: cargo,
            });
            alert("Usuário pré-cadastrado com sucesso!");
            setName('');
            setCpfData('');
            setCargo('');
            fetchEmployees();
        } catch (error: any) {
            if (error.response?.data?.msg) {
                alert(error.response.data.msg);
            } else {
                alert("Erro ao cadastrar usuário.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={TabsStyles.container}>
            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Cadastrar Usuário</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>Cadastre</Text>
                </View>
            </View>

            {/* Card de cadastro */}
            <View style={style.cardCadastro}>
                <Text style={style.tituloCardCadastro}>Informe os dados para liberar o cadastro</Text>
                <View>
                    <Text style={style.label}>Nome  Completo</Text>
                    <TextInput
                        style={style.input}
                        placeholder="Nome do Usuário"
                        placeholderTextColor="#8B8686"
                        value={name}
                        onChangeText={setName}
                    />
                </View>
                <View style={{ marginTop: 8 }}>
                    <Text style={style.label}>CPF</Text>
                    <TextInput
                        style={style.input}
                        placeholder="Digite o CPF"
                        placeholderTextColor="#8B8686"
                        value={cpfData}
                        onChangeText={setCpfData}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={style.labelCargo}>Cargo</Text>
                    <DropDownPicker
                        open={openCargo}
                        value={cargo}
                        items={cargos}
                        setOpen={setOpenCargo}
                        setValue={setCargo}
                        setItems={setCargos}
                        placeholder="Selecione"
                        style={[style.input, { borderWidth: 0, borderColor: 'transparent' }]}
                        dropDownContainerStyle={{ backgroundColor: '#e6e6e6', borderRadius: 10, borderColor: 'transparent' }}
                        placeholderStyle={{ color: '#6c6c6c' }}
                        disabledItemLabelStyle={{ color: '#6c6c6c' }}
                        textStyle={{ color: cargo ? '#000' : '#6c6c6c' }}
                    />
                </View>

                <TouchableOpacity
                    style={style.botaoCadastro}
                    onPress={handlePreRegister}
                    disabled={isLoading}
                >
                    <Text style={style.textoBotaoCadastro}>
                        {isLoading ? "Cadastrando..." : "Cadastrar usuário"}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={style.cardUsuarios}>
                <Text style={style.tituloUsuarios}>Usuários Cadastrados</Text>
                {employeesData.map((employee) => (
                    <View style={style.usuarioItem} key={employee.id}>
                        <View style={style.avatar}>
                            <Text style={style.avatarText}>{getInitials(employee.name)}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={style.nomeUsuario}>{employee.name}</Text>
                            <Text style={style.emailUsuario}>{employee.email}</Text>
                        </View>
                        <View style={style.tagCargo}>
                            <Text style={style.tagCargoText}>{formatRole(employee.role)}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const style = StyleSheet.create({

    tituloHeader: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#222",
        left: 10,
    },
    cardCadastro: {
        backgroundColor: "#eeeeee",
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,


    },
    tituloCardCadastro: {
        fontSize: 18,
        fontWeight: "500",
        color: "#222",
        marginBottom: 25,
        textAlign: "center",
        marginTop: 3,

    },
    labelCargo: {
        fontSize: 15,
        color: "#222",
        marginBottom: 4,
        fontWeight: "400",
        marginTop: 10,

    },

    label: {
        fontSize: 15,
        color: "#222",
        marginBottom: 4,
        fontWeight: "400",
        marginTop: 1,
    },
    input: {
        backgroundColor: "#e6e6e6",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        justifyContent: "center",
    },
    inputText: {
        color: "#6c6c6c",
        fontSize: 14,
    },
    botaoCadastro: {
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
    textoBotaoCadastro: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "400",

    },
    cardUsuarios: {
        backgroundColor: "#eeeeee",
        margin: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
        borderRadius: 16,
        padding: 16,
    },
    tituloUsuarios: {
        fontSize: 17,
        color: "#000000",
        fontWeight: "500",
        marginBottom: 12,
        textAlign: "center",
    },
    usuarioItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff90",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,

    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#E5E5E5",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    avatarText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#222",
    },
    nomeUsuario: {
        fontSize: 16,
        fontWeight: "500",
        color: "#222",
    },
    emailUsuario: {
        fontSize: 13,
        color: "#888",
        marginTop: 2,
    },
    tagCargo: {
        backgroundColor: "#9AABEF",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginLeft: 8,
        color: "#000000",

    },
    tagCargoText: {
        color: "#000000",
        fontSize: 12,
        fontWeight: "500",
    },
});