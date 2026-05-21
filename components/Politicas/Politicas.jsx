import { View, Text, ScrollView } from "react-native";
import { Stack } from "expo-router";
import HeaderUser from "../UserDropdown/HeaderUser";

const SECCIONES = [
  {
    titulo: "Objeto",
    contenido:
      "El presente documento regula el uso de cuentas bancarias, billeteras electrónicas y demás instrumentos financieros registrados y utilizados por los usuarios dentro de la plataforma web Transfer Cash (www.transfercash.click).",
  },
  {
    titulo: "Declaración del usuario",
    contenido:
      "El usuario declara bajo juramento que toda cuenta bancaria, billetera digital o medio de pago registrado en la plataforma es de su exclusiva titularidad, y que se encuentra habilitado legalmente para operar con dichos instrumentos.",
  },
  {
    titulo: "Cesión de fondos",
    contenido:
      "Al realizar una operación en la plataforma, el usuario cede expresamente los fondos involucrados al beneficiario designado por él mismo, deslindando de responsabilidad a Transfer Cash por la ejecución de la transferencia conforme a las instrucciones proporcionadas.",
  },
  {
    titulo: "Usuarios",
    contenido:
      "Se considera \"usuario\" a toda persona natural que interactúe dentro de la plataforma web Transfer Cash, ya sea como cliente, remitente, destinatario u operador autorizado.",
  },
  {
    titulo: "Prohibiciones",
    contenido:
      "Los usuarios se comprometen a no registrar cuentas o billeteras de terceros sin autorización expresa, ni a utilizar la plataforma para fines ilícitos, fraudulentos, o en contravención de la normativa vigente.",
  },
  {
    titulo: "Responsabilidad del usuario",
    contenido:
      "Transfer Cash no será responsable por pérdidas, retrasos o controversias derivadas del uso incorrecto o fraudulento de los datos bancarios ingresados por el usuario.",
  },
  {
    titulo: "Confidencialidad y seguridad",
    contenido:
      "El usuario se compromete a proteger su información personal y credenciales de acceso. Transfer Cash recomienda no compartir contraseñas ni información sensible con terceros.",
  },
  {
    titulo: "Modificaciones",
    contenido:
      "Transfer Cash se reserva el derecho de modificar, actualizar o complementar los presentes términos y condiciones en cualquier momento.",
  },
  {
    titulo: "Jurisdicción",
    contenido:
      "Cualquier controversia será sometida a la jurisdicción de los tribunales de la ciudad de Lima, Perú.",
  },
  {
    titulo: "Aceptación",
    contenido:
      "El uso de la plataforma www.transfercash.click implica la aceptación total de los presentes términos y condiciones.",
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
         <HeaderUser title="Politicas" subtitle="Cuentas y Billeteras - Transfer Cash" />
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
