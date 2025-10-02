import { StyleSheet, Text, View } from "react-native";
import { Clock } from "lucide-react-native";

interface TasksCards {
    id: number;
    title: string;
    inspectorId: number;
    machineId: number;
    updateDate: string;
}

export const TasksCards: React.FC<TasksCards> = ({ id, title, inspectorId, machineId, updateDate }) => {

    const formattedDate = new Date(updateDate).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <>
            <View style={styles.card}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.date}><Clock size={15} /> {formattedDate}</Text>
            </View>
        </>
    )

}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#eeeeee',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    id: {
        fontSize: 14,
    },
    date: {
        fontSize: 16,
        marginBottom: 8,
        marginLeft: 200,
    },
});

export default TasksCards;