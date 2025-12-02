import SetaVoltar from "@/components/setaVoltar";
import { api } from "@/lib/axios";
import { TabsStyles } from "@/styles/globalTabs";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Toast } from "toastify-react-native";

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

/**
 * Função de validação de CPF.
 * @param cpf O CPF como string (com ou sem formatação).
 * @returns boolean indicando se o CPF é válido.
 */
const validarCPF = (cpf: string) => {
    cpf = cpf.replace(/\D/g, "");

    // Verifica se o CPF tem 11 dígitos e se não são todos iguais (ex: 111.111.111-11)
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    // Validação do primeiro dígito
    for (let i = 1; i <= 9; i++)
        soma += parseInt(cpf[i - 1]) * (11 - i);

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;

    soma = 0;
    // Validação do segundo dígito
    for (let i = 1; i <= 10; i++)
        soma += parseInt(cpf[i - 1]) * (12 - i);

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf[10]);
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
    const [erroMsg, setErroMsg] = useState("");
    const [cpfErroMsg, setCpfErroMsg] = useState(""); // Novo estado para erro do CPF

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


    // Formata CPF
    const formatCPF = (value: string) => {
        // Limita o tamanho máximo da string formatada para evitar que o usuário digite mais de 11 números
        const cleanedValue = value.replace(/\D/g, "").slice(0, 11);

        return cleanedValue
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    };

    // Remove a máscara
    const limparCPF = (value: string) => value.replace(/\D/g, "");

    const handlePreRegister = async () => {
        setErroMsg(""); // Limpa o erro geral
        setCpfErroMsg(""); // Limpa o erro do CPF

        const cpfLimpo = limparCPF(cpfData);
        let hasError = false;

        if (!name || !cpfData || !cargo) {
            setErroMsg("Preencha todos os campos!");
            hasError = true;
        }

        // 1. Validação de formato/comprimento do CPF (11 dígitos)
        if (cpfLimpo.length !== 11) {
             setCpfErroMsg("O CPF deve ter 11 dígitos.");
             hasError = true;
        }

        // 2. Validação da lógica do CPF
        if (cpfLimpo.length === 11 && !validarCPF(cpfLimpo)) {
            setCpfErroMsg("CPF inválido.");
            hasError = true;
        }

        if (hasError) {
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/employees/preRegister', {
                name: name,
                cpf: cpfLimpo, // Envia o CPF limpo para a API
                role: cargo,
            });
            Toast.success("Usuário pré-cadastrado com sucesso! ✅");
            setName('');
            setCpfData('');
            setCargo('');
            fetchEmployees();
        } catch (error: any) {
            if (error.response?.data?.msg) {
                alert(error.response.data.msg);
            } else {
                Toast.error("Erro ao cadastrar usuário. ❌");
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
            <View style={TabsStyles.todosCard}>
                <View style={style.cardCadastro}>
                    <Text style={style.tituloCardCadastro}>Informe os dados para liberar o cadastro</Text>
                    <View>
                        <Text style={style.label}>Nome Completo</Text>
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
                            style={[style.input, cpfErroMsg && style.inputError]} // Aplica estilo de erro se houver
                            placeholder="___.___.___-__"
                            placeholderTextColor="#8B8686"
                            value={cpfData}
                            onChangeText={(text) => {
                                setCpfData(formatCPF(text));
                                setCpfErroMsg(""); // Limpa o erro ao digitar
                            }}
                            keyboardType="numeric"
                            maxLength={14}
                        />
                         {/* Exibe a mensagem de erro específica para CPF */}
                        {cpfErroMsg !== "" && (
                            <Text style={style.textError}>{cpfErroMsg}</Text>
                        )}
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
                            // Aumenta o zIndex para garantir que o dropdown fique acima dos outros elementos
                            zIndex={3000}
                            zIndexInverse={1000}
                            style={[style.input, { borderWidth: 0, borderColor: 'transparent' }]}
                            dropDownContainerStyle={{ backgroundColor: '#e6e6e6', borderRadius: 10, borderColor: 'transparent' }}
                            placeholderStyle={{ color: '#6c6c6c' }}
                            textStyle={{ color: cargo ? '#000' : '#6c6c6c' }}
                        />
                    </View>

                    {erroMsg !== "" && cpfErroMsg === "" && ( // Exibe o erro geral APENAS se não houver erro de CPF
                        <View style={TabsStyles.erroMsg}>
                            <Text style={TabsStyles.erroMsgText}>{erroMsg}</Text>
                        </View>
                    )}

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
    // Novo estilo para indicar erro no input
    inputError: {
        borderColor: '#A50702', // Borda vermelha para erro
        borderWidth: 1,
    },
    // Novo estilo para texto de erro
    textError: {
        color: '#A50702',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
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