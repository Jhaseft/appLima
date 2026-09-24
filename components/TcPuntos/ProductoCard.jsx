import { View, Text, Image, Pressable } from "react-native";
import TcPuntoIcon from "./TcPuntoIcon";

export default function ProductoCard({ producto, balance, onCanjear }) {
  const sinSaldo = balance !== null && balance < producto.costo_puntos;
  const sinStock = producto.stock !== null && producto.stock <= 0;
  const disabled = sinSaldo || sinStock;

  return (
    <View className="bg-background rounded-2xl overflow-hidden mb-3 mx-4 border border-border">
      {producto.imagen_url ? (
        <Image
          source={{ uri: producto.imagen_url }}
          style={{ width: "100%", height: 200 }}
          resizeMode="cover"
        />
      ) : (
        <View className="bg-primary-light items-center justify-center" style={{ height: 180 }}>
          <TcPuntoIcon size={64} />
        </View>
      )}

      <View className="p-4">
        <Text className="text-lg font-lm-bold text-text">{producto.nombre}</Text>
        {!!producto.descripcion && (
          <Text className="text-text-muted text-sm mt-1 leading-5">{producto.descripcion}</Text>
        )}

        <View className="flex-row items-center justify-between mt-4">
          <View className="flex-row items-center gap-1.5 bg-primary-light border border-primary-accent rounded-full px-3 py-1.5">
            <TcPuntoIcon size={16} />
            <Text className="text-primary-dark font-lm-bold text-sm">
              {Number(producto.costo_puntos).toLocaleString()} pts
            </Text>
          </View>

          {sinStock ? (
            <View className="bg-surface rounded-xl px-5 py-2.5">
              <Text className="text-text-muted text-sm font-lm-medium">Sin stock</Text>
            </View>
          ) : (
            <Pressable
              onPress={() => onCanjear(producto)}
              disabled={disabled}
              className={`rounded-xl px-5 py-2.5 ${disabled ? "bg-surface" : "bg-primary active:bg-primary-accent"}`}
            >
              <Text className={`font-lm-bold text-sm ${disabled ? "text-text-muted" : "text-text"}`}>
                {sinSaldo ? "Puntos insuficientes" : "Canjear"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
