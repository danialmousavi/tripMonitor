import React from "react";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import LiveTVCard from "../components/live-tv/LiveTVCard";
import PromoCarousel from "../components/promo/PromoCarousel";
import MainBanner from "../components/banner/MainBanner";
import CampaignSection from "../components/campaign/CampaignSection";
import MarketTicker from "../components/news/MarketTicker";

import { LayoutSection } from "../types/player";

import { usePlayerLayout } from "../hooks/usePlayerLayout";

const quickActions = [
  {
    id: "offers",
    title: "پیشنهادات ویژه",
    subtitle: "فرصت‌های محدود",
    icon: "🎁",
    theme: "red",
  },

  {
    id: "wallet",
    title: "کیف پول",
    subtitle: "پرداخت و تراکنش‌ها",
    icon: "💳",
    theme: "blue",
  },

  {
    id: "points",
    title: "امتیازهای من",
    subtitle: "۱۲,۵۴۰ امتیاز",
    icon: "🪙",
    theme: "yellow",
  },

  {
    id: "games",
    title: "بازی کنید",
    subtitle: "جایزه بگیرید",
    icon: "🎮",
    theme: "purple",
  },
];

export default function HomeScreen() {
  const { data, isLoading, isError, error, isFetching } = usePlayerLayout();

  const sections = data?.layout?.sections ?? [];

  // =========================================
  // FIND SECTION
  // =========================================

  const getSection = (placement: LayoutSection["placement"]) =>
    sections.find((section) => section.placement === placement);

  const topLeft = getSection("top-left");

  const topRight = getSection("top-right");

  const bottomLeft = getSection("bottom-left");

  const bottomRight = getSection("bottom-right");

  // =========================================
  // MEDIA
  // =========================================

  const videoMedia =
    topLeft && !Array.isArray(topLeft.media) ? topLeft.media : null;

  const sliderMedia =
    topRight && Array.isArray(topRight.media) ? topRight.media : [];

  const mainBannerMedia =
    bottomLeft && !Array.isArray(bottomLeft.media) ? bottomLeft.media : null;

  const campaignMedia =
    bottomRight && !Array.isArray(bottomRight.media) ? bottomRight.media : null;

  // =========================================
  // INITIAL LOADING
  // =========================================

  if (isLoading && !data) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />

          <Text style={styles.loadingText}>در حال دریافت محتوا...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (isError && !data) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : "خطا در دریافت محتوا"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // =========================================
  // UI
  // =========================================

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* ================= MARKET ================= */}

        <MarketTicker />

        {/* background refresh indicator */}

        {isFetching && !isLoading && <View style={styles.refreshIndicator} />}

        <View style={styles.content}>
          {/* ================= TOP ================= */}

          <View style={styles.topRow}>
            {/* LEFT CAROUSEL */}

            <View style={styles.sideCarouselCard}>
              <PromoCarousel items={sliderMedia} />
            </View>

            {/* CENTER VIDEO */}

            <View style={styles.videoFocusWrapper}>
              <View style={styles.videoGlow} />

              <View style={styles.tvCard}>
                {videoMedia && <LiveTVCard media={videoMedia} />}
              </View>
            </View>

            {/* RIGHT CAROUSEL */}

            <View style={styles.sideCarouselCard}>
              <PromoCarousel items={sliderMedia} />
            </View>
          </View>

          {/* ================= BOTTOM ================= */}

          <View style={styles.bottomRow}>
            <View style={styles.bannerCard}>
              {mainBannerMedia && <MainBanner media={mainBannerMedia} />}
            </View>

            <View style={styles.campaignCard}>
              <CampaignSection />
            </View>
          </View>

          {/* ================= QUICK ACTIONS ================= */}

          <View style={styles.quickActionsBar}>
            {quickActions.map((item) => {
              const themeStyle =
                item.theme === "red"
                  ? styles.redGlow
                  : item.theme === "blue"
                    ? styles.blueGlow
                    : item.theme === "yellow"
                      ? styles.yellowGlow
                      : styles.purpleGlow;

              const iconTheme =
                item.theme === "red"
                  ? styles.redIcon
                  : item.theme === "blue"
                    ? styles.blueIcon
                    : item.theme === "yellow"
                      ? styles.yellowIcon
                      : styles.purpleIcon;

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.82}
                  style={[styles.quickCard, themeStyle]}
                >
                  <Text style={styles.quickArrow}>‹</Text>

                  <View style={styles.quickTextContainer}>
                    <Text style={styles.quickTitle}>{item.title}</Text>

                    <Text style={styles.quickSubtitle}>{item.subtitle}</Text>
                  </View>

                  <View style={[styles.iconBox, iconTheme]}>
                    <Text style={styles.quickIcon}>{item.icon}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,

    backgroundColor: "#040913",
  },

  container: {
    flex: 1,

    paddingHorizontal: 12,

    paddingTop: 8,

    paddingBottom: 10,

    gap: 9,

    backgroundColor: "#060d18",
  },

  content: {
    flex: 1,

    gap: 9,
  },

  refreshIndicator: {
    position: "absolute",

    top: 10,

    right: 16,

    width: 6,

    height: 6,

    borderRadius: 6,

    backgroundColor: "#38BDF8",

    zIndex: 100,
  },

  // ==============================
  // TOP
  // ==============================

  topRow: {
    flex: 1.08,

    flexDirection: "row",

    alignItems: "stretch",

    gap: 10,
  },

  sideCarouselCard: {
    flex: 0.62,

    minWidth: 0,

    borderRadius: 20,

    overflow: "hidden",

    backgroundColor: "#0A1323",

    borderWidth: 1,

    borderColor: "rgba(139,92,246,0.30)",

    elevation: 4,
  },

  videoFocusWrapper: {
    flex: 1.8,

    minWidth: 0,

    position: "relative",

    justifyContent: "center",
  },

  videoGlow: {
    position: "absolute",

    top: 4,

    bottom: 4,

    left: 4,

    right: 4,

    borderRadius: 24,

    backgroundColor: "rgba(0,190,255,0.05)",

    shadowColor: "#00D4FF",

    shadowOpacity: 0.78,

    shadowRadius: 22,

    shadowOffset: {
      width: 0,
      height: 0,
    },

    elevation: 14,
  },

  tvCard: {
    flex: 1,

    zIndex: 2,

    borderRadius: 22,

    overflow: "hidden",

    backgroundColor: "#000",

    borderWidth: 1.5,

    borderColor: "rgba(0,210,255,0.65)",
  },

  // ==============================
  // BOTTOM
  // ==============================

  bottomRow: {
    flex: 0.78,

    flexDirection: "row",

    gap: 10,
  },

  bannerCard: {
    flex: 1.15,

    borderRadius: 20,

    overflow: "hidden",

    backgroundColor: "#101827",
  },

  campaignCard: {
    flex: 0.85,

    borderRadius: 20,

    overflow: "hidden",

    backgroundColor: "#101827",
  },

  // ==============================
  // QUICK ACTIONS
  // ==============================

  quickActionsBar: {
    height: 86,

    flexDirection: "row",

    gap: 10,

    padding: 9,

    borderRadius: 20,

    backgroundColor: "#070d18",

    borderWidth: 1,

    borderColor: "rgba(120,150,255,0.12)",
  },

  quickCard: {
    flex: 1,

    minWidth: 0,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 10,

    borderRadius: 16,

    backgroundColor: "#0c1527",

    borderWidth: 1,

    borderColor: "rgba(255,255,255,0.10)",

    elevation: 6,
  },

  quickTextContainer: {
    flex: 1,

    minWidth: 0,

    alignItems: "flex-end",

    marginHorizontal: 8,
  },

  quickTitle: {
    color: "#FFFFFF",

    fontSize: 12,

    fontWeight: "900",

    textAlign: "right",
  },

  quickSubtitle: {
    marginTop: 3,

    color: "rgba(226,232,240,0.68)",

    fontSize: 8.5,

    textAlign: "right",
  },

  quickArrow: {
    color: "rgba(255,255,255,0.85)",

    fontSize: 24,

    lineHeight: 26,
  },

  iconBox: {
    width: 50,

    height: 50,

    alignItems: "center",

    justifyContent: "center",

    borderRadius: 14,

    borderWidth: 1,
  },

  quickIcon: {
    fontSize: 25,
  },

  redGlow: {
    borderColor: "rgba(255,55,90,0.38)",

    shadowColor: "#ff315f",

    shadowOpacity: 0.38,

    shadowRadius: 10,
  },

  redIcon: {
    backgroundColor: "rgba(255,35,75,0.20)",

    borderColor: "rgba(255,75,110,0.48)",
  },

  blueGlow: {
    borderColor: "rgba(40,135,255,0.42)",

    shadowColor: "#2688ff",

    shadowOpacity: 0.4,

    shadowRadius: 10,
  },

  blueIcon: {
    backgroundColor: "rgba(35,120,255,0.20)",

    borderColor: "rgba(70,155,255,0.50)",
  },

  yellowGlow: {
    borderColor: "rgba(255,180,20,0.42)",

    shadowColor: "#ffb400",

    shadowOpacity: 0.4,

    shadowRadius: 10,
  },

  yellowIcon: {
    backgroundColor: "rgba(255,165,0,0.20)",

    borderColor: "rgba(255,190,30,0.52)",
  },

  purpleGlow: {
    borderColor: "rgba(150,70,255,0.42)",

    shadowColor: "#9b4dff",

    shadowOpacity: 0.42,

    shadowRadius: 10,
  },

  purpleIcon: {
    backgroundColor: "rgba(135,55,255,0.22)",

    borderColor: "rgba(165,90,255,0.52)",
  },

  loadingContainer: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: "#060d18",
  },

  loadingText: {
    marginTop: 12,

    color: "#FFFFFF",

    fontSize: 12,
  },

  errorText: {
    color: "#ff6b6b",

    fontSize: 13,

    textAlign: "center",
  },
});
