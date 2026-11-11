import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MainBanner from "../components/banner/MainBanner";
import CampaignSection from "../components/campaign/CampaignSection";
import LiveTVCard from "../components/live-tv/LiveTVCard";
import MarketTicker from "../components/news/MarketTicker";
import PromoCarousel from "../components/promo/PromoCarousel";
import { usePlayerLayout } from "../hooks/usePlayerLayout";
import { LayoutSection, MediaItem } from "../types/player";

const quickActions = [
  { id: "offers", title: "پیشنهادات ویژه", subtitle: "فرصت‌های محدود", icon: "🎁", theme: "red" },
  { id: "wallet", title: "کیف پول", subtitle: "پرداخت و تراکنش‌ها", icon: "💳", theme: "blue" },
  { id: "points", title: "امتیازهای من", subtitle: "۱۲,۵۴۰ امتیاز", icon: "🪙", theme: "yellow" },
  { id: "games", title: "بازی کنید", subtitle: "جایزه بگیرید", icon: "🎮", theme: "purple" },
];

export default function HomeScreen() {
  const { data, isLoading, isError, error, isFetching } = usePlayerLayout();
  const sections = data?.layout.sections ?? [];
  const getSection = (placement: LayoutSection["placement"]) => sections.find((section) => section.placement === placement);
  const topLeft = getSection("top-left");
  const topRight = getSection("top-right");
  const bottomLeft = getSection("bottom-left");
  const bottomRight = getSection("bottom-right");
  const videoMedia = topLeft && !Array.isArray(topLeft.media) && topLeft.media.type === "VIDEO" ? topLeft.media : null;
  const toItems = (section?: LayoutSection): MediaItem[] => !section ? [] : Array.isArray(section.media) ? section.media : [section.media];
  const leftSliderMedia = toItems(topRight);
  const rightSliderMedia = toItems(bottomRight);
  const mainBannerMedia = bottomLeft && !Array.isArray(bottomLeft.media) ? bottomLeft.media : null;

  if (isLoading && !data) return <SafeAreaView style={styles.safeArea}><View style={styles.loading}><ActivityIndicator size="large" color="#fff" /><Text style={styles.loadingText}>در حال دریافت محتوا...</Text></View></SafeAreaView>;
  if (isError && !data) return <SafeAreaView style={styles.safeArea}><View style={styles.loading}><Text style={styles.errorText}>{error instanceof Error ? error.message : "خطا در دریافت محتوا"}</Text></View></SafeAreaView>;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <MarketTicker />
        {isFetching && !isLoading && <View style={styles.refreshIndicator} />}
        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.sideCard}>{leftSliderMedia.length ? <PromoCarousel items={leftSliderMedia} /> : <Empty text="بنری موجود نیست" />}</View>
            <View style={styles.videoWrap}><View style={styles.videoGlow} /><View style={styles.tvCard}>{videoMedia ? <LiveTVCard media={videoMedia} /> : <Empty text="ویدیو موجود نیست" />}</View></View>
            <View style={styles.sideCard}>{rightSliderMedia.length ? <PromoCarousel items={rightSliderMedia} /> : <Empty text="بنری موجود نیست" />}</View>
          </View>
          <View style={styles.bottomRow}>
            <View style={styles.bannerCard}>{mainBannerMedia ? <MainBanner media={mainBannerMedia} /> : <Empty text="بنری موجود نیست" />}</View>
            <View style={styles.campaignCard}><CampaignSection /></View>
          </View>
          <View style={styles.quickActionsBar}>
            {quickActions.map((item) => <ActionCard key={item.id} {...item} />)}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Empty({ text }: { text: string }) { return <View style={styles.emptyCard}><Text style={styles.emptyText}>{text}</Text></View>; }

function ActionCard({ title, subtitle, icon, theme }: typeof quickActions[number]) {
  const themeStyle = theme === "red" ? styles.redGlow : theme === "blue" ? styles.blueGlow : theme === "yellow" ? styles.yellowGlow : styles.purpleGlow;
  const iconStyle = theme === "red" ? styles.redIcon : theme === "blue" ? styles.blueIcon : theme === "yellow" ? styles.yellowIcon : styles.purpleIcon;
  return <TouchableOpacity activeOpacity={0.82} style={[styles.quickCard, themeStyle]}><Text style={styles.quickArrow}>‹</Text><View style={styles.quickText}><Text style={styles.quickTitle}>{title}</Text><Text style={styles.quickSubtitle}>{subtitle}</Text></View><View style={[styles.iconBox, iconStyle]}><Text style={styles.quickIcon}>{icon}</Text></View></TouchableOpacity>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#040913" }, container: { flex: 1, gap: 9, paddingHorizontal: 12, paddingTop: 8, paddingBottom: 10, backgroundColor: "#060d18" }, content: { flex: 1, gap: 9 },
  refreshIndicator: { position: "absolute", top: 10, right: 16, zIndex: 100, width: 6, height: 6, borderRadius: 6, backgroundColor: "#38BDF8" },
  topRow: { flex: 1.08, flexDirection: "row", gap: 10 }, sideCard: { flex: 0.62, minWidth: 0, borderRadius: 20, overflow: "hidden", backgroundColor: "#0A1323", borderWidth: 1, borderColor: "rgba(139,92,246,0.30)", elevation: 4 },
  videoWrap: { flex: 1.8, minWidth: 0, position: "relative" }, videoGlow: { position: "absolute", inset: 4, borderRadius: 24, backgroundColor: "rgba(0,190,255,0.05)", shadowColor: "#00D4FF", shadowOpacity: 0.78, shadowRadius: 22, elevation: 14 }, tvCard: { flex: 1, zIndex: 2, borderRadius: 22, overflow: "hidden", backgroundColor: "#000", borderWidth: 1.5, borderColor: "rgba(0,210,255,0.65)" },
  bottomRow: { flex: 0.78, flexDirection: "row", gap: 10 }, bannerCard: { flex: 1.15, borderRadius: 20, overflow: "hidden", backgroundColor: "#101827" }, campaignCard: { flex: 0.85, borderRadius: 20, overflow: "hidden", backgroundColor: "#101827" },
  emptyCard: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0A1323" }, emptyText: { color: "#64748B", fontSize: 9 },
  quickActionsBar: { height: 86, flexDirection: "row", gap: 10, padding: 9, borderRadius: 20, backgroundColor: "#070d18", borderWidth: 1, borderColor: "rgba(120,150,255,0.12)" }, quickCard: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", paddingHorizontal: 10, borderRadius: 16, backgroundColor: "#0c1527", borderWidth: 1, borderColor: "rgba(255,255,255,0.10)", elevation: 6 }, quickText: { flex: 1, minWidth: 0, alignItems: "flex-end", marginHorizontal: 8 }, quickTitle: { color: "#fff", fontSize: 12, fontWeight: "900", textAlign: "right" }, quickSubtitle: { marginTop: 3, color: "rgba(226,232,240,0.68)", fontSize: 8.5, textAlign: "right" }, quickArrow: { color: "rgba(255,255,255,0.85)", fontSize: 24, lineHeight: 26 }, iconBox: { width: 50, height: 50, alignItems: "center", justifyContent: "center", borderRadius: 14, borderWidth: 1 }, quickIcon: { fontSize: 25 },
  redGlow: { borderColor: "rgba(255,55,90,0.38)" }, blueGlow: { borderColor: "rgba(40,135,255,0.42)" }, yellowGlow: { borderColor: "rgba(255,180,20,0.42)" }, purpleGlow: { borderColor: "rgba(150,70,255,0.42)" }, redIcon: { backgroundColor: "rgba(255,35,75,0.20)", borderColor: "rgba(255,75,110,0.48)" }, blueIcon: { backgroundColor: "rgba(35,120,255,0.20)", borderColor: "rgba(70,155,255,0.50)" }, yellowIcon: { backgroundColor: "rgba(255,165,0,0.20)", borderColor: "rgba(255,190,30,0.52)" }, purpleIcon: { backgroundColor: "rgba(135,55,255,0.22)", borderColor: "rgba(165,90,255,0.52)" },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#060d18" }, loadingText: { marginTop: 12, color: "#fff", fontSize: 12 }, errorText: { color: "#ff6b6b", fontSize: 13, textAlign: "center" },
});
