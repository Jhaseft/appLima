import { Tabs } from "expo-router";
import FooterBar from "../../components/FooterLayout/FooterBar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FooterBar {...props} />}
      screenOptions={{
        animation: "fade",
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#FFFFFF",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        sceneStyle: { backgroundColor: "#FFFFFF" },
      }}
    >
      <Tabs.Screen name="Home" />
      <Tabs.Screen name="Cuentas" />
      <Tabs.Screen name="Cambiar" />
      <Tabs.Screen name="TcPuntos" />
    </Tabs>
  );
}
