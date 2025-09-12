import { StyleSheet } from "react-native";

export const TabsStyles = StyleSheet.create({
    container: {
        paddingTop: 60,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 60,
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    tituloPrincipal: {
        fontSize: 28,
        // fontFamily: 'Poppins-Regular'
    },
    subtituloPrincipal: {
        fontSize: 16,
        color: '#858585'
    },
    conjHeaderPrincipal: {
        marginLeft: 30,
        flex: 1
    },
    headerPrincipal: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    userFotoIcon: {
        backgroundColor: '#D10B03',
        padding: 12,
        borderRadius: '50%',
        right: 2,
    },
})