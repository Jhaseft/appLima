import { View, Text } from "react-native";
import Svg, { Line, Circle, Text as SvgText, Rect } from "react-native-svg";
import { colors } from "../../theme/colors";
import GraficoSkeleton from "./GraficoSkeleton";


const SVG_FONT = "LemonMilkPro";
const chartHeight = 180;
const chartWidth = 320;
const padding = 50;
const ticks = 15;

export default function GraficoLineas({ data, loading }) {
  if (loading || !data || data.length === 0) {
    return <GraficoSkeleton />;
  }

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

  const tickValues = Array.from({ length: ticks }, (_, i) =>
    minValue + ((maxValue - minValue) / (ticks - 1)) * i
  );

  const latestCompra = data[data.length - 1].compra;
  const latestVenta = data[data.length - 1].venta;

  return (
    <View className="mt-8 bg-background rounded-3xl border border-border p-4 items-center">
      <View className="flex-row w-full mt-4 gap-3">
        <View className="flex-1 items-center bg-surface py-3 rounded-2xl">
          <Text className="text-text-muted text-xs mb-1 font-sans">Compra actual</Text>
          <Text className="text-text font-lm-bold text-lg">{latestCompra}</Text>
        </View>
        <View className="flex-1 items-center bg-primary-light py-3 rounded-2xl">
          <Text className="text-text-muted text-xs mb-1 font-sans">Venta actual</Text>
          <Text className="text-primary-dark font-lm-bold text-lg">{latestVenta}</Text>
        </View>
      </View>

      <View className="flex-row justify-center gap-6 mt-3">
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 bg-text rounded-full" />
          <Text className="text-text-muted text-sm font-sans">Compra</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 bg-primary rounded-full" />
          <Text className="text-text-muted text-sm font-sans">Venta</Text>
        </View>
      </View>

      <View className="w-full mb-4 mt-2">
        <Text className="text-xs text-text-muted font-lm-medium uppercase mb-1">Historial</Text>
        <Text className="text-lg font-lm-bold text-text">Compra vs Venta</Text>
      </View>

      <Svg height={chartHeight + padding + 30} width={chartWidth}>
        <Rect
          x={0}
          y={0}
          width={chartWidth}
          height={chartHeight + padding}
          fill={colors.surface}
          rx={10}
        />

        {tickValues.map((val, i) => {
          const y = scaleY(val);
          return [
            <Line
              key={`line-${i}`}
              x1={padding}
              y1={y}
              x2={chartWidth - 10}
              y2={y}
              stroke={colors.border}
              strokeWidth="1"
            />,
            <SvgText
              key={`text-${i}`}
              x={padding - 5}
              y={y + 4}
              fontSize="10"
              fontFamily={SVG_FONT}
              fill={colors.textMuted}
              textAnchor="end"
            >
              {val.toFixed(2)}
            </SvgText>,
          ];
        })}

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
              stroke={colors.text}
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}

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
              stroke={colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}

        {data.map((item, index) => {
          const x = padding + index * spacingX;
          const y = scaleY(parseFloat(item.compra));
          return <Circle key={`c-${index}`} cx={x} cy={y} r={4} fill={colors.text} />;
        })}

        {data.map((item, index) => {
          const x = padding + index * spacingX;
          const y = scaleY(parseFloat(item.venta));
          return <Circle key={`v-${index}`} cx={x} cy={y} r={4} fill={colors.primary} />;
        })}

        {data.map((item, index) => {
          const x = padding + index * spacingX;
          return (
            <SvgText
              key={`fecha-${index}`}
              x={x}
              y={chartHeight + padding / 2 + 15}
              fontSize="10"
              fontFamily={SVG_FONT}
              fill={colors.textMuted}
              textAnchor="middle"
            >
              {item.fecha_actualizacion.split(" ")[0]}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}
