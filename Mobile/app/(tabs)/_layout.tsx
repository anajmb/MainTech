import { Tabs } from "expo-router";
import { FileText, Focus, History, House, Settings, SquareCheckBig } from 'lucide-react-native';
import { useAuth } from "@/hooks/useAuth";
import { ActivityIndicator } from "react-native";

export default function TabsLayout() {
     const { user } = useAuth();

     console.log("User carregado:", user);
      if (!user) return <ActivityIndicator size="large" />;

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#BF201C',
                headerShown: false,
                tabBarStyle: {
                    paddingBottom: 5,
                    paddingTop: 5,
                    borderRadius: 20,
                    alignItems: 'center'
                },
            }} >
            <Tabs.Screen name="home"
                options={{
                    title: "Início",
                    tabBarLabel: "",
                    tabBarIcon: ({ color }) => <House size={25} color={color} />
                }}
            />
              {user.role !== "MAINTAINER" && (
            <Tabs.Screen name="tarefas"
                options={{
                    title: "Tarefas",
                    tabBarLabel: "",
                    tabBarIcon: ({ color }) => <SquareCheckBig size={25} color={color} />
                }}
            />
              )}

            {user.role !== "MAINTAINER" && (
                <Tabs.Screen name="QRCode"
                options={{
                    title: "QRCode",
                    tabBarLabel: "",
                    tabBarIcon: () => <Focus size={35} color="#bf201c" strokeWidth={1.8} />
                }}
                />
            )}

            {user.role !== "INSPECTOR" && (
                
                <Tabs.Screen name="documento"
                options={{
                    title: "Documento",
                    tabBarLabel: "",
                    tabBarIcon: ({ color }) => <FileText size={25} color={color} />
                }}
                />
            )}

             {/* {user.role !== "ADMIN" && (
                
                <Tabs.Screen name="historico"
                options={{
                    title: "Histórico",
                    tabBarLabel: "",
                    tabBarIcon: ({ color }) => <History size={25} color={color} />
                }}
                />
            )} */}


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
