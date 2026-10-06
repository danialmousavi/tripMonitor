import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FlatList,
  Image,
  LayoutChangeEvent,
  StyleSheet,
  View,
} from "react-native";

import { MediaItem } from "../../types/player";

type Props = {
  items: MediaItem[];
};

export default function PromoCarousel({
  items,
}: Props) {
  const listRef =
    useRef<FlatList<MediaItem>>(null);

  const [activeIndex, setActiveIndex] =
    useState(0);

  const [containerWidth, setContainerWidth] =
    useState(0);

  useEffect(() => {
    if (
      !containerWidth ||
      items.length <= 1
    ) {
      return;
    }

    const current =
      items[activeIndex];

    const duration =
      current?.duration_ms || 10000;

    const timer = setTimeout(() => {
      const next =
        (activeIndex + 1) %
        items.length;

      listRef.current?.scrollToOffset({
        offset:
          next * containerWidth,

        animated: true,
      });

      setActiveIndex(next);
    }, duration);

    return () =>
      clearTimeout(timer);
  }, [
    activeIndex,
    containerWidth,
    items,
  ]);

  const handleLayout = (
    event: LayoutChangeEvent
  ) => {
    setContainerWidth(
      event.nativeEvent.layout.width
    );
  };

  return (
    <View
      style={styles.outer}
      onLayout={handleLayout}
    >
      <View style={styles.container}>
        {containerWidth > 0 && (
          <FlatList
            ref={listRef}
            data={items}
            horizontal
            pagingEnabled
            bounces={false}
            showsHorizontalScrollIndicator={
              false
            }
            keyExtractor={(item) =>
              item.id
            }
            snapToInterval={
              containerWidth
            }
            snapToAlignment="start"
            decelerationRate="fast"
            disableIntervalMomentum
            getItemLayout={(
              _,
              index
            ) => ({
              length:
                containerWidth,

              offset:
                containerWidth *
                index,

              index,
            })}
            onMomentumScrollEnd={(
              event
            ) => {
              const index =
                Math.round(
                  event.nativeEvent
                    .contentOffset.x /
                    containerWidth
                );

              setActiveIndex(index);
            }}
            renderItem={({
              item,
            }) => (
              <View
                style={{
                  width:
                    containerWidth,

                  height: "100%",
                }}
              >
                <Image
                  source={{
                    uri: item.url,
                  }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            )}
          />
        )}

        <View style={styles.dots}>
          {items.map(
            (item, index) => (
              <View
                key={item.id}
                style={[
                  styles.dot,

                  activeIndex ===
                    index &&
                    styles.activeDot,
                ]}
              />
            )
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,

    padding: 2,

    borderRadius: 22,

    backgroundColor: "#081224",

    shadowColor: "#8b5cf6",
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 0,
    },

    elevation: 8,
  },

  container: {
    flex: 1,

    borderRadius: 20,
    overflow: "hidden",

    backgroundColor: "#0b1325",

    borderWidth: 1,

    borderColor:
      "rgba(139,92,246,0.62)",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  dots: {
    position: "absolute",

    left: 14,
    bottom: 12,

    flexDirection: "row",

    gap: 6,

    paddingHorizontal: 8,
    paddingVertical: 6,

    borderRadius: 12,

    backgroundColor:
      "rgba(5,10,25,0.55)",
  },

  dot: {
    width: 6,
    height: 6,

    borderRadius: 6,

    backgroundColor:
      "rgba(255,255,255,0.35)",
  },

  activeDot: {
    width: 24,

    backgroundColor:
      "#a78bfa",
  },
});