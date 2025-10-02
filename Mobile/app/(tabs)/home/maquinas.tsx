import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { useEffect, useState } from 'react';
import { Pencil, Trash2, Wrench } from "lucide-react-native";

interface Machines {
  id: number;
  name: string;
  location: string;
}

export default function Maquinas() {
  const [machines, setMachines] = useState<Machines[]>([]);
  const [oficinaSelecionada, setOficinaSelecionada] = useState("");
  const [open, setOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [oficinas, setOficinas] = useState([
    { label: 'Selecione', value: '', disabled: true },
    { label: 'Oficina de Manutenção', value: 'oficina1' },
    { label: 'Oficina de Usinagem', value: 'oficina2' },
    { label: 'Oficina de Soldagem', value: 'oficina3' },
    { label: 'Oficina Elétrica', value: 'oficina4' },
    { label: 'Oficina Mecânica', value: 'oficina5' },
    { label: 'Oficina Automotiva', value: 'oficina6' },
  ]);

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

      {/* Header */}
      <View style={TabsStyles.headerPrincipal}>
        <SetaVoltar />
        <View style={TabsStyles.conjHeaderPrincipal}>
          <Text style={TabsStyles.tituloPrincipal}>Cadastrar máquinas</Text>
        </View>
      </View>

      {/* Formulário de Cadastro */}
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

        {/* Lista de Máquinas */}
        <View style={styles.cardCad}>
          <Text style={styles.tituloCard}>Máquinas Cadastradas</Text>

          {machines.map((machine) => (
            <View key={machine.id} style={styles.cardMaq}>
              <View style={{ justifyContent: "center" }}>
                <Wrench color="#1E9FCE" size={28} />
              </View>

              <View style={{ marginLeft: 15 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  <Text style={styles.maqTitle}>{machine.name}</Text>
                  <Text style={styles.maqSubTitle}>{machine.location}</Text>
                </View>
                <Text style={styles.maqId}>ID: {machine.id}</Text>
              </View>

              <View style={styles.editIcons}>
                <Pencil size={18} style={{ marginRight: 10 }} />
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Trash2 size={18} color={'#e00000ff'} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  todosCard: {
    gap: 30,
    paddingBottom: 90,
  },
  cardCad: {
    backgroundColor: '#eeeeee',
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4
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
    alignItems: "center",
    justifyContent: "space-between"
  },
  maqTitle: {
    fontSize: 18,
    color: "#000000",
  },
  maqSubTitle: {
    marginLeft: 6,
    marginTop: 4,
    fontSize: 13,
    color: "#5e5e5e",
  },
  maqId: {
    marginTop: 3,
    fontSize: 12,
  },
  editIcons: {
    flexDirection: "row",
    alignItems: "center"
  }
});
