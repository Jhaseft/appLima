import { View, Text, ScrollView } from "react-native";
import { Stack } from "expo-router";
import HeaderUser from "../UserDropdown/HeaderUser";

const SECCIONES = [
  {
    titulo: "1. Uso de la plataforma",
    contenido:
      "Al utilizar TransferCash, el usuario acepta hacer uso de la plataforma de manera responsable y conforme a las leyes vigentes. Está prohibido el uso de la aplicación para actividades ilícitas, fraudulentas o que contravengan los términos aquí descritos.",
  },
  {
    titulo: "2. Privacidad de datos",
    contenido:
      "TransferCash recopila y almacena datos personales necesarios para operar el servicio de transferencias internacionales. Los datos son tratados con confidencialidad y no son compartidos con terceros sin consentimiento explícito del usuario, salvo obligación legal.",
  },
  {
    titulo: "3. Seguridad de la cuenta",
    contenido:
      "El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso. TransferCash no se hace responsable por accesos no autorizados derivados de la negligencia del usuario en el resguardo de su contraseña.",
  },
  {
    titulo: "4. Transacciones y comisiones",
    contenido:
      "Cada transferencia puede estar sujeta a comisiones y tasas de cambio que se informan antes de confirmar la operación. TransferCash se reserva el derecho de modificar las tarifas con previo aviso a los usuarios.",
  },
  {
    titulo: "5. Responsabilidades",
    contenido:
      "TransferCash no garantiza la disponibilidad ininterrumpida del servicio. En caso de fallas técnicas, se realizarán los esfuerzos razonables para restablecer el servicio en el menor tiempo posible.",
  },
  {
    titulo: "6. Modificaciones a las políticas",
    contenido:
      "TransferCash se reserva el derecho de actualizar estas políticas en cualquier momento. Los usuarios serán notificados de cambios significativos a través de la aplicación o correo electrónico registrado.",
  },
  {
    titulo: "7. Contacto",
    contenido:
      "Para consultas relacionadas con estas políticas, puede comunicarse con nuestro equipo de soporte a través de la sección de Chat en la aplicación o a través de los canales oficiales de TransferCash.",
  },
];

export default function Politicas() {
  return (
    <>
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
         <HeaderUser title="Politicas" subtitle="Términos y condiciones de uso" />
        <Text className="text-gray-500 text-sm mb-6">
          Última actualización: enero 2025
        </Text>

        {SECCIONES.map((sec, i) => (
          <View key={i} className="mb-6">
            <Text className="text-black text-base font-bold mb-2">
              {sec.titulo}
            </Text>
            <Text className="text-gray-700 text-sm leading-6">{sec.contenido}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
}
