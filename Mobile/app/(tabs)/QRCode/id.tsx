import SetaVoltar from "@/components/setaVoltar";
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
            {/* Logo */}
            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Identificação</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>de Máquinas</Text>
                </View>
            </View>

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
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <TouchableOpacity
                            style={styles.confirmBtn}
                            onPress={() => {
                                if (idInput.trim()) {

                                    const dataParaEnviar = JSON.stringify({ id: idInput });

                                    router.push({
                                        pathname: "/QRCode/infoMaq",
                                        params: { codigo: dataParaEnviar } // Enviamos o JSON
                                    })
                                }
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "400" }}>
                                Confirmar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>


                {machines.map((machine) =>
                    <View style={styles.card}>
                        <View>
                            <Text style={styles.qrCodeCard}> QRCodes gerados</Text>
                            <View style={styles.subCard}>

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

                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    containerCard: {
        gap: 30,
    },
    titleCard: {
        fontSize: 20,
        textAlign: "center",
        color: "#6c6c6c",
        marginTop: 20,
        marginBottom: 20,
    },
    qrCodeCard: {
        fontSize: 19,
        fontWeight: "500",
        color: "gray",
        marginBottom: 20,
        textAlign: "center",
    },
    card: {
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        backgroundColor: '#eeeeee',
        padding: 20,
        borderRadius: 10,
    },
    label: {
        fontSize: 15,
        textAlign: 'left',
        marginBottom: 8,
        marginLeft: 4
    },
    tituloCard: {
        fontSize: 15,
        fontWeight: 600
    },
    input: {
        borderRadius: 10,
        backgroundColor: '#e6e6e6',
        padding: 10,
        textAlign: 'left'
    },
    subCard: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        flexDirection: "row",
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
    confirmBtn: {
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
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginRight: 20,
    },

    cardContent: {
        flex: 1,
        flexShrink: 1,
        backgroundColor: "#fff"
    },
    maqTitle: {
        fontSize: 18,
        color: "#000000",
        flexWrap: "wrap",
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    maqSubTitle: {

        marginTop: 4,
        fontSize: 13,
        color: "#5e5e5eff",

    },
    maqId: {
        marginTop: 3,
        fontSize: 12,
    },
});