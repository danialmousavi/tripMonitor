import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Animated,
  Easing,
  LayoutChangeEvent,
  StyleSheet,
  View,
} from "react-native";
import AppText from "../modules/AppText";


type NewsItem = {
  id: string;
  title: string;
};

type Props = {
  items?: NewsItem[];
};

const DEFAULT_NEWS: NewsItem[] = [
  {
    id: "1",
    title:
      "تخفیف ویژه سفرهای آخر هفته برای کاربران فعال شد",
  },
  {
    id: "2",
    title:
      "مسیرهای جدید به سرویس سفر اضافه شدند",
  },
  {
    id: "3",
    title:
      "با هر سفر امتیاز بگیرید و جایزه دریافت کنید",
  },
  {
    id: "4",
    title:
      "پیشنهادهای ویژه رستوران‌ها و مراکز خرید را از دست ندهید",
  },
];

export default function NewsTicker({
  items = DEFAULT_NEWS,
}: Props) {
  const translateX =
    useRef(new Animated.Value(0)).current;

  const [containerWidth, setContainerWidth] =
    useState(0);

  const [contentWidth, setContentWidth] =
    useState(0);

  const newsText = useMemo(() => {
    return items
      .map((item) => item.title)
      .join("     •     ");
  }, [items]);

  useEffect(() => {
    if (
      containerWidth <= 0 ||
      contentWidth <= 0
    ) {
      return;
    }

    let animation:
      | Animated.CompositeAnimation
      | undefined;

    const startAnimation = () => {
      /*
       * متن از سمت راست وارد می‌شود
       * و کامل به سمت چپ خارج می‌شود
       */
      translateX.setValue(
        containerWidth
      );

      animation = Animated.timing(
        translateX,
        {
          toValue:
            -contentWidth,

          duration:
            Math.max(
              12000,
              (containerWidth +
                contentWidth) *
                18
            ),

          easing: Easing.linear,

          useNativeDriver: true,
        }
      );

      animation.start(
        ({ finished }) => {
          if (finished) {
            startAnimation();
          }
        }
      );
    };

    startAnimation();

    return () => {
      animation?.stop();
      translateX.stopAnimation();
    };
  }, [
    containerWidth,
    contentWidth,
    translateX,
  ]);

  const handleContainerLayout = (
    event: LayoutChangeEvent
  ) => {
    setContainerWidth(
      event.nativeEvent.layout.width
    );
  };

  const handleContentLayout = (
    event: LayoutChangeEvent
  ) => {
    setContentWidth(
      event.nativeEvent.layout.width
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* News icon */}

        <View style={styles.iconBox}>
          <AppText
            style={styles.icon}
          >
            ⚡
          </AppText>
        </View>

        {/* Moving news */}

        <View
          style={styles.tickerArea}
          onLayout={
            handleContainerLayout
          }
        >
          <Animated.View
            onLayout={
              handleContentLayout
            }
            style={[
              styles.movingContent,

              {
                transform: [
                  {
                    translateX,
                  },
                ],
              },
            ]}
          >
            <AppText
              weight="medium"
              style={styles.newsText}
              numberOfLines={1}
            >
              {newsText}
            </AppText>
          </Animated.View>
        </View>

        {/* Breaking news badge */}

        <View
          style={styles.breakingBadge}
        >
          <View
            style={
              styles.breakingDot
            }
          />

          <AppText
            weight="bold"
            style={
              styles.breakingText
            }
          >
            خبر فوری
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 46,

    padding: 2,

    borderRadius: 16,

    backgroundColor: "#08111f",

    shadowColor: "#00d4ff",

    shadowOpacity: 0.35,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 0,
    },

    elevation: 7,
  },

  container: {
    flex: 1,

    flexDirection: "row",

    alignItems: "center",

    borderRadius: 14,

    overflow: "hidden",

    backgroundColor: "#0b1525",

    borderWidth: 1,

    borderColor:
      "rgba(0,210,255,0.24)",
  },

  // =========================
  // LEFT ICON
  // =========================

  iconBox: {
    width: 38,
    height: "100%",

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(0,210,255,0.07)",

    borderRightWidth: 1,

    borderRightColor:
      "rgba(0,210,255,0.16)",
  },

  icon: {
    fontSize: 16,
  },

  // =========================
  // TICKER
  // =========================

  tickerArea: {
    flex: 1,

    height: "100%",

    overflow: "hidden",

    justifyContent: "center",
  },

  movingContent: {
    position: "absolute",

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 10,
  },

  newsText: {
    color: "#E2E8F0",

    fontSize: 10,

    lineHeight: 16,

    writingDirection: "rtl",

    textAlign: "right",
  },

  // =========================
  // BADGE
  // =========================

  breakingBadge: {
    height: "100%",

    flexDirection: "row",

    alignItems: "center",

    gap: 6,

    paddingHorizontal: 12,

    backgroundColor:
      "rgba(255,45,85,0.10)",

    borderLeftWidth: 1,

    borderLeftColor:
      "rgba(255,65,105,0.25)",
  },

  breakingDot: {
    width: 6,
    height: 6,

    borderRadius: 10,

    backgroundColor: "#ff315f",

    shadowColor: "#ff315f",

    shadowOpacity: 0.9,

    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 0,
    },
  },

  breakingText: {
    color: "#FFFFFF",

    fontSize: 9,
  },
});