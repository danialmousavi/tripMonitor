import React from "react";

import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";

import { useFonts } from "expo-font";

import {
  SafeAreaProvider,
} from "react-native-safe-area-context";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import HomeScreen from "./screens/HomeScreen";

const queryClient =
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
      },
    },
  });

export default function App() {
  const [fontsLoaded] =
    useFonts({
      "Vazirmatn-Regular":
        require("./assets/fonts/Vazirmatn-Regular.ttf"),

      "Vazirmatn-Medium":
        require("./assets/fonts/Vazirmatn-Medium.ttf"),

      "Vazirmatn-Bold":
        require("./assets/fonts/Vazirmatn-Bold.ttf"),
    });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#FFFFFF"
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider
        client={queryClient}
      >
        <HomeScreen />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles =
  StyleSheet.create({
    loading: {
      flex: 1,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        "#060d18",
    },
  });