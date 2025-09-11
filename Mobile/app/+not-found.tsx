import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
    return (
        <View>
            <Link href={'/_sitemap'}>Go to Home</Link>
        </View >
    )
}