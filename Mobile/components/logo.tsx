import { Image, StyleSheet, View } from "react-native";


export default function Logo () {
    return (
        <View>
            <Image style={styles.logoImage} source={require("../assets/images/LogoVermelha2.png")} resizeMode="cover" />
        </View>
    )
}

const styles = StyleSheet.create({
    logoImage: {
    height: 60,
    width: 200,
    marginLeft: 80,
    marginBottom: 10
  },
})