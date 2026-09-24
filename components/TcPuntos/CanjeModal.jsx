import { View, Text, Image, Modal, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TcPuntoIcon from "./TcPuntoIcon";
import ActionOverlay from "../ActionOverlay";

function Row({ label, value, bold, color = "text-text" }) {
  return (
    <View className="flex-row justify-between items-center py-0.5">
      <Text className="text-text-muted text-sm">{label}</Text>
      <Text className={`text-sm ${bold ? "font-lm-bold" : "font-lm-medium"} ${color}`}>{value}</Text>
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
        <View className="bg-background rounded-t-3xl overflow-hidden">
          {producto.imagen_url ? (
            <Image
              source={{ uri: producto.imagen_url }}
              style={{ width: "100%", height: 200 }}
              resizeMode="cover"
            />
          ) : (
            <View className="bg-primary-light items-center py-10">
              <TcPuntoIcon size={72} />
            </View>
          )}

          <View className="p-6">
            <Text className="text-2xl font-lm-bold text-text">{producto.nombre}</Text>
            {!!producto.descripcion && (
              <Text className="text-text-muted text-sm mt-1 mb-4">{producto.descripcion}</Text>
            )}

            <View className="bg-surface rounded-2xl p-4 mb-5 mt-2">
              <Row label="Costo" value={`${Number(producto.costo_puntos).toLocaleString()} pts`} />
              <Row label="Tu saldo" value={`${balance} pts`} />
              <View className="h-px bg-border my-2" />
              <Row label="Saldo tras canje" value={`${nuevoBalance} pts`} bold color="text-primary-dark" />
            </View>

            <View className="bg-primary-light border border-primary-accent rounded-2xl px-4 py-3 mb-4 gap-1.5">
              <Text className="text-primary-dark text-xs font-lm-bold mb-0.5">Antes de confirmar, ten en cuenta:</Text>
              <Text className="text-primary-dark text-xs leading-4">
                • Los canjes son <Text className="font-lm-bold">definitivos</Text>: no se permiten cambios ni devoluciones una vez confirmados.
              </Text>
              <Text className="text-primary-dark text-xs leading-4">
                • Recibirás un correo electrónico con los detalles y las instrucciones para hacer efectivo tu canje.
              </Text>
              <Text className="text-primary-dark text-xs leading-4">
                • Asegúrate de que tu correo pueda recibir mensajes y revisa también la carpeta de spam o correo no deseado.
              </Text>
              <Text className="text-primary-dark text-xs leading-4">
                • Los TC Puntos descontados <Text className="font-lm-bold">no se reintegran</Text> en caso de no poder hacer efectivo el canje por datos incorrectos.
              </Text>
              <Text className="text-primary-dark text-xs leading-4">
                • El tiempo de entrega o activación puede variar según el tipo de producto canjeado.
              </Text>
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={onClose}
                disabled={loading}
                className="flex-1 border border-border rounded-2xl py-3.5 items-center"
              >
                <Text className="text-text-muted font-lm-medium">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={onConfirm}
                disabled={loading}
                className="flex-1 bg-primary rounded-2xl py-3.5 items-center active:bg-primary-accent"
              >
                <Text className="text-text font-lm-bold">Confirmar canje</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <ActionOverlay visible={loading} mensaje="Procesando canje..." />
      </View>
    </Modal>
  );
}
