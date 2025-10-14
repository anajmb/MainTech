import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import TasksCards from "./tasksCard";


interface Tasks {
    id: number;
    title: string;
    description: string;    
    inspectorId: number;
    machineId: number;
    status: string;
    updateDate: string;
}

export default function Tarefas() {

    const [tasks, setTasks] = useState<Tasks[]>([]);
    const [filtro, setFiltro] = useState<"todas" | "pendente" | "concluida">("todas");

  useEffect(() => {
    async function fetchTasks() {
        try {
            // Define a URL de acordo com o filtro
            let url = 'https://maintech-backend-r6yk.onrender.com/tasks/get';
            if (filtro === "pendente") url += "?status=PENDING";
            if (filtro === "concluida") url += "?status=COMPLETED";

            const response = await fetch(url);
            const data = await response.json();

            const mappedTasks = data.map((task: any) => ({
                id: task.id,
                title: task.title,
                description: task.description,
                inspectorId: task.inspectorId,
                machineId: task.machineId,
                status: task.status,
                updateDate: task.updateDate,
            }));

            setTasks(mappedTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    fetchTasks();
}, [filtro]); // 🔁 Atualiza sempre que o filtro mudar


    return (
        <ScrollView style={TabsStyles.container}>
            {/* Logo */}

            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />

                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Tarefas</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>Minhas tarefas</Text>
                </View>

                <Link href={'/tarefas/novaTarefa'}>
                    <View style={{
                        backgroundColor: "#D10B03",
                        borderRadius: 25, padding: 8, height: 50, width: 50,
                        alignItems: 'center', justifyContent: 'center'
                    }} >
                        <Plus color={"#fff"} strokeWidth={1.8} size={30} />
                    </View>
                </Link>
            </View>

            <View style={styles.filtro}>
                <TouchableOpacity onPress={() => setFiltro("todas")}>
                    <Text
                        style={[
                            styles.filtroTitulo,
                            filtro === "todas" && {
                                color: "#fff",
                                backgroundColor: '#CF0000'
                            }
                        ]}>
                        Todas
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFiltro("pendente")}>
                    <Text
                        style={[
                            styles.filtroTitulo,
                            filtro === "pendente" && {
                                color: "#fff",
                                backgroundColor: '#CF0000'
                            }
                        ]}>
                        Pendentes
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFiltro("concluida")}>
                    <Text
                        style={[
                            styles.filtroTitulo,
                            filtro === "concluida" && {
                                color: "#fff",
                                backgroundColor: '#CF0000'
                            }
                        ]}>
                        Concluídas
                    </Text>
                </TouchableOpacity>
            </View>

                {tasks.map(task => (
                    <TasksCards
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        description={task.description}
                        updateDate={task.updateDate}
                    />

                ))}
           


        </ScrollView>
    )
}

const styles = StyleSheet.create({
    filtro: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 50,
        backgroundColor: '#eeeeee',
        paddingVertical: 25,
        borderRadius: 12,
        paddingHorizontal: 5,
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
    },
    filtroTitulo: {
        padding: 10,
        borderRadius: 20,
        paddingHorizontal: 20,
    },
})