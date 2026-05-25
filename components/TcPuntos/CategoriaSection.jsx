import { useState } from "react";
import { View, Text, Image, Pressable, LayoutAnimation, Platform, UIManager } from "react-native";
import ProductoCard from "./ProductoCard";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CategoriaSection({ categoria, balance, onCanjear }) {
  const [open, setOpen] = useState(false);

  if (!categoria.productos || categoria.productos.length === 0) return null;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((v) => !v);
  };

  return (
    <View className="mb-3">
      <Pressable onPress={toggle} className="mx-4 rounded-2xl overflow-hidden active:opacity-80">
        {categoria.imagen_url ? (
          <View>
            <Image
              source={{ uri: categoria.imagen_url }}
              style={{ width: "100%", height: 140 }}
              resizeMode="cover"
            />
            <View
              className="absolute bottom-0 left-0 right-0 px-4 py-3 flex-row items-end justify-between"
              style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            >
              <View className="flex-1">
                <Text className="text-white text-xl font-bold">{categoria.nombre}</Text>
                {!!categoria.descripcion && (
                  <Text className="text-white/80 text-xs mt-0.5">{categoria.descripcion}</Text>
                )}
              </View>
              <Text className="text-white text-2xl ml-2" style={{ lineHeight: 28 }}>
                {open ? "▾" : "▸"}
              </Text>
            </View>
          </View>
        ) : (
          <View className="bg-yellow-400 px-5 py-5 rounded-2xl flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-black text-xl font-bold">{categoria.nombre}</Text>
              {!!categoria.descripcion && (
                <Text className="text-black/70 text-sm mt-0.5">{categoria.descripcion}</Text>
              )}
            </View>
            <Text className="text-black text-2xl ml-2" style={{ lineHeight: 28 }}>
              {open ? "▾" : "▸"}
            </Text>
          </View>
        )}
      </Pressable>

      {open && (
        <View className="mt-3">
          {categoria.productos.map((p) => (
            <ProductoCard key={p.id} producto={p} balance={balance} onCanjear={onCanjear} />
          ))}
        </View>
      )}
    </View>
  );
}
