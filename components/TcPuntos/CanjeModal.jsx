import { View, Text, Image, Modal, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TcPuntoIcon from "./TcPuntoIcon";

function Row({ label, value, bold, color = "text-gray-800" }) {
  return (
    <View className="flex-row justify-between items-center py-0.5">
      <Text className="text-gray-500 text-sm">{label}</Text>
      <Text className={`text-sm ${bold ? "font-bold" : "font-medium"} ${color}`}>{value}</Text>
    </View>
  );
}

export default function CanjeModal({ producto, balance, visible, onClose, onConfirm, loading }) {
  const insets = useSafeAreaInsets();
  if (!producto) return null;
  const nuevoBalance = balance - producto.costo_puntos;

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end" style={{ paddingBottom: insets.bottom }}>
        <View className="bg-white rounded-t-3xl overflow-hidden">
          {producto.imagen_url ? (
            <Image
              source={{ uri: producto.imagen_url }}
              style={{ width: "100%", height: 200 }}
              resizeMode="cover"
            />
          ) : (
            <View className="bg-yellow-50 items-center py-10">
              <TcPuntoIcon size={72} />
            </View>
          )}

          <View className="p-6">
            <Text className="text-2xl font-bold text-gray-900">{producto.nombre}</Text>
            {!!producto.descripcion && (
              <Text className="text-gray-500 text-sm mt-1 mb-4">{producto.descripcion}</Text>
            )}

            <View className="bg-gray-50 rounded-2xl p-4 mb-5 mt-2">
              <Row label="Costo" value={`${Number(producto.costo_puntos).toLocaleString()} pts`} />
              <Row label="Tu saldo" value={`${balance} pts`} />
              <View className="h-px bg-gray-200 my-2" />
              <Row label="Saldo tras canje" value={`${nuevoBalance} pts`} bold color="text-yellow-600" />
            </View>

            <View className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-4 gap-1.5">
              <Text className="text-amber-800 text-xs font-bold mb-0.5">Antes de confirmar, ten en cuenta:</Text>
              <Text className="text-amber-700 text-xs leading-4">
                • Los canjes son <Text className="font-bold">definitivos</Text>: no se permiten cambios ni devoluciones una vez confirmados.
              </Text>
              <Text className="text-amber-700 text-xs leading-4">
                • Recibirás un correo electrónico con los detalles y las instrucciones para hacer efectivo tu canje.
              </Text>
              <Text className="text-amber-700 text-xs leading-4">
                • Asegúrate de que tu correo pueda recibir mensajes y revisa también la carpeta de spam o correo no deseado.
              </Text>
              <Text className="text-amber-700 text-xs leading-4">
                • Los TC Puntos descontados <Text className="font-bold">no se reintegran</Text> en caso de no poder hacer efectivo el canje por datos incorrectos.
              </Text>
              <Text className="text-amber-700 text-xs leading-4">
                • El tiempo de entrega o activación puede variar según el tipo de producto canjeado.
              </Text>
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={onClose}
                disabled={loading}
                className="flex-1 border border-gray-200 rounded-2xl py-3.5 items-center"
              >
                <Text className="text-gray-600 font-semibold">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={onConfirm}
                disabled={loading}
                className="flex-1 bg-yellow-400 rounded-2xl py-3.5 items-center active:bg-yellow-500"
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Text className="text-black font-bold">Confirmar canje</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
