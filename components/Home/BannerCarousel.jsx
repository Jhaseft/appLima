import { useEffect, useRef, useState } from "react";
import { View, Image, FlatList, useWindowDimensions } from "react-native";
import Bone from "./Bone";

const PEEK = 34;
const GAP = 12;
const RATIO = 2.6;
const RADIUS = 24;
const AUTOPLAY_MS = 3500;

export default function BannerCarousel({ banners, loading }) {
  const { width } = useWindowDimensions();
  const itemW = width - PEEK * 2;
  const itemH = itemW / RATIO;
  const interval = itemW + GAP;

  const listRef = useRef(null);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);

  const count = banners?.length ?? 0;

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => {
      const next = (indexRef.current + 1) % count;
      indexRef.current = next;
      setIndex(next);
      listRef.current?.scrollToOffset({ offset: next * interval, animated: true });
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [count, interval]);

  if (loading || !banners) {
    return (
      <View className="mt-2 items-center">
        <Bone className="rounded-3xl" style={{ width: itemW, height: itemH }} />
      </View>
    );
  }
  if (count === 0) return null;

  const onScroll = (e) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / interval);
    indexRef.current = i;
    setIndex(i);
  };

  return (
    <View className="mt-2" style={{ marginHorizontal: -24 }}>
      <FlatList
        ref={listRef}
        data={banners}
        keyExtractor={(b) => String(b.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={interval}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: PEEK - GAP / 2 }}
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        onMomentumScrollEnd={onScroll}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.image }}
            style={{ width: itemW, height: itemH, borderRadius: RADIUS }}
            resizeMode="cover"
          />
        )}
      />
      {count > 1 && (
        <View className="flex-row justify-center gap-2 mt-3">
          {banners.map((b, i) => (
            <View
              key={b.id}
              className={`h-2 rounded-full ${i === index ? "w-5 bg-primary" : "w-2 bg-primary-light"}`}
            />
          ))}
        </View>
      )}
    </View>
  );
}
