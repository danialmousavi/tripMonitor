import React from "react";

import {
  StyleProp,
  Text,
  TextProps,
  TextStyle,
} from "react-native";

type Props = TextProps & {
  weight?: "regular" | "medium" | "bold";
  style?: StyleProp<TextStyle>;
};

export default function AppText({
  weight = "regular",
  style,
  children,
  ...props
}: Props) {
  const fontFamily =
    weight === "bold"
      ? "Vazirmatn-Bold"
      : weight === "medium"
      ? "Vazirmatn-Medium"
      : "Vazirmatn-Regular";

  return (
    <Text
      {...props}
      style={[
        {
          fontFamily,
          writingDirection: "rtl",
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}