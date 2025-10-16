import { Modal, Pressable, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { useEffect, useState } from "react";

// 1. Interface para definir o formato dos dados da notificação
interface NotificationData {
    id: string;
    type: string; // Ex: 'O.S.', 'Manutenção Preventiva'
    expirationDate: string; // Formato de data ISO, ex: '2025-10-17T10:00:00Z'
}

interface NotificationDropdownProps {
    visible: boolean;
    onClose: () => void;
}

// Função que simula a busca de dados do backend
const fetchNotificationsFromBackend = async (): Promise<NotificationData[]> => {
    console.log("Buscando notificações do backend...");
    // Simulando um atraso de rede de 1.5 segundos
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Dados mocados que viriam da sua API
    return [
        { id: '1', type: 'O.S.', expirationDate: '2025-10-17T14:00:00Z' },
        { id: '2', type: 'Manutenção Preventiva', expirationDate: '2025-10-18T09:00:00Z' },
    ];
};


export default function NotificationDropdown({ visible, onClose }: NotificationDropdownProps) {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 2. useEffect para buscar os dados quando o modal se torna visível
    useEffect(() => {
        if (visible) {
            setIsLoading(true);
            fetchNotificationsFromBackend()
                .then(data => {
                    setNotifications(data);
                })
                .catch(error => console.error("Erro ao buscar notificações:", error))
                .finally(() => setIsLoading(false));
        }
    }, [visible]); // A dependência [visible] garante que a busca ocorra toda vez que o modal abrir

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <View style={styles.dropdownContainer}>
                    <Text style={styles.dropdownTitle}>Notificações</Text>
                    
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#CE221E" />
                    ) : (
                        notifications.map((item) => {
                            // 3. Formatando a data para o padrão brasileiro
                            const formattedDate = new Date(item.expirationDate).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            });

                            return (
                                <View key={item.id} style={styles.notificacaoItem}>
                                    <View style={styles.notificacaoIcon}>
                                        <AlertTriangle color="#fde4b6ff" size={20} />
                                    </View>
                                    <View style={styles.notificacaoContent}>
                                        <Text style={styles.itemTitle}>{item.type}</Text>
                                        {/* 4. Mensagem formatada como você pediu */}
                                        <Text style={styles.itemDescription}>
                                            A tarefa {item.type} está prestes a expirar em {formattedDate}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })
                    )}
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
    itemDescription: { fontSize: 13, color: '#888', marginTop: 2, },
});