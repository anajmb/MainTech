import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
    return (
        <View style={{justifyContent: 'center', alignItems: 'center', margin: 100}}>
            <Text>NÃO ENCONTRADO</Text>
            <Link href={'/_sitemap'}>Go to Home</Link>
        </View >
    )
}