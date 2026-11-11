import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MainBanner from "../components/banner/MainBanner";
import CampaignSection from "../components/campaign/CampaignSection";
import LiveTVCard from "../components/live-tv/LiveTVCard";
import MarketTicker from "../components/news/MarketTicker";
import PromoCarousel from "../components/promo/PromoCarousel";
import { usePlayerLayout } from "../hooks/usePlayerLayout";
import { LayoutSection, MediaItem } from "../types/player";

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
        </View>
      </View>
    </SafeAreaView>
  );
}

function Empty({ text }: { text: string }) { return <View style={styles.emptyCard}><Text style={styles.emptyText}>{text}</Text></View>; }

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#040913" }, container: { flex: 1, gap: 9, paddingHorizontal: 12, paddingTop: 8, paddingBottom: 10, backgroundColor: "#060d18" }, content: { flex: 1, gap: 9 },
  refreshIndicator: { position: "absolute", top: 10, right: 16, zIndex: 100, width: 6, height: 6, borderRadius: 6, backgroundColor: "#38BDF8" },
  topRow: { flex: 1.08, flexDirection: "row", gap: 10 }, sideCard: { flex: 0.62, minWidth: 0, borderRadius: 20, overflow: "hidden", backgroundColor: "#0A1323", borderWidth: 1, borderColor: "rgba(139,92,246,0.30)", elevation: 4 },
  videoWrap: { flex: 1.8, minWidth: 0, position: "relative" }, videoGlow: { position: "absolute", inset: 4, borderRadius: 24, backgroundColor: "rgba(0,190,255,0.05)", shadowColor: "#00D4FF", shadowOpacity: 0.78, shadowRadius: 22, elevation: 14 }, tvCard: { flex: 1, zIndex: 2, borderRadius: 22, overflow: "hidden", backgroundColor: "#000", borderWidth: 1.5, borderColor: "rgba(0,210,255,0.65)" },
  bottomRow: { flex: 1.02, flexDirection: "row", gap: 10 }, bannerCard: { flex: 1.15, borderRadius: 20, overflow: "hidden", backgroundColor: "#101827" }, campaignCard: { flex: 0.85, borderRadius: 20, overflow: "hidden", backgroundColor: "#101827" },
  emptyCard: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0A1323" }, emptyText: { color: "#64748B", fontSize: 9 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#060d18" }, loadingText: { marginTop: 12, color: "#fff", fontSize: 12 }, errorText: { color: "#ff6b6b", fontSize: 13, textAlign: "center" },
});
