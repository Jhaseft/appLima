import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import HeaderUser from "../UserDropdown/HeaderUser";
import { HORARIOS_TEXTO } from "../api";

const PREGUNTAS = (horariosTxt) => [
  {
    pregunta: "¿Cómo subo mi QR?",
    respuesta:
      'En la app ve a la sección "Cuentas" y encontrarás la opción para subir tu código QR (Yape, Plin u otro). Solo sube una foto clara y legible del QR. Esta sección fue diseñada especialmente para guardar tu QR de forma segura y vincularlo directamente a tu perfil, así cada vez que realices una operación el dinero llega exactamente al destino correcto sin riesgo de errores.',
  },
  {
    pregunta: "¿Es confiable o qué tan seguro es la app?",
    respuesta:
      "TransferCash es una aplicación muy confiable. Toda tu información viaja cifrada con protocolos de seguridad de nivel bancario, verificamos la identidad de cada usuario antes de permitir operaciones, y contamos con sistemas de monitoreo en tiempo real para detectar cualquier actividad inusual. Además, operamos de forma formal y registrada, lo que te da la tranquilidad de que tu dinero está en buenas manos.",
  },
  {
    pregunta: "¿Por qué es necesario poner cuenta de origen?",
    respuesta:
      "La cuenta de origen nos permite verificar de dónde proviene el dinero enviado. Es un requisito indispensable para confirmar que la transferencia fue realizada por ti, prevenir operaciones fraudulentas y garantizar la trazabilidad de cada transacción. Sin este dato no podemos validar ni acreditar tu operación.",
  },
  {
    pregunta: "¿La app tiene acceso a mis cuentas bancarias?",
    respuesta:
      "No. TransferCash no tiene acceso a tus cuentas bancarias ni a tus aplicaciones de pago. Solo usamos el número de cuenta o QR que tú nos proporcionas como destino para enviar el dinero. En ningún momento accedemos, consultamos ni movemos fondos de tus cuentas directamente.",
  },
  {
    pregunta: "¿Cuánto demoran en llegar el dinero a mi QR?",
    respuesta:
      "Una vez que confirmamos la recepción del dinero de tu parte, procesamos la transferencia a tu QR en el menor tiempo posible, generalmente en cuestión de minutos durante el horario de atención. En momentos de alta demanda el proceso puede tomar un poco más, pero siempre trabajamos para que sea lo más rápido posible.",
  },
  {
    pregunta: "¿Cobran comisión por usar la app?",
    respuesta:
      "No cobramos ninguna comisión por usar la app. El uso de la aplicación es completamente gratuito para todos nuestros usuarios.",
  },
  {
    pregunta: "¿En cuánto tiempo puedo venir a recoger el efectivo que mandé por la app?",
    respuesta:
      `Puedes acercarte a nuestra oficina en Cochabamba (Av. Villazón, calle Los Paraisos – frente a UDABOL) dentro del horario de atención:\n${horariosTxt}\n\nUna vez confirmada tu operación, el efectivo está disponible para retiro.`,
  },
  {
    pregunta: "¿Cuáles son los horarios de atención o hasta qué hora trabajan dando en efectivo y por QR?",
    respuesta:
      `Nuestros horarios de atención son:\n${horariosTxt}\n\nLas entregas en efectivo se realizan de lunes a sábado. Los domingos atendemos únicamente por transferencia o QR, no en efectivo.`,
  },
  {
    pregunta: "¿Dónde se encuentra nuestra oficina?",
    respuesta:
      `Nuestra oficina está ubicada en Cochabamba, Bolivia: Av. Villazón, calle Los Paraisos – frente a UDABOL. Puedes visitarnos en el horario de atención:\n${horariosTxt}\n\nTambién puedes contactarnos por WhatsApp Bolivia: +591 60759545 o WhatsApp Perú: +51 907844210.`,
  },
  {
    pregunta: "¿Puedo poner el QR de otra persona para recibir el dinero?",
    respuesta:
      "Sí es posible registrar el QR de otra persona, aunque no lo recomendamos. Al poner un QR de un tercero, el dinero llegará a esa cuenta y no a la tuya, lo que puede generar complicaciones si necesitas demostrar que recibiste el dinero. Para evitar problemas, siempre es mejor usar tu propio QR.",
  },
  {
    pregunta: "¿La cuenta de origen puede ser el número de Yape de mis padres si soy menor de edad?",
    respuesta:
      "Sí, si eres menor de edad puedes indicar el número de Yape de tus padres o tutor como cuenta de origen, siempre que ellos sean quienes realicen el envío. Esto nos permite verificar correctamente el origen del dinero y validar la operación sin inconvenientes.",
  },
  {
    pregunta: "¿Soy menor de edad, igual puedo usar la app?",
    respuesta:
      "Sí puedes usar la app siendo menor de edad, pero debe ser siempre bajo la supervisión de un adulto responsable (padre, madre o tutor). El adulto debe estar presente al momento de registrarse y realizar las operaciones para asegurarse de que todo se haga correctamente.",
  },
  {
    pregunta: "¿Por qué no puedo subir mi comprobante a la app?, sale error.",
    respuesta:
      "El error al subir el comprobante puede deberse a que la imagen no cumple con los requisitos de formato o tamaño. Asegúrate de subir una foto clara, en formato JPG o PNG, y que el archivo no sea demasiado pesado. Si el problema persiste, contáctanos.",
  },
  {
    pregunta: "¿Cuántos comprobantes puedo subir en una transacción?",
    respuesta:
      "Puedes subir un máximo de 5 comprobantes por transacción. Si realizaste varios envíos parciales, puedes adjuntar cada uno de los comprobantes correspondientes, siempre que no superes ese límite.",
  },
  {
    pregunta: "¿Cuál es el mínimo y máximo que puedo mandar?",
    respuesta:
      "Los montos están configurados de la siguiente manera:\n• Envíos Perú → Bolivia: mínimo S/ 20\n• Envíos Bolivia → Perú: mínimo Bs 60\n\nPara operaciones que superen los umbrales de verificación, se solicitará el proceso KYC. Puedes consultar los límites exactos dentro de la app antes de realizar tu transferencia.",
  },
  {
    pregunta: "¿A partir de qué monto pide KYC?",
    respuesta:
      "La verificación de identidad (KYC) se activa cuando el monto de tu operación supera los siguientes límites:\n• Envíos Perú → Bolivia: a partir de S/ 3,000\n• Envíos Bolivia → Perú: a partir de Bs 10,000\n\nSi tu operación está por debajo de esos montos, no necesitas completar el KYC.",
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

        {PREGUNTAS(HORARIOS_TEXTO).map((item, i) => (
          <FAQ key={i} item={item} />
        ))}
      </ScrollView>
    </>
  );
}
