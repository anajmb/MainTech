import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

interface TasksCards {
    id: number;
    title: string;
    inspectorId: number;
    machineId: number;
}

export const TasksCards: React.FC<TasksCards> = ({ id, title, inspectorId, machineId }) => {
    return (
        <>
            <View style={styles.card}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{id}</Text>
                <Text style={styles.description}>{inspectorId}</Text>
                <Text style={styles.description}>{machineId}</Text>
            </View>
        </>
    )

}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        marginBottom: 8,
    },
    status: {
        fontSize: 14,
        color: '#555',
    },
});

export default TasksCards;