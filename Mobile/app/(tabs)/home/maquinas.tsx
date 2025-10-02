import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Pencil, Trash2, Wrench } from "lucide-react-native";


export default function Maquinas() {
    const [oficinaSelecionada, setOficinaSelecionada] = useState("");
    const [open, setOpen] = useState(false);

    const [oficinas, setOficinas] = useState([
        { label: 'Selecione', value: '', disabled: true },
        { label: 'Oficina de Manutenção', value: 'oficina1' },
        { label: 'Oficina de Usinagem', value: 'oficina2' },
        { label: 'Oficina de Soldagem', value: 'oficina3' },
        { label: 'Oficina Elétrica', value: 'oficina4' },
        { label: 'Oficina Mecânica', value: 'oficina5' },
        { label: 'Oficina Automotiva', value: 'oficina6' },
    ]);
    return (
        <ScrollView style={TabsStyles.container}>

            {/* logo */}

            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Cadastrar máquinas</Text>
                </View>
            </View>

            {/* Card Cadastro */}
            <View style={styles.todosCard}>
                <View style={styles.cardCad}>
                    <Text style={styles.tituloCard}>Informe os dados para cadastrar</Text>

                    <View style={{ marginBottom: 20, marginTop: 30 }}>
                        <Text style={styles.label}>Nome da Máquina:</Text>
                        <TextInput placeholder="Digite o nome da máquina" placeholderTextColor={"#6c6c6c"} style={styles.input} />
                    </View>

                    <View style={{ marginBottom: 20, marginTop: 10 }}>
                        <Text style={styles.label}>ID da Máquina:</Text>
                        <TextInput placeholder="_ _ _ _ _ _" placeholderTextColor={"#6c6c6c"} style={styles.input} />
                    </View>
                    <View style={{ marginBottom: 20, marginTop: 10 }}>
                        <Text style={styles.label}>Oficina:</Text>
                        <DropDownPicker
                            open={open}
                            value={oficinaSelecionada}
                            items={oficinas}
                            setOpen={setOpen}
                            setValue={setOficinaSelecionada}
                            setItems={setOficinas}
                            placeholder="Selecione"
                            style={styles.input}
                            dropDownContainerStyle={{ backgroundColor: '#e6e6e6', borderRadius: 10, borderColor: '#e6e6e6' }}
                            placeholderStyle={{ color: '#6c6c6c' }}
                            textStyle={{ color: oficinaSelecionada ? '#000' : '#6c6c6c' }}
                            disabledItemLabelStyle={{ color: '#6c6c6c' }}
                        />
                    </View>
                    <View style={{ marginBottom: 20, marginTop: 10 }}>
                        <Text style={styles.label}>Conjuntos:</Text>
                        <TextInput placeholder="Nome do conjunto" placeholderTextColor={"#6c6c6c"} style={styles.input} />
                    </View>
                    <TouchableOpacity style={styles.botaoCad}>
                        <Text style={{ color: '#fff' }}>Cadastrar Máquina</Text>
                    </TouchableOpacity>

                </View>
                  
                  {/* Máquinas cadastradas */}
                <View style={styles.cardCad}>
                    <Text style={styles.tituloCard}>Máquinas Cadastradas</Text>

                    {/* quinadora */}
                    <View style={styles.cardMaq}>

                        <View style={{justifyContent: "center"}}>
                            <Wrench color="#1E9FCE" size={28}/>
                        </View>
                          
                         <View style={{marginLeft: 15}}> 
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.maqTitle}>Quinadora</Text> <Text style={styles.maqSubTitle}>Oficina Mecânica</Text>
                        </View>
                        <Text style={styles.maqId}>ID: 122345</Text>
                         </View>

                         <View style={styles.editIcons}>
                         <Pencil size={18} style={{marginRight: 10}}/> <Trash2 size={18} color={'#e00000ff'}/>
                         </View>
                    </View>

                    {/* crimpagem */}
                    <View style={styles.cardMaq}>

                        <View style={{justifyContent: "center"}}>
                            <Wrench color="#B13FD7" size={28}/>
                        </View>
                          
                         <View style={{marginLeft: 15}}> 
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.maqTitle}>Crimpagem</Text> <Text style={styles.maqSubTitle}>Oficina Elétrica</Text>
                        </View>
                        <Text style={styles.maqId}>ID: 123345</Text>
                         </View>

                         <View style={styles.editIcons}>
                         <Pencil size={18} style={{marginRight: 10}}/> <Trash2 size={18} color={'#e00000ff'}/>
                         </View>
                    </View>
                </View>

                

            </View>

        </ScrollView>

    )
}

const styles = StyleSheet.create({
    todosCard: {
        gap: 30,
        paddingBottom: 90,
    },
    cardCad: {
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        backgroundColor: '#eeeeee',
        padding: 20,
        borderRadius: 10
    },
    tituloCard: {
        fontSize: 20,
        textAlign: "center",
        color: "#6c6c6c",
        marginTop: 20
    },
    label: {
        fontSize: 13,
        textAlign: 'left',
        marginBottom: 12
    },
    input: {
        borderRadius: 10,
        backgroundColor: '#e6e6e6',
        padding: 10,
        textAlign: 'left',
        borderColor: 'transparent',
    },
    botaoCad: {
        backgroundColor: "#CE221E",
        borderRadius: 8,
        paddingVertical: 9,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        width: 230,
        alignSelf: "center",

    },
    cardMaq: {
        backgroundColor: '#e6e6e6',
        borderRadius: 20,
        padding: 15,
        marginTop: 20,
        flexDirection: "row",

    },
    maqTitle: {
     fontSize: 18,
     color: "#000000",
    },
    maqSubTitle: {
        marginLeft: 6,
        marginTop: 4,
        fontSize: 13,
        color: "#5e5e5eff",
        
    },
    maqId: {
        marginTop: 3,
        fontSize: 12,
    },
    editIcons: {
        flexDirection: "row",
        marginTop: 30,
    }


})