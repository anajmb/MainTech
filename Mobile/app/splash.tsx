import { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Text, Animated, Easing } from 'react-native';
import { router } from 'expo-router';

export default function SplashScreen() {
    const spinValue = useRef(new Animated.Value(0)).current; // Initialize animated value

    useEffect(() => {
        // Start the spinning animation
        Animated.loop(
            Animated.timing(
                spinValue,
                {
                    toValue: 1,
                    duration: 3000, // Duration of one full spin (in milliseconds)
                    easing: Easing.linear,
                    useNativeDriver: true, // Use native driver for better performance
                }
            )
        ).start();

        // Redirect after 4 seconds (as in your original code)
        const timer = setTimeout(() => {
            router.replace('/auth');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    // Interpolate the animated value to create a rotation
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <View style={styles.container}>
            <Image style={styles.backgroundImage} source={require('@/assets/images/background-mobile.png')} resizeMode="cover" />
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>

                <View style={{ marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Animated.Image
                        source={require('@/assets/images/engrenagem.png')}
                        style={[styles.logo, { transform: [{ rotate: spin }] }]}
                    />
                    <Text style={styles.logoTexto}>MAINTECH</Text>
                </View>

                <Text style={styles.subtitulo}>Gestão de máquinas</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#8B0000',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        // zIndex: 1,
    },
    logo: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },
    logoTexto: {
        fontSize: 32,
        color: '#FFFFFF',
        fontWeight: '800',
    },
    subtitulo: {
        color: "#fff",
        alignItems: "center",
        fontSize: 18,
    },
});