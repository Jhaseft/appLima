import { View, Text, TouchableOpacity } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { RefreshCcw } from "lucide-react-native";
import { usePathname, useRouter } from "expo-router";

// FooterLayout.jsx
export default function FooterLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { name: "Inicio", icon: (props) => <Feather name="home" {...props} />, route: "/Home" },
    { name: "Cambiar", route: "/Cambiar", isCenter: true },
    { name: "Cuentas", icon: (props) => <MaterialIcons name="credit-card" {...props} />, route: "/Cuentas" },
  ];

  const handleNavigation = (route) => {
    if (route !== pathname) router.replace(route);
  };

  return (
    <View className="flex-1 bg-white">
    
      <View className="flex-1 mb-20">{children}</View>


      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex-row items-center justify-between h-20 mb-3">
        {tabs.map((tab, idx) => {
          const active = pathname === tab.route;

          if (tab.isCenter) {
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => handleNavigation(tab.route)}
                className="flex-1 items-center -mt-16 active:opacity-80"
              >
                <View className="relative items-center justify-center" style={{ height: 60 }}>
                  {active && <View className="absolute h-1 w-40 bg-indigo-500" style={{ top: 33 }} />}
                  <View className="w-[60px] h-[60px] rounded-full bg-indigo-500 items-center justify-center shadow-md">
                    <RefreshCcw size={28} color="white" />
                  </View>
                </View>
                <Text className={`text-sm font-medium mt-2  ${active ? "text-indigo-500" : "text-black"}`}>{tab.name}</Text>
                
              </TouchableOpacity>
            );
          }

          const Icon = tab.icon;
          return (
            <TouchableOpacity key={idx} onPress={() => handleNavigation(tab.route)} className="flex-1 items-center active:opacity-70">
              {active && <View className="h-1 w-16 bg-indigo-500 mb-3" />}
              {!active && <View className="h-1 w-10  mb-3" />}
              {Icon && <Icon size={30} color={active ? "#6366F1" : "black"} />}
              <Text className={`text-xs font-medium ${active ? "text-indigo-500 mb-3" : "text-black mb-5"}`}>{tab.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
