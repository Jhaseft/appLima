import { useState } from "react";
import { View, FlatList, useWindowDimensions } from "react-native";
import StatCard from "./StatCard";
import StatsSkeleton from "./StatsSkeleton";

import BolisIcon from "../../assets/HomeIcons/ResumenUsuario/bolis.svg";
import SolesIcon from "../../assets/HomeIcons/ResumenUsuario/peruanos.svg";
import TransIcon from "../../assets/HomeIcons/ResumenUsuario/total_ops.svg";

const H_PADDING = 48;
const GAP = 12;
const CARD_FRACTION = 0.62;

const format = (n) => Number(n || 0).toLocaleString("es-PE");

export default function StatsCarousel({ resumen, loading }) {
  const { width } = useWindowDimensions();
  const cardW = (width - H_PADDING) * CARD_FRACTION;
  const [index, setIndex] = useState(0);

  if (loading || !resumen) return <StatsSkeleton cardW={cardW} gap={GAP} />;

  const items = [
    {
      key: "op",
      label: "Total de operaciones",
      value: format(resumen.operaciones),
      Icon: TransIcon,
    },
    {
      key: "soles",
      label: "Soles cambiados",
      prefix: "S/ ",
      value: format(resumen.soles),
      Icon: SolesIcon,
    },
    {
      key: "bs",
      label: "Bolivianos cambiados",
      prefix: "Bs ",
      value: format(resumen.bolivianos),
      Icon: BolisIcon,
    },
  ];

  const onScroll = (e) =>
    setIndex(Math.round(e.nativeEvent.contentOffset.x / (cardW + GAP)));

  return (
    <View>
      <FlatList
        data={items}
        keyExtractor={(it) => it.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardW + GAP}
        decelerationRate="fast"
        onMomentumScrollEnd={onScroll}
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
         renderItem={({ item }) => (
          <StatCard
            label={item.label}
            value={item.value}
            prefix={item.prefix}
            Icon={item.Icon}
            width={cardW}
          />
        )}
      />
      <View className="flex-row justify-center gap-2 mt-3">
        {items.map((it, i) => (
          <View
            key={it.key}
            className={`h-2 rounded-full ${i === index ? "w-5 bg-primary" : "w-2 bg-primary-light"}`}
          />
        ))}
      </View>
    </View>
  );
}
