import { Tabs, useRouter } from "expo-router";
import { FileText, Focus, History, House, Settings, SquareCheckBig } from 'lucide-react-native';
import { useAuth } from "@/contexts/authContext";
import { ActivityIndicator, View, TouchableOpacity, StyleSheet } from "react-native";

export default function TabsLayout() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return <ActivityIndicator size="large" />;

  function CustomTabBar({ state, descriptors, navigation }: any) {
    if (!user) return null;

    // Definindo abas permitidas para cada role
    const allowed = new Set<string>(['home', 'configuracao']);
    if (user.role !== "MAINTAINER") {
      allowed.add('tarefas');
      allowed.add('QRCode');
    }
    if (user.role !== "INSPECTOR") {
      allowed.add('documento');
    }
    if (user.role !== "ADMIN") {
      allowed.add('historico');
    }

    const visibleRoutes = state.routes.filter((r: any) => allowed.has(r.name));
    if (visibleRoutes.length === 0) return null;

    return (
      <View style={styles.tabBar}>
        {visibleRoutes.map((route: any) => {
          const originalIndex = state.routes.findIndex((r: any) => r.key === route.key);
          const focused = state.index === originalIndex;
          const descriptor = descriptors[route.key];

          const onPress = () => {
            if (focused) {
              // Aba já focada → resetar stack para tela raiz da aba
              navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              navigation.navigate(route.name, { screen: route.name });
            } else {
              navigation.jumpTo(route.name);
            }
          };

          const icon = descriptor?.options?.tabBarIcon
            ? descriptor.options.tabBarIcon({ color: focused ? '#BF201C' : '#8e8e8e', size: 25 })
            : null;

          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabButton}>
              {icon}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: '#BF201C',
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          borderRadius: 20,
          alignItems: 'center'
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => <House size={25} color={color} />,
        }}
      />

      {user.role !== "MAINTAINER" && (
        <Tabs.Screen
          name="tarefas"
          options={{
            title: "Tarefas",
            tabBarIcon: ({ color }) => <SquareCheckBig size={25} color={color} />,
          }}
        />
      )}

      {user.role !== "MAINTAINER" && (
        <Tabs.Screen
          name="QRCode"
          options={{
            title: "QRCode",
            tabBarIcon: () => <Focus size={35} color="#BF201C" strokeWidth={1.8} />,
          }}
        />
      )}

      {user.role !== "INSPECTOR" && (
        <Tabs.Screen
          name="documento"
          options={{
            title: "Documento",
            tabBarIcon: ({ color }) => <FileText size={25} color={color} />,
          }}
        />
      )}

      {user.role !== "ADMIN" && (
        <Tabs.Screen
          name="historico"
          options={{
            title: "Histórico",
            tabBarIcon: ({ color }) => <History size={25} color={color} />,
          }}
        />
      )}

      <Tabs.Screen
        name="configuracao"
        options={{
          title: "Configurações",
          tabBarIcon: ({ color }) => <Settings size={25} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 17,
    flexDirection: 'row',
    height: 80,
    borderRadius: 30,
    backgroundColor: '#eeeeee',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 1,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});
