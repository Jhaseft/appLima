import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  Animated,
  Linking,
} from "react-native";
import Constants from "expo-constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname } from "expo-router";
import { ArrowLeft, UserCircle, LogOut, Smartphone, UserRoundCog, Bell, Moon, Languages } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { NAV_ITEMS, INFO_ITEMS, REDES } from "./data/menuItems";
import MenuRow from "./MenuRow";
import MenuToggleRow from "./MenuToggleRow";
import SectionTitle from "./SectionTitle";
import ProfileHeader from "./ProfileHeader";
import CompletarBadge from "./CompletarBadge";
import { usePreferences } from "./hooks/usePreferences";

const AV = 82;
const FLY = 54;
const HEADER_BAR = 56;

export default function DrawerMenu({ visible, onClose, user, onLogout, router, origin }) {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { notifications, toggleNotifications, darkMode, setDarkMode } = usePreferences();

  const t = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [render, setRender] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (visible) {
      setRender(true);
      setSettled(false);
      scrollY.setValue(0);
      t.setValue(0);
      Animated.spring(t, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start(({ finished }) => finished && setSettled(true));
    }
  }, [visible]);

  const runClose = (after) => {
    setSettled(false);
    Animated.timing(t, { toValue: 0, duration: 260, useNativeDriver: true }).start(() => {
      setRender(false);
      onClose();
      after && after();
    });
  };

  const navigate = (route) => {
    if (route === pathname) return runClose();
    runClose(() => setTimeout(() => router.replace(route), 40));
  };

  const targetCX = 18.5 + AV / 2;
  const targetCY = insets.top + HEADER_BAR + 8 + AV / 2;
  const originCX = origin?.cx ?? 25;
  const originCY = origin?.cy ?? insets.top + 28;

  const flyX = t.interpolate({ inputRange: [0, 1], outputRange: [originCX - FLY / 2, targetCX - FLY / 2] });
  const flyY = t.interpolate({ inputRange: [0, 1], outputRange: [originCY - FLY / 2, targetCY - FLY / 2] });
  const flyScale = t.interpolate({ inputRange: [0, 1], outputRange: [30 / FLY, 1] });

  const compactName = scrollY.interpolate({
    inputRange: [50, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const nombre = user ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() : "";
  const needsProfile = !!user?.needs_profile;

  return (
    <Modal transparent visible={render} animationType="none" onRequestClose={() => runClose()}>
      <View style={{ flex: 1 }}>
        <Animated.View style={{ flex: 1, opacity: t }} className="bg-background">
          <View
            style={{ paddingTop: insets.top, height: insets.top + HEADER_BAR }}
            className="absolute top-0 left-0 right-0 z-10 flex-row items-center px-4 bg-background border-b border-border"
          >
            <Pressable onPress={() => runClose()} hitSlop={10} className="pr-3">
              <ArrowLeft size={26} color={colors.text} />
            </Pressable>
            <Animated.Text
              style={{ opacity: compactName }}
              numberOfLines={1}
              className="flex-1 text-text text-lg font-lm-bold"
            >
              {nombre}
            </Animated.Text>
          </View>

          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            contentContainerStyle={{
              paddingTop: insets.top + HEADER_BAR,
              paddingBottom: insets.bottom + 12,
            }}
          >
            <ProfileHeader user={user} scrollY={scrollY} settled={settled} />

            <SectionTitle title="Mi cuenta" />
            <MenuRow
              label="Detalles de perfil"
              icon={UserCircle}
              danger={needsProfile}
              trailing={needsProfile ? <CompletarBadge /> : null}
              onPress={() => navigate(needsProfile ? "/CompleteProfile" : "/MiCuenta")}
            />

            <SectionTitle title="Navegación" />
            {NAV_ITEMS.map((item) => (
              <MenuRow
                key={item.route}
                label={item.label}
                icon={item.icon}
                svgIcon={item.svg}
                onPress={() => navigate(item.route)}
              />
            ))}

            <SectionTitle title="Información y ayuda" />
            {INFO_ITEMS.map((item) => (
              <MenuRow
                key={item.url ?? item.route}
                label={item.label}
                icon={item.icon}
                onPress={() => (item.url ? runClose(() => Linking.openURL(item.url)) : navigate(item.route))}
              />
            ))}

            <SectionTitle title="Preferencias" />
            <MenuToggleRow
              label="Notificaciones"
              icon={Bell}
              value={notifications}
              onValueChange={toggleNotifications}
            />
            <MenuToggleRow
              label="Modo oscuro"
              icon={Moon}
              value={darkMode}
              onValueChange={setDarkMode}
            />
            <MenuRow
              label="Idioma"
              icon={Languages}
              onPress={() => navigate("/Idioma")}
            />

            <SectionTitle title="Sesión" />
            <MenuRow
              label="Cerrar sesión"
              icon={LogOut}
              danger
              onPress={() => runClose(() => setTimeout(onLogout, 150))}
            />

            <View className="flex-row justify-center gap-5 py-7">
              {REDES.map((red) => (
                <Pressable
                  key={red.key}
                  onPress={() => Linking.openURL(red.url)}
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: red.color + "18" }}
                >
                  <red.icon size={20} color={red.color} />
                </Pressable>
              ))}
            </View>

            <View className="flex-row items-center justify-center pb-4">
              <Text className="text-text-muted text-xs font-lm-medium mr-2">
                Versión: {Constants.expoConfig?.version ?? "—"}
              </Text>
              <Smartphone size={14} color={colors.textMuted} />
            </View>
          </Animated.ScrollView>
        </Animated.View>

        {!settled && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: FLY,
              height: FLY,
              transform: [{ translateX: flyX }, { translateY: flyY }, { scale: flyScale }],
            }}
          >
            <UserRoundCog size={FLY} color={colors.text} />
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}
