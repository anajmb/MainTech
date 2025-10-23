import { Modal, Pressable, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { AlertTriangle, BellOff } from "lucide-react-native";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

// 1. Interface para definir o formato dos dados da notificação
interface NotificationData {
    id: string;
    title: string; // Ex: 'O.S.', 'Manutenção Preventiva'
    expirationDate: string; // Formato de data ISO, ex: '2025-10-17T10:00:00Z'
}

interface NotificationDropdownProps {
    visible: boolean;
    onClose: () => void;
}

// Função que simula a busca de dados do backend
const fetchNotificationsFromBackend = async (): Promise<NotificationData[]> => {
  try {
    const response =  await api.get("/tasks/get/expiring-soon")

    const mappedData = response.data.map((task: any) => ({
            id: task.id,
            title: task.title,
            expirationDate: task.expirationDate
        }));

        return mappedData ;
    } catch (error) {
        console.error("Erro ao buscar notificações via API:", error);
        // Lança o erro para que possamos tratá-lo no componente
        throw error;
    }
};


export default function NotificationDropdown({ visible, onClose }: NotificationDropdownProps) {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

   const loadNotifications = () => {
        setIsLoading(true);
        setError(null); // Limpa erros anteriores
        fetchNotificationsFromBackend()
            .then(data => {
                setNotifications(data);
            })
            .catch(() => setError("Não foi possível carregar as notificações."))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        if (visible) {
            loadNotifications();
        }
    }, [visible]);

    // Função para renderizar o conteúdo do modal
    const renderContent = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" color="#CE221E" />;
        }

        if (error) {
            return <Text style={styles.emptyText}>{error}</Text>;
        }
        
        if (notifications.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    {/* <BellOff size={24} color="#888" /> */}
                    <Text style={styles.emptyText}>Nenhuma notificação no momento.</Text>
                </View>
            );
        }

        return notifications.map((item) => {
            const formattedDate = new Date(item.expirationDate).toLocaleDateString('pt-BR');
            return (
                <View key={item.id} style={styles.notificacaoItem}>
                    <View style={styles.notificacaoIcon}>
                        <AlertTriangle color="#fde4b6ff" size={20} />
                    </View>
                    <View style={styles.notificacaoContent}>
                        <Text style={styles.itemTitle}>Tarefa quase expirando</Text>
                        <Text style={styles.itemDescription}>
                            A tarefa {item.title} está prestes a expirar em {formattedDate}
                        </Text>
                    </View>
                </View>
            );
        });
    };

    return (
        <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <View style={styles.dropdownContainer}>
                    <Text style={styles.dropdownTitle}>Notificações</Text>
                    {renderContent()}
                </View>
            </Pressable>
        </Modal>
    );
}

// Estilos (copiados da sua Home, mas podem ficar aqui)
const styles = StyleSheet.create({
    modalOverlay: { 
        flex: 1, 
    },
    dropdownContainer: { 
        position: 'absolute',
         top: 125,
          right: 35, 
          width: 300, 
          backgroundColor: '#f5f5f5', 
          borderRadius: 16, padding: 16, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, minHeight: 150, },
    dropdownTitle: { fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 12, alignSelf: 'center' },
    notificacaoItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#e0e0e0ff' },
    notificacaoIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#c96d03ff', justifyContent: 'center', alignItems: 'center', marginRight: 12, margin: 4 },
    notificacaoContent: { flex: 1 },
    itemTitle: { fontSize: 14, fontWeight: '600', color: '#444' },
    itemDescription: { fontSize: 13, color: '#888', marginTop: 4, },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    emptyText: {
        marginTop: 8,
        fontSize: 14,
        color: '#888',
    }
});