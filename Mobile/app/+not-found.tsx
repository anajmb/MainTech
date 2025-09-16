import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
    return (
        <View>
            <Text>NÃO ENCONTRADO</Text>
            <Link href={'/_sitemap'}>Go to Home</Link>
        </View >
    )
}