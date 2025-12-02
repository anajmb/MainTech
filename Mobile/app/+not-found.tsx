import { Link } from "expo-router";
import { View, Text, StyleSheet, ImageBackground, Dimensions } from "react-native";
import { FontAwesome } from '@expo/vector-icons'; // Biblioteca de ícones padrão do Expo

// Importação da imagem (ajuste o caminho '../' conforme sua estrutura de pastas)
// Supondo que este arquivo esteja na pasta 'app' e a imagem em 'assets/images'
const backgroundImage = require('../../assets/images/background-mobile.png');

export default function NotFoundScreen() {
    return (
        <ImageBackground 
            source={backgroundImage} 
            style={styles.background}
            resizeMode="cover"
        >
            {/* Overlay escuro opcional para garantir leitura, caso a imagem seja muito clara */}
            <View style={styles.overlay}>
                
                <View style={styles.card}>
                    {/* Lado Esquerdo: Ícone */}
                    <View style={styles.iconContainer}>
                        <FontAwesome name="cog" size={40} color="#b91c1c" />
                    </View>

                    {/* Lado Direito: Textos */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>404 - Página Não Encontrada</Text>
                        <Text style={styles.subtitle}>A página que você está procurando não existe.</Text>
                    </View>
                </View>

                {/* Botão de Voltar (Estilizado) */}
                <Link href={'/_sitemap'} style={styles.linkButton}>
                    <Text style={styles.linkText}>Voltar para o início</Text>
                </Link>

            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.1)', // Sutil escurecimento se necessário
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        paddingVertical: 30,
        paddingHorizontal: 20,
        width: '100%',
        maxWidth: 400, // Limite para não ficar gigante em tablets
        flexDirection: 'row', // Alinha ícone e texto lado a lado
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8, // Sombra para Android
    },
    iconContainer: {
        marginRight: 20,
    },
    textContainer: {
        flex: 1, // Ocupa o restante do espaço
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    linkButton: {
        marginTop: 30,
        paddingVertical: 12,
        paddingHorizontal: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Botão translúcido
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'white',
        overflow: 'hidden', // Importante para o borderRadius funcionar no Link
        textAlign: 'center', // Para centralizar o texto dentro do Link
    },
    linkText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});