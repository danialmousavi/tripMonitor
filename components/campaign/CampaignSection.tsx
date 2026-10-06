import React, { useRef, useState } from "react";

import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import Svg, {
  G,
  Path,
} from "react-native-svg";
import AppText from "../modules/AppText";


type Prize = {
  id: string;
  label: string;
  title: string;
  code: string;
  color: string;
};

const WHEEL_SIZE = 210;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = 100;

const PRIZES: Prize[] = [
  {
    id: "1",
    label: "۱۰٪ تخفیف سفر",
    title: "۱۰٪ تخفیف سفر",
    code: "TRIP10",
    color: "#7C3AED",
  },
  {
    id: "2",
    label: "۱۵٪ تخفیف سفر",
    title: "۱۵٪ تخفیف سفر",
    code: "TRIP15",
    color: "#2563EB",
  },
  {
    id: "3",
    label: "۲۰٪ تخفیف سفر",
    title: "۲۰٪ تخفیف سفر",
    code: "TRIP20",
    color: "#DB2777",
  },
  {
    id: "4",
    label: "جایزه ویژه سفر",
    title: "جایزه ویژه سفر",
    code: "TRIPVIP",
    color: "#F59E0B",
  },
  {
    id: "5",
    label: "۲۵٪ تخفیف سفر",
    title: "۲۵٪ تخفیف سفر",
    code: "TRIP25",
    color: "#0891B2",
  },
  {
    id: "6",
    label: "۳۰٪ تخفیف سفر",
    title: "۳۰٪ تخفیف سفر",
    code: "TRIP30",
    color: "#059669",
  },
];

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angle: number
) {
  const radians =
    ((angle - 90) * Math.PI) / 180;

  return {
    x:
      cx +
      radius * Math.cos(radians),

    y:
      cy +
      radius * Math.sin(radians),
  };
}

function describeSector(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(
    cx,
    cy,
    radius,
    endAngle
  );

  const end = polarToCartesian(
    cx,
    cy,
    radius,
    startAngle
  );

  const largeArcFlag =
    endAngle - startAngle <= 180
      ? "0"
      : "1";

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

export default function CampaignSection() {
  const animation =
    useRef(new Animated.Value(0)).current;

  const [isSpinning, setIsSpinning] =
    useState(false);

  const [winner, setWinner] =
    useState<Prize | null>(null);

  const [rotation, setRotation] =
    useState(2160);

  const sliceAngle =
    360 / PRIZES.length;

  const rotate =
    animation.interpolate({
      inputRange: [0, 1],

      outputRange: [
        "0deg",
        `${rotation}deg`,
      ],
    });

  const spinWheel = () => {
    if (isSpinning) {
      return;
    }

    setWinner(null);
    setIsSpinning(true);

    const winnerIndex =
      Math.floor(
        Math.random() *
          PRIZES.length
      );

    const selectedPrize =
      PRIZES[winnerIndex];

    const prizeCenter =
      winnerIndex *
        sliceAngle +
      sliceAngle / 2;

    const targetAngle =
      360 - prizeCenter;

    const fullSpins =
      360 * 6;

    const finalRotation =
      fullSpins +
      targetAngle;

    setRotation(
      finalRotation
    );

    animation.setValue(0);

    requestAnimationFrame(() => {
      Animated.timing(
        animation,
        {
          toValue: 1,

          duration: 4800,

          easing:
            Easing.out(
              Easing.cubic
            ),

          useNativeDriver: true,
        }
      ).start(
        ({ finished }) => {
          if (finished) {
            setWinner(
              selectedPrize
            );
          }

          setIsSpinning(
            false
          );
        }
      );
    });
  };

  return (
    <View style={styles.outer}>
      <View style={styles.container}>
        {/* HEADER */}

        <View style={styles.header}>
          <View
            style={
              styles.badge
            }
          >
            <AppText
              weight="bold"
              style={
                styles.badgeText
              }
            >
              🎁 جایزه ویژه
            </AppText>
          </View>

          <View
            style={
              styles.headerContent
            }
          >
            <AppText
              weight="bold"
              style={styles.title}
            >
              گردونه شانس
            </AppText>

            <AppText
              style={
                styles.subtitle
              }
            >
              بچرخون و تخفیف سفر ببر
            </AppText>
          </View>
        </View>

        {/* WHEEL */}

        <View
          style={
            styles.wheelSection
          }
        >
          {/* POINTER */}

          <View
            style={
              styles.pointer
            }
          />

          <View
            style={
              styles.wheelOuter
            }
          >
            <Animated.View
              style={[
                styles.wheel,

                {
                  transform: [
                    {
                      rotate,
                    },
                  ],
                },
              ]}
            >
              {/* SVG BACKGROUND */}

              <Svg
                width={
                  WHEEL_SIZE
                }
                height={
                  WHEEL_SIZE
                }
                viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
              >
                <G>
                  {PRIZES.map(
                    (
                      prize,
                      index
                    ) => {
                      const start =
                        index *
                        sliceAngle;

                      const end =
                        start +
                        sliceAngle;

                      return (
                        <Path
                          key={
                            prize.id
                          }
                          d={describeSector(
                            CENTER,
                            CENTER,
                            RADIUS,
                            start,
                            end
                          )}
                          fill={
                            prize.color
                          }
                          stroke="rgba(255,255,255,0.28)"
                          strokeWidth={
                            1.5
                          }
                        />
                      );
                    }
                  )}
                </G>
              </Svg>

              {/* TEXTS */}

              {PRIZES.map(
                (
                  prize,
                  index
                ) => {
                  const angle =
                    index *
                      sliceAngle +
                    sliceAngle / 2;

                  const point =
                    polarToCartesian(
                      CENTER,
                      CENTER,
                      69,
                      angle
                    );

                  return (
                    <View
                      key={`label-${prize.id}`}
                      pointerEvents="none"
                      style={[
                        styles.prizeLabelContainer,

                        {
                          left:
                            point.x -
                            42,

                          top:
                            point.y -
                            18,
                        },
                      ]}
                    >
                      <AppText
                        weight="bold"
                        numberOfLines={
                          2
                        }
                        style={
                          styles.prizeLabel
                        }
                      >
                        {
                          prize.label
                        }
                      </AppText>
                    </View>
                  );
                }
              )}
            </Animated.View>

            {/* CENTER BUTTON */}

            <Pressable
              disabled={
                isSpinning
              }
              onPress={
                spinWheel
              }
              style={({
                pressed,
              }) => [
                styles.centerButton,

                pressed &&
                  !isSpinning &&
                  styles.centerButtonPressed,

                isSpinning &&
                  styles.centerButtonDisabled,
              ]}
            >
              <View
                style={
                  styles.centerButtonInner
                }
              >
                <AppText
                  style={
                    styles.centerIcon
                  }
                >
                  🎯
                </AppText>

                <AppText
                  weight="bold"
                  style={
                    styles.centerButtonText
                  }
                >
                  {isSpinning
                    ? "..."
                    : "بچرخون"}
                </AppText>
              </View>
            </Pressable>
          </View>
        </View>

        {/* RESULT */}

        <View
          style={
            styles.resultArea
          }
        >
          {winner ? (
            <View
              style={
                styles.winnerCard
              }
            >
              <View
                style={
                  styles.winnerIconBox
                }
              >
                <AppText
                  style={
                    styles.winnerIcon
                  }
                >
                  🎉
                </AppText>
              </View>

              <View
                style={
                  styles.winnerInfo
                }
              >
                <AppText
                  weight="medium"
                  style={
                    styles.winnerLabel
                  }
                >
                  برنده شدی
                </AppText>

                <AppText
                  weight="bold"
                  style={
                    styles.winnerTitle
                  }
                >
                  {winner.title}
                </AppText>
              </View>

              <View
                style={
                  styles.codeBox
                }
              >
                <AppText
                  weight="bold"
                  style={
                    styles.codeText
                  }
                >
                  {winner.code}
                </AppText>
              </View>
            </View>
          ) : (
            <View
              style={
                styles.helperBox
              }
            >
              <AppText
                style={
                  styles.helperText
                }
              >
                مرکز گردونه را لمس کن و جایزه ببر
              </AppText>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    // =========================
    // MAIN CARD
    // =========================

    outer: {
      flex: 1,

      padding: 2,

      borderRadius: 22,

      backgroundColor:
        "#07101f",

      shadowColor:
        "#ff3b82",

      shadowOpacity: 0.5,

      shadowRadius: 14,

      shadowOffset: {
        width: 0,
        height: 0,
      },

      elevation: 10,
    },

    container: {
      flex: 1,

      minHeight: 0,

      paddingHorizontal: 10,

      paddingTop: 8,

      paddingBottom: 7,

      borderRadius: 20,

      overflow: "hidden",

      backgroundColor:
        "#080f1e",

      borderWidth: 1,

      borderColor:
        "rgba(255,59,130,0.58)",
    },

    // =========================
    // HEADER
    // =========================

    header: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      marginBottom: 2,

      zIndex: 10,
    },

    headerContent: {
      alignItems: "flex-end",
    },

    title: {
      color: "#FFFFFF",

      fontSize: 14,

      lineHeight: 20,

      textAlign: "right",
    },

    subtitle: {
      marginTop: 1,

      color:
        "rgba(203,213,225,0.72)",

      fontSize: 8.5,

      lineHeight: 13,

      textAlign: "right",
    },

    badge: {
      paddingHorizontal: 8,

      paddingVertical: 4,

      borderRadius: 10,

      backgroundColor:
        "rgba(255,59,130,0.12)",

      borderWidth: 1,

      borderColor:
        "rgba(255,59,130,0.45)",
    },

    badgeText: {
      color: "#FFFFFF",

      fontSize: 8,
    },

    // =========================
    // WHEEL
    // =========================

    wheelSection: {
      flex: 1,

      minHeight: 0,

      position: "relative",

      alignItems: "center",

      justifyContent:
        "center",

      marginTop: 1,
    },

    wheelOuter: {
      width:
        WHEEL_SIZE + 10,

      height:
        WHEEL_SIZE + 10,

      position: "relative",

      alignItems: "center",

      justifyContent:
        "center",

      borderRadius:
        (WHEEL_SIZE + 10) /
        2,

      backgroundColor:
        "#0b1528",

      borderWidth: 2,

      borderColor:
        "rgba(168,85,247,0.55)",

      shadowColor:
        "#a855f7",

      shadowOpacity: 0.72,

      shadowRadius: 16,

      shadowOffset: {
        width: 0,
        height: 0,
      },

      elevation: 14,
    },

    wheel: {
      width:
        WHEEL_SIZE,

      height:
        WHEEL_SIZE,

      position: "relative",

      borderRadius:
        WHEEL_SIZE / 2,

      overflow: "hidden",

      backgroundColor:
        "#101827",
    },

    // =========================
    // PRIZE LABELS
    // =========================

    prizeLabelContainer: {
      position: "absolute",

      width: 84,

      height: 36,

      alignItems: "center",

      justifyContent:
        "center",

      zIndex: 5,
    },

    prizeLabel: {
      width: "100%",

      color: "#FFFFFF",

      fontSize: 7.5,

      lineHeight: 11,

      textAlign: "center",

      writingDirection: "rtl",

      textShadowColor:
        "rgba(0,0,0,0.65)",

      textShadowOffset: {
        width: 0,
        height: 1,
      },

      textShadowRadius: 2,
    },

    // =========================
    // POINTER
    // =========================

    pointer: {
      position: "absolute",

      top: 0,

      zIndex: 50,

      width: 0,

      height: 0,

      borderLeftWidth: 9,

      borderRightWidth: 9,

      borderTopWidth: 16,

      borderLeftColor:
        "transparent",

      borderRightColor:
        "transparent",

      borderTopColor:
        "#FFFFFF",
    },

    // =========================
    // CENTER BUTTON
    // =========================

    centerButton: {
      position: "absolute",

      width: 70,

      height: 70,

      borderRadius: 35,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        "#07101f",

      borderWidth: 2,

      borderColor:
        "#ff4b9b",

      shadowColor:
        "#ff3b82",

      shadowOpacity: 0.9,

      shadowRadius: 13,

      shadowOffset: {
        width: 0,
        height: 0,
      },

      elevation: 20,
    },

    centerButtonInner: {
      width: 58,

      height: 58,

      borderRadius: 29,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        "rgba(255,59,130,0.18)",

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.18)",
    },

    centerIcon: {
      fontSize: 15,

      lineHeight: 18,
    },

    centerButtonText: {
      color: "#FFFFFF",

      fontSize: 8.5,

      lineHeight: 13,

      textAlign: "center",
    },

    centerButtonPressed: {
      transform: [
        {
          scale: 0.93,
        },
      ],
    },

    centerButtonDisabled: {
      opacity: 0.8,
    },

    // =========================
    // RESULT
    // =========================

    resultArea: {
      minHeight: 34,

      marginTop: 3,

      justifyContent:
        "center",
    },

    helperBox: {
      minHeight: 32,

      alignItems: "center",

      justifyContent:
        "center",

      borderRadius: 10,

      backgroundColor:
        "rgba(255,255,255,0.035)",

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.06)",
    },

    helperText: {
      color:
        "rgba(148,163,184,0.82)",

      fontSize: 8,

      lineHeight: 13,

      textAlign: "center",
    },

    winnerCard: {
      width: "100%",

      minHeight: 36,

      flexDirection: "row",

      alignItems: "center",

      paddingHorizontal: 7,

      paddingVertical: 4,

      borderRadius: 10,

      backgroundColor:
        "rgba(255,255,255,0.045)",

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.08)",
    },

    winnerIconBox: {
      width: 28,

      height: 28,

      alignItems: "center",

      justifyContent:
        "center",

      borderRadius: 9,

      backgroundColor:
        "rgba(255,59,130,0.12)",
    },

    winnerIcon: {
      fontSize: 15,
    },

    winnerInfo: {
      flex: 1,

      marginHorizontal: 7,

      alignItems: "flex-end",
    },

    winnerLabel: {
      color: "#f9a8d4",

      fontSize: 7,

      lineHeight: 10,
    },

    winnerTitle: {
      marginTop: 1,

      color: "#FFFFFF",

      fontSize: 9,

      lineHeight: 13,

      textAlign: "right",
    },

    codeBox: {
      paddingHorizontal: 7,

      paddingVertical: 4,

      borderRadius: 7,

      backgroundColor:
        "rgba(255,59,130,0.17)",

      borderWidth: 1,

      borderColor:
        "rgba(255,59,130,0.30)",
    },

    codeText: {
      color: "#FFFFFF",

      fontSize: 8,

      letterSpacing: 0.3,
    },
  });