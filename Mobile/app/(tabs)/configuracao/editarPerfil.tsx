import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Calendar, Camera, IdCard, Mail, Phone, User } from "lucide-react-native";
// Importado 'Image' e 'Platform' para o KeyboardAvoidingView
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";

export default function EditarPerfil() {
    const [image, setImage] = useState(null);

    // Função para lidar com a seleção de imagem (galeria ou câmera)
    // Agora chamada apenas pelo ícone da câmera
    const handleImagePicker = async () => {
        Alert.alert(
            "Selecionar foto",
            "Escolha uma opção para a sua foto de perfil",
            [
                {
                    text: "Escolher da Galeria",
                    onPress: () => pickImageFromGallery(),
                },
                {
                    text: "Tirar Foto",
                    onPress: () => takePhotoWithCamera(),
                },
                {
                    text: "Cancelar",
                    style: "cancel",
                },
            ]
        )
    };

    const pickImageFromGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Desculpe, precisamos da permissão da galeria para isso funcionar!');
            return;
        }

        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.log("Erro ao selecionar imagem da galeria: ", error);
            Alert.alert("Erro", "Não foi possível selecionar a imagem.");
        }
    };

    const takePhotoWithCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Desculpe, precisamos da permissão da câmera para isso funcionar!');
            return;
        }

        try {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.log("Erro ao tirar foto: ", error);
            Alert.alert("Erro", "Não foi possível usar a câmera.");
        }
    };


    return (
        <ScrollView style={TabsStyles.container}>
            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Editar Perfil</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>Atualize suas informações</Text>
                </View>
            </View>

            <View style={styles.todosCard}>

                <View style={styles.card}>
                    {/* A View cardFoto não é mais um TouchableOpacity */}
                    <View style={styles.cardFoto}>
                        <View>
                            <View style={styles.avatarContainer}>
                                {image ? (
                                    <Image source={{ uri: image }} style={styles.avatarImage} />
                                ) : (
                                    <User color={'#fff'} size={50} strokeWidth={1.5} />
                                )}
                            </View>
                            {/* O TouchableOpacity agora envolve APENAS o ícone da câmera */}
                            <TouchableOpacity style={styles.cameraIconContainer} onPress={handleImagePicker}>
                                <Camera color={'#CE221E'} size={20} />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ color: '#858585', fontSize: 14 }}>Toque no ícone para editar a foto</Text>
                    </View>
                </View>

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ padding: 2 }}>
                    <View style={styles.card}>
                        <View style={styles.formEditar}>

                            <View style={styles.opcaoForm}>
                                <View style={styles.iconELabel}>
                                    <User strokeWidth={1.5} size={22} />
                                    <Text style={styles.label}>Nome completo</Text>
                                </View>
                                <TextInput style={styles.input} />
                            </View>

                            <View style={styles.opcaoForm}>
                                <View style={styles.iconELabel}>
                                    <Mail strokeWidth={1.5} size={22} />
                                    <Text style={styles.label}>E-mail</Text>
                                </View>
                                <TextInput style={styles.input} />
                            </View>

                            <View style={styles.opcaoForm}>
                                <View style={styles.iconELabel}>
                                    <Phone strokeWidth={1.5} size={22} />
                                    <Text style={styles.label}>Telefone</Text>
                                </View>
                                <TextInput style={styles.input} />
                            </View>

                            <View style={styles.opcaoForm}>
                                <View style={styles.iconELabel}>
                                    <IdCard strokeWidth={1.5} size={22} />
                                    <Text style={styles.label}>CPF</Text>
                                </View>
                                <TextInput style={styles.input} />
                            </View>

                            <View style={styles.opcaoForm}>
                                <View style={styles.iconELabel}>
                                    <Calendar strokeWidth={1.5} size={22} />
                                    <Text style={styles.label}>Data de nascimento</Text>
                                </View>
                                {/* input data */}
                                <TextInput style={styles.input} />
                            </View>

                        </View>
                    </View>
                </KeyboardAvoidingView>

                <TouchableOpacity style={{ alignItems: 'center' }}>
                    <View style={TabsStyles.viewBotaoPrincipal}>
                        <Text style={TabsStyles.botaoText}>Salvar Alterações</Text>
                    </View>
                </TouchableOpacity>

            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    cardFoto: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15
    },
    formEditar: {
        padding: 35,
        gap: 25
    },
    card: {
        backgroundColor: "#fff", // Fundo branco para os cards, como solicitado
        shadowColor: 'rgba(0, 0, 0, 0.25)', // Sombra para iOS
        shadowOffset: { width: 1, height: 5 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10, // Sombra para Android
        borderRadius: 10
    },
    todosCard: {
        gap: 30,
        paddingBottom: 90
    },
    opcaoForm: {},
    input: {
        backgroundColor: '#E6E6E6',
        padding: 10,
        borderRadius: 10
    },
    label: {
        fontSize: 14,
        fontWeight: '600' // '600' é válido para fontWeight
    },
    iconELabel: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        marginBottom: 5
    },
    avatarContainer: {
        backgroundColor: '#CE221E', // Cor de fundo do círculo quando não há imagem
        height: 90,
        width: 90,
        borderRadius: 45, // Metade da largura/altura para ser um círculo
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        // Adicionando borda para manter o design sem o "fundo" extra
        borderWidth: 2,
        borderColor: '#CE221E', 
    },
    avatarImage: {
        height: 90,
        width: 90,
        borderRadius: 45,
    },
    cameraIconContainer: {
        backgroundColor: '#fff',
        height: 30,
        width: 30,
        borderRadius: 15, // Metade da largura/altura para ser um círculo
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5, // Sombra para Android
        shadowColor: '#000', // Sombra para iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        position: 'absolute',
        right: 0,
        bottom: 0,
    }
});