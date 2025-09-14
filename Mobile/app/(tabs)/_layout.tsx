import { Tabs } from "expo-router";
import { FileText, Focus, House, Settings, SquareCheckBig } from 'lucide-react-native';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#BF201C",
                headerShown: false,
                tabBarStyle: {
                    paddingBottom: 5,
                    paddingTop: 5,
                    borderRadius: 20,
                    alignItems: 'center'
                }
            }} >
            <Tabs.Screen name="home"
                options={{
                    title: "Inicio",
                    tabBarLabel: "",
                    tabBarIcon: ({ color }) => <House size={25} color={color} />
                }}
            />
            <Tabs.Screen name="tarefas"
                options={{
                    title: "Tarefas",
                    tabBarLabel: "",
                    tabBarIcon: ({ color }) => <SquareCheckBig size={25} color={color} />
                }}
            />
            <Tabs.Screen name="QRCode"
                options={{
                    title: "QRCode",
                    tabBarLabel: "",
                    tabBarIcon: () => <Focus size={35} color="#BF201C" strokeWidth={1.8} />
                }}
            />
            <Tabs.Screen name="documento"
                options={{
                    title: "Documento",
                    tabBarLabel: "",
                    tabBarIcon: ({ color }) => <FileText size={25} color={color} />
                }}
            />
            <Tabs.Screen name="configuracao"
                options={{
                    title: "Configurações",
                    tabBarLabel: "",
                    tabBarIcon: ({ color }) => <Settings size={25} color={color} />
                }}
            />

        </Tabs>
    );
}
