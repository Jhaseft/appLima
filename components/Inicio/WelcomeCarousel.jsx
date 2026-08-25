import { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { SLIDES } from "./slides";
import { useCarousel } from "./hooks/useCarousel";

const SVG_SIZE = 330;

function Slide({ item, width }) {
  const { Svg, title, text } = item;
  return (
    <View style={{ width }} className="items-center px-4">
      <View style={{ height: SVG_SIZE }} className="items-center justify-center">
        {Svg ? (
          <Svg width={SVG_SIZE} height={SVG_SIZE} />
        ) : (
          <View
            style={{ width: SVG_SIZE, height: SVG_SIZE }}
            className="rounded-3xl bg-primary-light"
          />
        )}
      </View>
      <Text className="text-2xl font-lm-bold text-text text-center mt-6">
        {title}
      </Text>
      <Text className="text-base font-lm-light text-text-muted text-center mt-3">
        {text}
      </Text>
    </View>
  );
}

function Dots({ count, active }) {
  return (
    <View className="flex-row justify-center mt-5">
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          className={`h-2 rounded-full mx-1 ${
            i === active ? "w-6 bg-primary" : "w-2 bg-primary-light"
          }`}
        />
      ))}
    </View>
  );
}

export default function WelcomeCarousel() {
  const [width, setWidth] = useState(0);
  const { ref, index, onMomentumScrollEnd } = useCarousel(SLIDES.length, width);

  return (
    <View
      className="flex-1 justify-center"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {width > 0 && (
        <>
          <FlatList
            ref={ref}
            style={{ flexGrow: 0 }}
            data={SLIDES}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onMomentumScrollEnd}
            getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
            renderItem={({ item }) => <Slide item={item} width={width} />}
          />
          <Dots count={SLIDES.length} active={index} />
        </>
      )}
    </View>
  );
}
