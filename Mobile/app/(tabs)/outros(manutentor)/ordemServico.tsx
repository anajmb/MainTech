import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Relatorio } from "./telaRelatorio";



export default function OrdemServico() {
    return (
        <ScrollView style={TabsStyles.container}>
            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Ordem de Serviço 100 - Manutenção Corretiva</Text>
                </View>
            </View>
            <Relatorio />

             <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20  }}>
            <TouchableOpacity style={{alignItems: "center", marginBottom: 20, marginTop: 10}}>
                <View style={styles.btnSalvar}>
                    <Text style={styles.botaoText}>Salvar Alterações</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{alignItems: "center", marginBottom: 20, marginTop: 10}}>
                <View style={styles.btnAlterar}>
                    <Text style={styles.botaoText}>Rejeitar</Text>
                </View>
            </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({

    btnSalvar:{
        backgroundColor: '#CF0000',
        borderRadius: 20,
        width: '100%',
        marginRight: 10
    },
    btnAlterar:{
        backgroundColor: '#9c9898ff',
        borderRadius: 20,
        width: '100%',
        marginRight: 10
    },

    botaoText:{
        padding: 8,
        textAlign: 'center',
        color: '#fff'
    }

})
