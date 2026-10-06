import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  VideoView,
  useVideoPlayer,
} from "expo-video";

import { MediaItem } from "../../types/player";

type Props = {
  media: MediaItem;
};

export default function LiveTVCard({
  media,
}: Props) {
  const [isFullscreen, setIsFullscreen] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const loadedMediaRef =
    useRef<string | null>(null);

  // مهم:
  // اینجا دیگه ویدیو نمی‌دیم
  const player = useVideoPlayer(
    null,
    (player) => {
      player.loop = true;
      player.volume = 1;
    }
  );

  // ===================================
  // Load video
  // فقط وقتی واقعاً فایل تغییر کرده
  // ===================================

  useEffect(() => {
    let cancelled = false;

    const loadVideo = async () => {
      const mediaKey =
        `${media.id}:${media.checksum_sha256}`;

      // قبلاً همین فایل load شده
      if (
        loadedMediaRef.current ===
        mediaKey
      ) {
        return;
      }

      try {
        setIsLoading(true);

        await player.replaceAsync({
          uri: media.url,
          useCaching: true,
        });

        if (cancelled) {
          return;
        }

        loadedMediaRef.current =
          mediaKey;

        player.loop = true;
        player.play();
      } catch (error) {
        console.log(
          "VIDEO LOAD ERROR:",
          error
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadVideo();

    return () => {
      cancelled = true;
    };
  }, [
    media.id,
    media.url,
    media.checksum_sha256,
    player,
  ]);

  // ===================================
  // Fullscreen
  // ===================================

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  // ===================================
  // Video
  // ===================================

  const renderVideo = (
    fullscreen = false
  ) => {
    return (
      <View
        style={[
          styles.container,

          fullscreen &&
            styles.fullscreenContainer,
        ]}
      >
        <View
          style={[
            styles.neonFrame,

            fullscreen &&
              styles.fullscreenFrame,
          ]}
        >
          <VideoView
            player={player}
            style={styles.video}
            contentFit="cover"

            // هیچ کنترل native نداریم
            nativeControls={false}
          />

          {/* LIVE فقط حالت عادی */}
          {!fullscreen && (
            <View
              style={styles.liveBadge}
              pointerEvents="none"
            >
              <View
                style={styles.liveDot}
              />

              <Text
                style={styles.liveText}
              >
                LIVE
              </Text>
            </View>
          )}

          {/* Loading فقط هنگام load واقعی */}
          {isLoading && (
            <View
              style={styles.loading}
              pointerEvents="none"
            >
              <ActivityIndicator
                color="#FFFFFF"
                size="small"
              />
            </View>
          )}

          {/* Fullscreen Button */}

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.fullscreenButton,

              fullscreen &&
                styles.exitButton,
            ]}
            onPress={
              fullscreen
                ? closeFullscreen
                : openFullscreen
            }
          >
            <Text
              style={
                styles.fullscreenIcon
              }
            >
              {fullscreen
                ? "⤢"
                : "⛶"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      {!isFullscreen &&
        renderVideo(false)}

      <Modal
        visible={isFullscreen}
        animationType="none"
        statusBarTranslucent
        presentationStyle="fullScreen"
        onRequestClose={
          closeFullscreen
        }
      >
        {renderVideo(true)}
      </Modal>
    </>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      padding: 2,

      borderRadius: 22,

      backgroundColor:
        "#07111f",

      shadowColor:
        "#00d4ff",

      shadowOpacity: 0.45,

      shadowRadius: 14,

      shadowOffset: {
        width: 0,
        height: 0,
      },

      elevation: 8,
    },

    neonFrame: {
      flex: 1,

      position: "relative",

      borderRadius: 20,

      overflow: "hidden",

      borderWidth: 1,

      borderColor:
        "rgba(0,210,255,0.55)",

      backgroundColor: "#000",
    },

    fullscreenContainer: {
      padding: 0,

      borderRadius: 0,

      backgroundColor: "#000",

      shadowOpacity: 0,
      elevation: 0,
    },

    fullscreenFrame: {
      borderRadius: 0,

      borderWidth: 0,
    },

    video: {
      width: "100%",
      height: "100%",

      backgroundColor: "#000",
    },

    // =========================
    // LIVE
    // =========================

    liveBadge: {
      position: "absolute",

      top: 12,
      left: 12,

      flexDirection: "row",

      alignItems: "center",

      gap: 6,

      paddingHorizontal: 10,

      paddingVertical: 5,

      borderRadius: 14,

      backgroundColor:
        "rgba(255,25,75,0.16)",

      borderWidth: 1,

      borderColor:
        "rgba(255,45,85,0.75)",
    },

    liveDot: {
      width: 6,
      height: 6,

      borderRadius: 10,

      backgroundColor:
        "#ff335f",
    },

    liveText: {
      color: "#FFFFFF",

      fontSize: 10,

      fontWeight: "900",
    },

    // =========================
    // FULLSCREEN
    // =========================

    fullscreenButton: {
      position: "absolute",

      right: 12,
      bottom: 12,

      width: 40,
      height: 40,

      alignItems: "center",

      justifyContent:
        "center",

      borderRadius: 14,

      backgroundColor:
        "rgba(8,18,35,0.78)",

      borderWidth: 1,

      borderColor:
        "rgba(0,210,255,0.65)",

      zIndex: 20,
    },

    exitButton: {
      right: 22,
      bottom: 22,

      width: 46,
      height: 46,

      borderRadius: 16,
    },

    fullscreenIcon: {
      color: "#FFFFFF",

      fontSize: 21,

      fontWeight: "700",
    },

    // =========================
    // LOADING
    // =========================

    loading: {
      position: "absolute",

      top: 0,
      left: 0,
      right: 0,
      bottom: 0,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(0,0,0,0.15)",
    },
  });