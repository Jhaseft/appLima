import { Tabs } from "expo-router";
import FooterBar from "../../components/FooterLayout/FooterBar";
import { colors } from "../../theme/colors";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FooterBar {...props} />}
      screenOptions={{
        animation: "fade",
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="Home" />
      <Tabs.Screen name="Cuentas" />
      <Tabs.Screen name="Cambiar" />
      <Tabs.Screen name="TcPuntos" />
    </Tabs>
  );
}
