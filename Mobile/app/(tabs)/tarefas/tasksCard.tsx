import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Clock, Minus } from "lucide-react-native";

interface TasksCards {
    id: number;
    title: string;
    description: string;
    inspectorId: number;
    machineId: number;
    updateDate: string;
    status: string;
}

export const TasksCards: React.FC<TasksCards> = ({ id, title, description, inspectorId, machineId, updateDate, status }) => {

    const statusInfo = {
        text: status === 'PENDING' ? 'Pendente' : 'Concluído',
        style: status === 'PENDING' ? styles.statusPendente : styles.statusConcluido,
        iconColor: status === 'PENDING' ? '#ffd104' : '#5cb85c'
    };


    const formattedDate = new Date(updateDate).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <View style={styles.card}>

            <Text style={styles.title}>{title}</Text>

            <Text style={styles.description}>{description}</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Minus size={50} color={statusInfo.iconColor} strokeWidth={4} />

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Clock size={15} color="#00000077" style={styles.time} />
                    <Text style={styles.date}>{formattedDate}</Text>
                </View>
            </View>
        </View>

    )

}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#eeeeee',
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        marginBottom: 20,
        paddingHorizontal: 25,
        paddingVertical: -10,
    },
    title: {
        fontSize: 17,
        fontWeight: "400",
        marginBottom: 10,
        marginTop: 15,
    },
    description: {
        color: '#858585',
        fontSize: 16,
        marginBottom: 2,
    },
    id: {
        fontSize: 14,
    },
    date: {
        fontSize: 13,
        alignItems: 'center',
        color: '#00000077',
        gap: 5,
        marginLeft: 3,

    },
    statusPendente: {

    },
    statusConcluido: {

    },
    time: {
        marginRight: 5,
    }
});

export default TasksCards;