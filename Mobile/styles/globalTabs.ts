import { StyleSheet } from "react-native";

export const TabsStyles = StyleSheet.create({
    container: {
        paddingTop: 60,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 90,
        backgroundColor: '#F5F5F5',
    },
    text: {
        fontFamily: "Poppins-Regular",
    },
    tituloPrincipal: {
        fontSize: 28,
    },
    subtituloPrincipal: {
        fontSize: 16,
        color: '#858585'
    },
    conjHeaderPrincipal: {
        marginLeft: 30,
        flex: 1,
    },
    headerPrincipal: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30
    },
    userFotoIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#d10b03',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    userFoto: {
        width: '100%',
        height: '100%',
    },
    viewBotaoPrincipal: {
        backgroundColor: '#A50702',
        borderRadius: 10,
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    botaoText: {
        padding: 8,
        textAlign: 'center',
        color: '#fff'
    },
    todosCard: {
        marginBottom: 30,
        gap: 20,
        paddingBottom: 80,
    }
})