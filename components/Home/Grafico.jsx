import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Line, Circle, Text as SvgText, Rect } from "react-native-svg";

export default function GraficoLineas() {
  const [data, setData] = useState(null);

  const loadData = async () => {
    try {
      const cached = await AsyncStorage.getItem("tipoCambio");
      const lastUpdate = await AsyncStorage.getItem("tipoCambioUpdate");

      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (cached && lastUpdate && now - parseInt(lastUpdate) < fiveMinutes) {
        // Usar lo guardado
        setData(JSON.parse(cached));
      } else {
        // Pedir a la API y guardar
        const res = await fetch("https://panel.transfercash.click/api/tipo-cambio/historial");
        const json = await res.json();
        const sliced = json.slice(-4); // últimos 4

        setData(sliced);
        await AsyncStorage.setItem("tipoCambio", JSON.stringify(sliced));
        await AsyncStorage.setItem("tipoCambioUpdate", now.toString());
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // === Configuración de gráfico ===
  const chartHeight = 180;
  const chartWidth = 320;
  const padding = 50;

  const maxValue = Math.max(
    ...data.map((d) => Math.max(parseFloat(d.compra), parseFloat(d.venta)))
  );
  const minValue = Math.min(
    ...data.map((d) => Math.min(parseFloat(d.compra), parseFloat(d.venta)))
  );

  const scaleY = (value) =>
    chartHeight -
      ((value - minValue) / (maxValue - minValue)) * chartHeight +
      padding / 2;

  const spacingX = (chartWidth - padding * 1.5) / (data.length - 1);

  const ticks = 5;
  const tickValues = Array.from({ length: ticks }, (_, i) =>
    minValue + ((maxValue - minValue) / (ticks - 1)) * i
  );

  const latestCompra = data[data.length - 1].compra;
  const latestVenta = data[data.length - 1].venta;

  return (
    <View className="items-center mt-6">
      <Text className="text-2xl font-bold text-black mb-4">Compra vs Venta</Text>
      <Svg height={chartHeight + padding + 30} width={chartWidth}>
        <Rect
          x={0}
          y={0}
          width={chartWidth}
          height={chartHeight + padding}
          fill="#F3F4F6"
          rx={10}
        />

        {/* Líneas de referencia Y */}
        {tickValues.map((val, i) => {
          const y = scaleY(val);
          return [
            <Line
              key={`line-${i}`}
              x1={padding}
              y1={y}
              x2={chartWidth - 10}
              y2={y}
              stroke="#D1D5DB"
              strokeWidth="1"
            />,
            <SvgText
              key={`text-${i}`}
              x={padding - 5}
              y={y + 4}
              fontSize="10"
              fill="#374151"
              textAnchor="end"
            >
              {val.toFixed(2)}
            </SvgText>
          ];
        })}

        {/* Líneas Compra */}
        {data.map((item, index) => {
          if (index === 0) return null;
          const x1 = padding + (index - 1) * spacingX;
          const y1 = scaleY(parseFloat(data[index - 1].compra));
          const x2 = padding + index * spacingX;
          const y2 = scaleY(parseFloat(item.compra));
          return (
            <Line
              key={`compra-${index}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#3B82F6"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}

        {/* Líneas Venta */}
        {data.map((item, index) => {
          if (index === 0) return null;
          const x1 = padding + (index - 1) * spacingX;
          const y1 = scaleY(parseFloat(data[index - 1].venta));
          const x2 = padding + index * spacingX;
          const y2 = scaleY(parseFloat(item.venta));
          return (
            <Line
              key={`venta-${index}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#F59E0B"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}

        {/* Puntos Compra */}
        {data.map((item, index) => {
          const x = padding + index * spacingX;
          const y = scaleY(parseFloat(item.compra));
          return <Circle key={`c-${index}`} cx={x} cy={y} r={4} fill="#3B82F6" />;
        })}

        {/* Puntos Venta */}
        {data.map((item, index) => {
          const x = padding + index * spacingX;
          const y = scaleY(parseFloat(item.venta));
          return <Circle key={`v-${index}`} cx={x} cy={y} r={4} fill="#F59E0B" />;
        })}

        {/* Fechas */}
        {data.map((item, index) => {
          const x = padding + index * spacingX;
          return (
            <SvgText
              key={`fecha-${index}`}
              x={x}
              y={chartHeight + padding / 2 + 15}
              fontSize="10"
              fill="#374151"
              textAnchor="middle"
            >
              {item.fecha_actualizacion.split(" ")[0]}
            </SvgText>
          );
        })}
      </Svg>

      {/* Leyenda */}
      <View className="flex-row justify-center gap-6 mt-3">
        <View className="flex-row items-center space-x-1">
          <View className="w-4 h-4 bg-blue-500 rounded" />
          <Text className="text-gray-700">Compra</Text>
        </View>
        <View className="flex-row items-center space-x-1">
          <View className="w-4 h-4 bg-yellow-500 rounded" />
          <Text className="text-gray-700">Venta</Text>
        </View>
      </View>

      {/* Valores actuales */}
      <View className="flex-row justify-center mt-4 space-x-6 gap-6 bg-white p-4 rounded-xl shadow">
        <View className="items-center">
          <Text className="text-gray-500 text-sm">Compra actual</Text>
          <Text className="text-blue-600 font-bold text-lg">{latestCompra}</Text>
        </View>
        <View className="items-center">
          <Text className="text-gray-500 text-sm">Venta actual</Text>
          <Text className="text-yellow-600 font-bold text-lg">{latestVenta}</Text>
        </View>
      </View>
    </View>
  );
}
