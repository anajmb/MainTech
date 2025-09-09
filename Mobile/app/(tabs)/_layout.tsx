import { Tabs } from "expo-router"
import { Camera, FileText, House, Settings, SquareCheckBig, } from 'lucide-react-native'

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: "#BF201C",  // parte das notificações
            headerShown: false,
         tabBarStyle: { paddingBottom: 5, borderRadius: 20, marginHorizontal: 20 }
        }}>

            <Tabs.Screen name="index" options={{tabBarLabel: "", tabBarIcon: ({color, size}) => (<House size={25} color={color} />)}} />
            <Tabs.Screen name="tarefas" options={{tabBarLabel: "", tabBarIcon: ({color, size}) => (<SquareCheckBig size={25} color={color} />)}} />
            <Tabs.Screen name="QRCode" options={{tabBarLabel: "", tabBarIcon: ({color, size}) => (<Camera size={30} color={"#fff "} style={{backgroundColor: "#BF201C", margin: 10, padding: 10, borderRadius: "50%"}} />)}} />
            <Tabs.Screen name="documento" options={{tabBarLabel: "", tabBarIcon: ({color, size}) => (<FileText size={25} color={color} />)}} />
            <Tabs.Screen name="configuracao" options={{tabBarLabel: "", tabBarIcon: ({color, size}) => (<Settings size={25} color={color} />)}} />
 
        </Tabs>
    )

    // tentar esconde a barra de navegação nativa
    // arrumar o tamanho dos icones
    // ajustar o background da camera
    // centralizar a tab bar
}