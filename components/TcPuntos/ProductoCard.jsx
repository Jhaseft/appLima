import { View, Text, Image, Pressable } from "react-native";
import TcPuntoIcon from "./TcPuntoIcon";

export default function ProductoCard({ producto, balance, onCanjear }) {
  const sinSaldo = balance !== null && balance < producto.costo_puntos;
  const sinStock = producto.stock !== null && producto.stock <= 0;
  const disabled = sinSaldo || sinStock;

  return (
    <View className="bg-white rounded-2xl overflow-hidden mb-3 mx-4 border border-gray-100">
      {producto.imagen_url ? (
        <Image
          source={{ uri: producto.imagen_url }}
          style={{ width: "100%", height: 200 }}
          resizeMode="cover"
        />
      ) : (
        <View className="bg-yellow-50 items-center justify-center" style={{ height: 180 }}>
          <TcPuntoIcon size={64} />
        </View>
      )}

      <View className="p-4">
        <Text className="text-lg font-bold text-gray-900">{producto.nombre}</Text>
        {!!producto.descripcion && (
          <Text className="text-gray-500 text-sm mt-1 leading-5">{producto.descripcion}</Text>
        )}

        <View className="flex-row items-center justify-between mt-4">
          <View className="flex-row items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1.5">
            <TcPuntoIcon size={16} />
            <Text className="text-yellow-700 font-bold text-sm">
              {Number(producto.costo_puntos).toLocaleString()} pts
            </Text>
          </View>

          {sinStock ? (
            <View className="bg-gray-100 rounded-xl px-5 py-2.5">
              <Text className="text-gray-400 text-sm font-semibold">Sin stock</Text>
            </View>
          ) : (
            <Pressable
              onPress={() => onCanjear(producto)}
              disabled={disabled}
              className={`rounded-xl px-5 py-2.5 ${disabled ? "bg-gray-100" : "bg-yellow-400 active:bg-yellow-500"}`}
            >
              <Text className={`font-bold text-sm ${disabled ? "text-gray-400" : "text-black"}`}>
                {sinSaldo ? "Puntos insuficientes" : "Canjear"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
