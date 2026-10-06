import React from "react";

import {
  Image,
  StyleSheet,
  View,
} from "react-native";

import { MediaItem } from "../../types/player";

type Props = {
  media: MediaItem;
};

export default function MainBanner({
  media,
}: Props) {
  return (
    <View style={styles.outer}>
      <View style={styles.container}>
        <Image
          source={{
            uri: media.url,
          }}
          style={styles.image}
          resizeMode="cover"
        />
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

    shadowColor: "#f59e0b",
    shadowOpacity: 0.48,
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

    backgroundColor: "#111827",

    borderWidth: 1,

    borderColor:
      "rgba(245,158,11,0.65)",
  },

  image: {
    flex: 1,
    width: "100%",
  },
});