import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import HeaderUser from "../UserDropdown/HeaderUser";

const PREGUNTAS = [
  {
    pregunta: "¿Cómo registro una cuenta bancaria?",
    respuesta:
      'Ve a la sección "Cuentas" en el menú inferior. Toca el botón para agregar una cuenta nueva, elige si es cuenta bancaria o QR, y completa los datos solicitados. Una vez guardada, podrás usarla en tus transferencias.',
  },
  {
    pregunta: "¿Cuánto tarda una transferencia?",
    respuesta:
      "El tiempo de procesamiento varía según el tipo de operación y el banco destino. En general, las transferencias se procesan en un plazo de 1 a 24 horas hábiles. Puedes ver el estado de tu operación en el historial.",
  },
  {
    pregunta: "¿Cómo veo el estado de mis transferencias?",
    respuesta:
      'Puedes consultar todas tus operaciones en la sección "Historial" accesible desde el menú hamburguesa. Ahí encontrarás el detalle de cada transferencia con su estado actual.',
  },
  {
    pregunta: "¿Cómo contacto al soporte?",
    respuesta:
      'Usa el botón "Chat" en el menú inferior para comunicarte directamente con nuestro equipo de atención al cliente. También puedes escribirnos a través de nuestros canales oficiales de WhatsApp o correo electrónico.',
  },
  {
    pregunta: "¿Cómo cambio mi contraseña?",
    respuesta:
      "Actualmente el cambio de contraseña se realiza a través del correo electrónico registrado. Usa la opción \"¿Olvidé mi contraseña?\" en la pantalla de inicio de sesión y sigue las instrucciones que recibirás en tu email.",
  },
  {
    pregunta: "¿Qué pasa si mi transferencia falla?",
    respuesta:
      "Si una transferencia no se completa, el monto no es debitado o es devuelto según el caso. Te recomendamos contactar a nuestro soporte con el número de operación para recibir asistencia personalizada.",
  },
  {
    pregunta: "¿Qué tipos de cambio maneja TransferCash?",
    respuesta:
      "Ofrecemos cambio entre soles peruanos (PEN) y bolivianos (BOB). La tasa de cambio se muestra antes de confirmar cualquier operación y puede variar según las condiciones del mercado.",
  },
  {
    pregunta: "¿Es seguro usar TransferCash?",
    respuesta:
      "Sí. Toda la información transmitida está cifrada con protocolos de seguridad estándar de la industria. Además, verificamos la identidad de nuestros usuarios a través de un proceso KYC para garantizar transacciones seguras.",
  },
];

function FAQ({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <View className="mb-3 border border-gray-200 rounded-2xl overflow-hidden">
      
      <Pressable
        onPress={() => setOpen((v) => !v)}
        className={`flex-row items-center justify-between px-4 py-4 ${
          open ? "bg-yellow-400" : "bg-white"
        }`}
      >
        <Text
          className="text-black font-semibold text-sm flex-1 pr-2"
          style={{ flexShrink: 1 }}
        >
          {item.pregunta}
        </Text>
        {open ? (
          <ChevronUp size={18} color="#000" />
        ) : (
          <ChevronDown size={18} color="#374151" />
        )}
      </Pressable>

      {open && (
        <View className="px-4 py-4 bg-gray-50 border-t border-gray-200">
          <Text className="text-gray-700 text-sm leading-6">{item.respuesta}</Text>
        </View>
      )}
    </View>
  );
}

export default function PreguntasFrecuentes() {
  return (
    <>


      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <HeaderUser title="Preguntas Frecuentes" subtitle="Respuestas a las preguntas más comunes" />
        <Text className="text-gray-500 text-sm mb-6">
          Toca una pregunta para ver la respuesta
        </Text>

        {PREGUNTAS.map((item, i) => (
          <FAQ key={i} item={item} />
        ))}
      </ScrollView>
    </>
  );
}
