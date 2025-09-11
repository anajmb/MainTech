import { Tabs } from "expo-router"
import { Camera, FileText, Focus, House, ScanQrCode, Settings, SquareCheckBig, } from 'lucide-react-native'
import { View } from "react-native"

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: "#BF201C",  // parte das notificações
            headerShown: false,
            tabBarStyle: { paddingBottom: 5, paddingTop: 5, borderRadius: 20, alignItems: 'center' }
        }}>

            <Tabs.Screen name="index" options={{ tabBarLabel: "", tabBarIcon: ({ color, size }) => (<House size={25} color={color} />) }} />
            <Tabs.Screen name="tarefas" options={{ tabBarLabel: "", tabBarIcon: ({ color, size }) => (<SquareCheckBig size={25} color={color} />) }} />

            <Tabs.Screen name="QRCode" options={{ tabBarLabel: "", tabBarIcon: ({ color, size }) => (<Focus size={35} color={"#BF201C"} strokeWidth={1.8}/>) }} />

            <Tabs.Screen name="documento" options={{ tabBarLabel: "", tabBarIcon: ({ color, size }) => (<FileText size={25} color={color} />) }} />
            <Tabs.Screen name="configuracao" options={{ tabBarLabel: "", tabBarIcon: ({ color, size }) => (<Settings size={25} color={color} />) }} />

        </Tabs>
    )

    // tentar esconde a barra de navegação nativa
    // arrumar o tamanho dos icones
    // ajustar o background da camera
    // centralizar a tab bar
}