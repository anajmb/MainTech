import Logo from "@/components/logo";
import SetaVoltar from "@/components/setaVoltar";
import { TabsStyles } from "@/styles/globalTabs";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Politica() {
    return (
        <ScrollView style={TabsStyles.container}>
            <Logo />

            <View style={TabsStyles.headerPrincipal}>
                <SetaVoltar />
                <View style={TabsStyles.conjHeaderPrincipal}>
                    <Text style={TabsStyles.tituloPrincipal}>Política de Privacidade</Text>
                    <Text style={TabsStyles.subtituloPrincipal}>Leia nossos termos</Text>
                </View>
            </View>

            <View style={TabsStyles.todosCard}>
                <View style={styles.card}>
                    <Text style={styles.text}>
                        A MainTech valoriza a sua privacidade e está comprometida em proteger os dados pessoais coletados durante a prestação dos nossos serviços de gestão e prevenção de máquinas industriais. Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos as informações que você nos fornece.
                    </Text>
                    <Text style={styles.sectionTitle}>1. Coleta de Dados</Text>
                    <Text style={styles.text}>
                        Coletamos informações pessoais e profissionais necessárias para oferecer nossos serviços, como nome, cargo, e-mail, telefone, dados da empresa e informações técnicas relacionadas aos equipamentos industriais.
                    </Text>
                    <Text style={styles.sectionTitle}>2. Uso dos Dados</Text>
                    <Text style={styles.text}>
                        Os dados coletados são utilizados para:
                        {"\n"}• Realizar a gestão preventiva e manutenção das máquinas industriais;
                        {"\n"}• Comunicar atualizações, relatórios e suporte técnico;
                        {"\n"}• Melhorar a qualidade dos serviços prestados;
                        {"\n"}• Atender obrigações legais e regulatórias.
                    </Text>
                    <Text style={styles.sectionTitle}>3. Compartilhamento de Dados</Text>
                    <Text style={styles.text}>
                        Compartilhamos informações apenas com parceiros e fornecedores essenciais para a execução dos serviços, sempre garantindo confidencialidade e segurança. Não vendemos ou alugamos dados pessoais a terceiros.
                    </Text>
                    <Text style={styles.sectionTitle}>4. Segurança dos Dados</Text>
                    <Text style={styles.text}>
                        Adotamos medidas técnicas e administrativas para proteger suas informações contra acessos não autorizados, vazamentos, perda ou alterações indevidas.
                    </Text>
                    <Text style={styles.sectionTitle}>5. Direitos dos Titulares</Text>
                    <Text style={styles.text}>
                        Você tem direito de acessar, corrigir, solicitar a exclusão dos seus dados pessoais, bem como revogar o consentimento para o tratamento, conforme previsto na legislação vigente.
                    </Text>
                    <Text style={styles.sectionTitle}>6. Retenção de Dados</Text>
                    <Text style={styles.text}>
                        Os dados serão mantidos pelo tempo necessário para cumprir as finalidades da coleta e as obrigações legais aplicáveis.
                    </Text>
                    <Text style={styles.sectionTitle}>7. Contato</Text>
                    <Text style={styles.text}>
                        Para esclarecer dúvidas, solicitar informações ou exercer seus direitos relacionados à privacidade, entre em contato conosco pelo e-mail: maintech@gmail.com.
                    </Text>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f7f7f7",
        flex: 1,
    },
    card: {
        backgroundColor: "#f7f7f7",
        borderRadius: 12,
        padding: 18,
        elevation: 22,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#222",
        textAlign: "center",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 16,
        marginBottom: 6,
        color: "#222",
    },
    text: {
        fontSize: 14,
        color: "#444",
        marginBottom: 8,
        lineHeight: 22,
    },
});