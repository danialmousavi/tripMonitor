import React, {
  useCallback,
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

const API_URL = "https://tindex.app/api/public/boards";

// برای تست
const TINDEX_TOKEN = "YOUR_TINDEX_TOKEN";

// هر 5 دقیقه
const REFRESH_INTERVAL = 5 * 60 * 1000;

type ApiRow = {
  slug: string;
  name: string;
  price: number;
  unit: string;
  change?: number;
  updated_at?: string;
};

type ApiBoard = {
  key: string;
  title: string;
  rows: ApiRow[];
};

type ApiResponse = {
  success: boolean;
  data: ApiBoard[];
};

type TickerItem = {
  id: string;
  label: string;
  value: string;
  change?: number;
  color?: string;
};

// ========================================
// STATIC NEWS + ADS
// ========================================

const STATIC_ITEMS: TickerItem[] = [
  {
    id: "news-1",
    label: "ویژه",
    value: "با هر سفر امتیاز بگیرید و جایزه دریافت کنید",
    color: "#FFFFFF",
  },
  {
    id: "news-2",
    label: "رستوران",
    value: "تخفیف ویژه کافه‌ها و رستوران‌های منتخب",
    color: "#FFB347",
  },
  {
    id: "news-3",
    label: "باشگاه مشتریان",
    value: "امتیازهای خود را جمع کنید و از جوایز ویژه استفاده کنید",
    color: "#C084FC",
  },
  {
    id: "news-4",
    label: "گردونه شانس",
    value: "گردونه را بچرخانید و کد تخفیف سفر برنده شوید",
    color: "#FF77C8",
  },
  {
    id: "news-5",
    label: "سفر",
    value: "پیشنهادهای ویژه برای سفرهای آخر هفته فعال شد",
    color: "#6CCBFF",
  },
  {
    id: "news-6",
    label: "کیف پول",
    value: "با کیف پول سریع‌تر و ساده‌تر پرداخت کنید",
    color: "#5BFF98",
  },
  {
    id: "news-7",
    label: "امتیاز",
    value: "با هر خرید و سفر امتیاز بیشتری دریافت کنید",
    color: "#FFC857",
  },
  {
    id: "news-8",
    label: "خودرو",
    value: "پیشنهادهای ویژه خدمات خودرو برای کاربران فعال",
    color: "#60A5FA",
  },
  {
    id: "news-9",
    label: "فروش ویژه",
    value: "تخفیف‌های محدود امروز را از دست ندهید",
    color: "#FB7185",
  },
  {
    id: "news-10",
    label: "رستوران‌های اطراف",
    value: "بهترین رستوران‌ها و کافه‌های نزدیک شما را ببینید",
    color: "#FBBF24",
  },
  {
    id: "news-11",
    label: "مسیر جدید",
    value: "مسیرهای جدید سفر به سرویس اضافه شدند",
    color: "#38BDF8",
  },
  {
    id: "news-12",
    label: "جایزه",
    value: "کاربران فعال شانس بیشتری برای دریافت جوایز دارند",
    color: "#A78BFA",
  },
  {
    id: "news-13",
    label: "کمپین",
    value: "کمپین‌های جدید و پیشنهادهای محدود را بررسی کنید",
    color: "#F472B6",
  },
  {
    id: "news-14",
    label: "پرداخت",
    value: "پرداخت سریع و امن با کیف پول داخل برنامه",
    color: "#34D399",
  },
  {
    id: "news-15",
    label: "پیشنهاد روز",
    value: "تخفیف ویژه غذا و نوشیدنی برای امروز فعال است",
    color: "#FDBA74",
  },
  {
    id: "news-16",
    label: "خدمات ویژه",
    value: "خدمات منتخب خودرو با تخفیف مخصوص کاربران",
    color: "#93C5FD",
  },
  {
    id: "news-17",
    label: "سفر بعدی",
    value: "برای سفر بعدی خود کد تخفیف دریافت کنید",
    color: "#F9A8D4",
  },
  {
    id: "news-18",
    label: "باشگاه",
    value: "امتیازهایتان را برای تخفیف و هدیه استفاده کنید",
    color: "#C4B5FD",
  },
  {
    id: "news-19",
    label: "تفریح",
    value: "پیشنهادهای تفریحی و سرگرمی جدید در دسترس است",
    color: "#67E8F9",
  },
  {
    id: "news-20",
    label: "خرید",
    value: "پیشنهادهای خرید ویژه اعضای باشگاه را ببینید",
    color: "#FDE68A",
  },
];

export default function MarketTicker() {
  const translateX = useRef(new Animated.Value(0)).current;

  const [containerWidth, setContainerWidth] = useState(0);

  const [contentWidth, setContentWidth] = useState(0);

  const [marketItems, setMarketItems] = useState<TickerItem[]>([]);

  const [loading, setLoading] = useState(true);

  // ========================================
  // FORMAT PRICE
  // ========================================

  const formatPrice = (price: number, unit = "تومان") => {
    return `${price.toLocaleString("fa-IR")} ${unit}`;
  };

  // ========================================
  // LOAD MARKET DATA
  // ========================================

  const loadMarket = useCallback(async () => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${TINDEX_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Market API Error: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (!result.success) {
        throw new Error("Market API response unsuccessful");
      }

      const currencyBoard = result.data.find(
        (board) => board.key === "currency",
      );

      
      const goldBoard = result.data.find((board) => board.key === "gold");

      const usd = currencyBoard?.rows.find(
        (item) => item.slug === "USD-EXCHANGE-RATE",
      );

      const euro = currencyBoard?.rows.find((item) => item.slug === "EUR-RIAL");

      const gold18 = goldBoard?.rows.find((item) => item.slug === "GOLD-18K");

      const emami = goldBoard?.rows.find((item) => item.slug === "emami-coin");

      const items: TickerItem[] = [];

      if (usd) {
        items.push({
          id: "usd",
          label: "دلار",
          value: formatPrice(usd.price, usd.unit),
          change: usd.change,
          color: "#5BFF98",
        });
      }

      if (gold18) {
        items.push({
          id: "gold18",
          label: "طلای ۱۸ عیار",
          value: formatPrice(gold18.price, gold18.unit),
          change: gold18.change,
          color: "#FFC857",
        });
      }

      if (emami) {
        items.push({
          id: "emami",
          label: "سکه امامی",
          value: formatPrice(emami.price, emami.unit),
          change: emami.change,
          color: "#FFB347",
        });
      }

      if (euro) {
        items.push({
          id: "eur",
          label: "یورو",
          value: formatPrice(euro.price, euro.unit),
          change: euro.change,
          color: "#6CCBFF",
        });
      }

      setMarketItems(items);
    } catch (error) {
      console.log("MARKET API ERROR:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ========================================
  // INITIAL LOAD + REFRESH
  // ========================================

  useEffect(() => {
    loadMarket();

    const timer = setInterval(loadMarket, REFRESH_INTERVAL);

    return () => clearInterval(timer);
  }, [loadMarket]);

  // ========================================
  // MIX MARKET + STATIC NEWS
  // ========================================

  const tickerItems = useMemo(() => {
    const result: TickerItem[] = [];

    const maxLength = Math.max(marketItems.length, STATIC_ITEMS.length);

    for (let i = 0; i < maxLength; i++) {
      if (marketItems[i]) {
        result.push(marketItems[i]);
      }

      if (STATIC_ITEMS[i]) {
        result.push(STATIC_ITEMS[i]);
      }
    }

    return result;
  }, [marketItems]);

  // ========================================
  // ANIMATION
  // ========================================

  useEffect(() => {
    if (containerWidth <= 0 || contentWidth <= 0) {
      return;
    }

    translateX.setValue(0);

    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: -contentWidth,

        duration: Math.max(20000, contentWidth * 22),

        easing: Easing.linear,

        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
      translateX.stopAnimation();
    };
  }, [containerWidth, contentWidth, translateX, tickerItems]);

  // ========================================
  // RENDER ITEMS
  // ========================================

  const renderedItems = tickerItems.map((item) => {
    const isUp = typeof item.change === "number" && item.change > 0;

    const isDown = typeof item.change === "number" && item.change < 0;

    return (
      <View key={item.id} style={styles.item}>
        <View style={styles.dot} />

        <AppText weight="bold" style={styles.itemLabel}>
          {item.label}
        </AppText>

        <AppText
          weight="medium"
          style={[
            styles.itemValue,
            {
              color: item.color || "#FFFFFF",
            },
          ]}
        >
          {item.value}
        </AppText>

        {typeof item.change === "number" && (
          <View style={styles.changeBox}>
            <AppText
              weight="bold"
              style={[
                styles.changeText,

                isUp && styles.changeUp,

                isDown && styles.changeDown,
              ]}
            >
              {isUp ? "▲ " : isDown ? "▼ " : ""}
              {Math.abs(item.change).toLocaleString("fa-IR")}٪
            </AppText>
          </View>
        )}
      </View>
    );
  });

  // ========================================
  // UI
  // ========================================

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* LEFT ICON */}

        <View style={styles.leftIcon}>
          <AppText style={styles.speaker}>🔊</AppText>
        </View>

        {/* TICKER */}

        <View
          style={styles.viewport}
          onLayout={(event: LayoutChangeEvent) => {
            setContainerWidth(event.nativeEvent.layout.width);
          }}
        >
          {loading && marketItems.length === 0 ? (
            <AppText style={styles.loadingText}>
              در حال دریافت قیمت روز...
            </AppText>
          ) : (
            <Animated.View
              style={[
                styles.track,
                {
                  transform: [
                    {
                      translateX,
                    },
                  ],
                },
              ]}
            >
              {/* COPY 1 */}

              <View
                style={styles.trackContent}
                onLayout={(event: LayoutChangeEvent) => {
                  setContentWidth(event.nativeEvent.layout.width);
                }}
              >
                {renderedItems}
              </View>

              {/* COPY 2 */}

              <View style={styles.trackContent}>{renderedItems}</View>
            </Animated.View>
          )}
        </View>

        {/* RIGHT ICON */}

        <View style={styles.rightIcon}>
          <AppText weight="bold" style={styles.infinity}>
            ∞
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 48,

    padding: 2,

    borderRadius: 18,

    backgroundColor: "#06101e",

    shadowColor: "#2784ff",

    shadowOpacity: 0.45,

    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 0,
    },

    elevation: 8,
  },

  container: {
    flex: 1,

    flexDirection: "row",

    alignItems: "center",

    overflow: "hidden",

    borderRadius: 16,

    backgroundColor: "#07172a",

    borderWidth: 1,

    borderColor: "rgba(59,140,255,0.78)",
  },

  leftIcon: {
    width: 44,

    height: "100%",

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: "rgba(255,183,30,0.06)",

    zIndex: 5,
  },

  speaker: {
    fontSize: 18,
  },

  rightIcon: {
    width: 44,

    height: "100%",

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: "#07172a",

    zIndex: 5,
  },

  infinity: {
    color: "#DDEAFF",

    fontSize: 21,

    lineHeight: 24,
  },

  viewport: {
    flex: 1,

    height: "100%",

    overflow: "hidden",

    justifyContent: "center",
  },

  track: {
    position: "absolute",

    flexDirection: "row",

    alignItems: "center",
  },

  trackContent: {
    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 14,
  },

  item: {
    flexDirection: "row",

    alignItems: "center",

    marginRight: 26,
  },

  dot: {
    width: 4,

    height: 4,

    marginRight: 9,

    borderRadius: 8,

    backgroundColor: "#FFC857",

    shadowColor: "#FFC857",

    shadowOpacity: 0.8,

    shadowRadius: 4,

    shadowOffset: {
      width: 0,
      height: 0,
    },
  },

  itemLabel: {
    marginRight: 5,

    color: "#FFFFFF",

    fontSize: 9,

    lineHeight: 15,
  },

  itemValue: {
    fontSize: 9,

    lineHeight: 15,
  },

  changeBox: {
    marginLeft: 6,
  },

  changeText: {
    fontSize: 7.5,

    lineHeight: 13,

    color: "#CBD5E1",
  },

  changeUp: {
    color: "#4ADE80",
  },

  changeDown: {
    color: "#FB7185",
  },

  loadingText: {
    color: "#94A3B8",

    fontSize: 9,

    textAlign: "center",
  },
});
