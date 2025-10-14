import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type SecaoProps = {
    title?: string;
    children: React.ReactNode
}

export default function Secao({ title, children }: SecaoProps) {
    return (
        <View style={styles.allCard}>
            {title && <Text style={styles.titleSecao}>{title}</Text>}
            <View style={styles.contentSecao}>{children}</View>
        </View>
    )
}

export function Relatorio() {
    return (
        <>
            {/* datas */}
            <Secao>
                <View style={styles.row}>
                    <View style={styles.field}><Text style={styles.label}>Data de Emissão: </Text><Text style={styles.value}>25/09/2025</Text></View>
                    <View style={styles.field}><Text style={styles.label}>Data de conclusão: </Text> <Text style={styles.value}>20/09/2025</Text></View>
                </View>
            </Secao>

            {/* prioridades */}
            <Secao title="Prioridade da anomalia">
                <Text style={styles.value}>Média Criticidade</Text>
            </Secao>

            {/* seção de equipamento e diagnostico */}
            <Secao title="Equipamento e Diagnóstico">
                <View style={styles.row}>
                    <View style={styles.field}><Text style={styles.label}>Nome:</Text><Text style={styles.value}>Bomba Hidráulica</Text></View>
                    <View style={styles.field}><Text style={styles.label}>Identificação da Máquina:</Text><Text style={styles.value}>BH-03</Text></View>
                </View>
                <View><Text style={styles.label}>Sub-Conjunto:</Text><Text style={styles.value}>Vedação do Eixo</Text></View>
                <View><Text style={styles.label}>Diagnóstico Atual:</Text> <Text style={styles.value}>Vazamento de óleo identificado na vedação do eixo principal.
                    Resíduos de óleo encontrados ao redor da base da bomba.
                    Pressão de operação abaixo do especificado devido à perda
                    de fluido.</Text></View>
                <View><Text style={styles.label}>Solicitante:</Text><Text style={styles.value}>João Silva</Text></View>
            </Secao>

            {/* seção dos inputs */}
            <Secao title="Relatório da Intervenção">
               <View style={styles.row}>
                    <View style={styles.field}><Text style={styles.label}>Nome:</Text><Text style={styles.value}>Carlos Souza</Text></View>
                    <View style={styles.field}><Text style={styles.label}>Data:</Text><Text style={styles.value}>25/09/2025</Text></View>
                </View>
                <View><Text style={styles.label}>Serviço Realizado:</Text><TextInput style={styles.textInput} placeholder="Descreva os detalhes..." multiline/></View>
                <View><Text style={styles.label}>Materiais Utilizados:</Text><TextInput style={styles.textInput}placeholder="Descreva os materiais..." multiline/></View>
            </Secao>
              
        </>
    )
}

const styles = StyleSheet.create({

    allCard: {
        backgroundColor: '#eeeee', 
        borderRadius: 8, 
        marginHorizontal: 16, 
        marginBottom: 16, 
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3, 
        shadowRadius: 2 
    },
    titleSecao: {
        backgroundColor: '#A50702',
        color: 'white',
        padding: 12,
        fontSize: 16, 
        fontWeight: '500', 
        borderTopLeftRadius: 8, 
        borderTopRightRadius: 8
    },
    contentSecao: {
        padding: 15,
        gap: 15
    },
    row: {
        flexDirection: 'row', 
        gap: 15
    },
    field: {
        flex: 1
    },
    label: {
        fontSize: 14, 
        color: '#6c757d', 
        marginBottom: 6
    },
    value: {
        fontSize: 16, 
        color: '#212529', 
        fontWeight: '500'
    },
    textInput: {
        backgroundColor: '#f8f9fa', 
        borderRadius: 8, 
        paddingHorizontal: 15, 
        paddingTop: 10, 
        fontSize: 16, 
        minHeight: 120, 
        textAlignVertical: 'top', 
        borderWidth: 1, 
        borderColor: '#dee2e6'
    }
})