// ...existing code...
import SetaVoltar from "@/components/setaVoltar";
import Logo from "@/components/logo";
import { TabsStyles } from "@/styles/globalTabs";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface Machines {
    id: number;
    name: string;
    location: string;
    qrCode: string
}

// ...existing imports...
export default function NovaTarefa() {
    const [machines, setMachines] = useState<Machines[]>([]);
    const [idInput, setIdInput] = useState("");
    const router = useRouter();

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
            <Logo />

            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Identificação</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>de Máquinas</Text>
                </View>
            </View>

            <View style={TabsStyles.todosCard}>
                <View style={styles.containerCard}>
                    <View style={styles.card}>
                        <Text style={styles.titleCard}>Indentifique a máquina que deseja ter mais informações</Text>
                        <View >
                            <Text style={styles.label}>ID:</Text>
                            <TextInput
                                placeholder="Digite o id da máquina"
                                placeholderTextColor={'#8B8686'}
                                style={styles.input}
                                value={idInput}
                                onChangeText={setIdInput}
                            />
                        </View>
                        <View style={{ alignItems: 'center', marginTop: 8 }}>
                            <TouchableOpacity
                                style={styles.confirmBtn}
                                onPress={() => {
                                    if (idInput.trim()) {
                                        const dataParaEnviar = JSON.stringify({ id: idInput });
                                        router.push({
                                            pathname: "/QRCode/infoMaq",
                                            params: { codigo: dataParaEnviar }
                                        })
                                    }
                                }}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.confirmText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <View>
                            <Text style={styles.qrCodeCard}>QRCodes gerados</Text>
                            {machines.map((machine) =>
                                <View style={styles.subCard} key={machine.id}>
                                    <Image
                                        style={styles.image}
                                        source={{ uri: `${machine.qrCode}` }}
                                    />
                                    <View style={styles.cardContent}>
                                        <Text style={styles.maqTitle}>{machine.name}</Text>
                                        <Text style={styles.maqSubTitle}>{machine.location}</Text>
                                        <Text style={styles.maqId}>ID: {machine.id}</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    containerCard: {
        gap: 18, // reduzido para harmonizar com home
    },
    titleCard: {
        fontSize: 16, // reduzido para ficar mais harmônico
        textAlign: "center",
        color: "#6c6c6c",
        marginTop: 12, // ajuste de espaçamento
        marginBottom: 12,
    },
    qrCodeCard: {
        fontSize: 17,
        fontWeight: "500",
        color: "gray",
        marginBottom: 14,
        textAlign: "center",
    },
    card: {
        backgroundColor: '#eeeeee',
        padding: 14, // card menor
        borderRadius: 8,
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        textAlign: 'left',
        marginBottom: 6,
        marginLeft: 4
    },
    tituloCard: {
        fontSize: 15,
        fontWeight: "600"
    },
    input: {
        borderRadius: 8,
        backgroundColor: '#e6e6e6',
        padding: 8, // input mais compacto
        textAlign: 'left'
    },
    subCard: {
        backgroundColor: "#fff",
        padding: 12, // reduzido
        borderRadius: 8,
        marginBottom: 12,
        flexDirection: "row",
        marginVertical: 6,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 2,
    },
    confirmBtn: {
        backgroundColor: "#A50702",
        color: "#fff",
        borderRadius: 8,
        paddingVertical: 10, // botão menor
        width: "48%", // largura reduzida para harmonizar
        marginTop: 12,
        marginBottom: 18,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center"
    },
    confirmText: {
        color: "#fff",
        fontSize: 15, // tamanho do texto reduzido
        fontWeight: "400"
    },
    image: {
        width: 72, // tamanho reduzido para harmonizar
        height: 72,
        resizeMode: 'contain',
        marginRight: 14,
    },

    cardContent: {
        flex: 1,
        flexShrink: 1,
        backgroundColor: "#fff"
    },
    maqTitle: {
        fontSize: 16, // reduzido
        color: "#000000",
        flexWrap: "wrap",
    },
    maqSubTitle: {
        marginTop: 4,
        fontSize: 12,
        color: "#5e5e5eff",
    },
    maqId: {
        marginTop: 3,
        fontSize: 11,
    },
});