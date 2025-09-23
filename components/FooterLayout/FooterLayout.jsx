import { View,ScrollView, Text, TouchableOpacity, Image } from "react-native";
import { Feather , MaterialIcons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";

// FooterLayout.jsx
export default function FooterLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { name: "Inicio", icon: (props) => <Feather name="home" {...props} />, route: "/Home" },
    { name: "Cambiar", route: "/Cambiar", isCenter: true, image: "https://res.cloudinary.com/dnbklbswg/image/upload/v1756305635/logo_n6nqqr.jpg" },
    { name: "Cuentas", icon: (props) => <MaterialIcons name="credit-card" {...props} />, route: "/Cuentas" },
  ];

  const handleNavigation = (route) => {
    if (route !== pathname) router.replace(route);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Contenido principal */}
      <View className="flex-1  mb-24">{children}</View>

      {/* Barra inferior */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex-row items-center justify-between" style={{ height: 80 }}>
        {tabs.map((tab, idx) => {
          const active = pathname === tab.route;

          if (tab.isCenter) {
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => handleNavigation(tab.route)}
                className="items-center -mt-10 active:opacity-80"
                style={{ flex: 1 }}
              >
                <View style={{ width: 60, height: 60, borderRadius: 30, overflow: "hidden" }}>
                  <Image source={{ uri: tab.image }} style={{ width: "100%", height: "100%", resizeMode: "cover" }} />
                </View>
                <Text className={`text-xs font-medium mt-1 ${active ? "text-indigo-500" : "text-black"}`}>{tab.name}</Text>
              </TouchableOpacity>
            );
          }

          const Icon = tab.icon;
          return (
            <TouchableOpacity key={idx} onPress={() => handleNavigation(tab.route)} className="flex-1 items-center py-3 active:opacity-70">
              {Icon && <Icon size={30} color={active ? "#6366F1" : "black"} />}
              <Text className={`text-xs font-medium ${active ? "text-indigo-500" : "text-black"}`}>{tab.name}</Text>
              {active && <View className="h-0.5 w-10 bg-indigo-500 rounded-full mt-1" />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
