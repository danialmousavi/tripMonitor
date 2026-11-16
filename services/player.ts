import {
  DeviceManifestResponse,
  LayoutSection,
  MediaItem,
  Placement,
  PlayerLayoutResponse,
} from "../types/player";
import Constants from "expo-constants";

const configuredBaseUrl = Constants.expoConfig?.extra?.backendUrl;
const BASE_URL =
  typeof configuredBaseUrl === "string"
    ? configuredBaseUrl.replace(/\/+$/, "")
    : "";

const API_URL = `${BASE_URL}/api/v1/device/manifest`;
const REQUEST_TIMEOUT_MS = 10_000;

// این PLAYER_KEY نیست.
//
// باید device_token واقعی باشد
// که از POST /devices گرفتی.
const DEVICE_TOKEN = "XNoJRfyp42fuzp8p870sMHt2mbpJCoRJp3AzZZ__hac";

// فعلاً برای اینکه محتوا حتماً نمایش داده شود false
// بعداً برای production می‌کنیم true
const RESPECT_SCHEDULE_WINDOWS = false;

const STATIC_PLAYER_LAYOUT: PlayerLayoutResponse = {
  layout: {
    type: "GRID",
    sections: [
      {
        placement: "top-left",
        type: "VIDEO",
        media: {
          id: "local-live-test",
          title: "پخش زنده",
          type: "VIDEO",
          url: "",
          asset: require("../assets/videos/live-test.mp4"),
          duration_ms: 10000,
          checksum_sha256: "local-live-test",
        },
      },
      {
        placement: "top-right",
        type: "SLIDER",
        media: [
          {
            id: "local-promo-sale",
            title: "پیشنهاد ویژه",
            type: "IMAGE",
            url: "",
            asset: require("../assets/promo/promo-sale.jpg"),
            duration_ms: 7000,
            checksum_sha256: "local-promo-sale",
          },
          {
            id: "local-promo-tech",
            title: "فناوری",
            type: "IMAGE",
            url: "",
            asset: require("../assets/promo/promo-tech.jpg"),
            duration_ms: 7000,
            checksum_sha256: "local-promo-tech",
          },
          {
            id: "local-promo-travel",
            title: "سفر",
            type: "IMAGE",
            url: "",
            asset: require("../assets/promo/promo-travel.jpg"),
            duration_ms: 7000,
            checksum_sha256: "local-promo-travel",
          },
        ],
      },
      {
        placement: "bottom-left",
        type: "IMAGE",
        media: {
          id: "local-main-banner",
          title: "بنر اصلی",
          type: "IMAGE",
          url: "",
          asset: require("../assets/main/gold.png"),
          duration_ms: 10000,
          checksum_sha256: "local-main-banner",
        },
      },
      {
        placement: "bottom-right",
        type: "SLIDER",
        media: [
          {
            id: "local-campaign-banner",
            title: "کمپین",
            type: "IMAGE",
            url: "",
            asset: require("../assets/promo/promo-travel.jpg"),
            duration_ms: 7000,
            checksum_sha256: "local-campaign-banner",
          },
          {
            id: "local-banner-offer",
            title: "پیشنهاد",
            type: "IMAGE",
            url: "",
            asset: require("../assets/promo/promo-tech.jpg"),
            duration_ms: 7000,
            checksum_sha256: "local-banner-offer",
          },
        ],
      },
    ],
  },
};

// =========================================
// ABSOLUTE MEDIA URL
// =========================================

function getMediaUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("/")) {
    return `${BASE_URL}${url}`;
  }

  return `${BASE_URL}/${url}`;
}

// =========================================
// CHECK SCHEDULE WINDOW
// =========================================

function isActiveWindow(startAt: string, endAt: string) {
  const now = Date.now();

  const start = new Date(startAt).getTime();

  const end = new Date(endAt).getTime();

  return now >= start && now < end;
}

// =========================================
// MANIFEST MEDIA -> UI MEDIA
// =========================================

function createMediaItem(
  manifest: DeviceManifestResponse,

  schedule: DeviceManifestResponse["schedule"][number],
): MediaItem | null {
  const media = manifest.media.find(
    (item) => item.media_id === schedule.media_id,
  );

  if (!media) {
    console.log("MEDIA NOT FOUND:", schedule.media_id);

    return null;
  }

  return {
    id: media.media_id,

    title: "",

    type: media.type,

    url: getMediaUrl(media.url),

    // برای IMAGE:
    // display_duration_ms
    //
    // برای VIDEO:
    // duration_ms خود فایل
    duration_ms: schedule.display_duration_ms ?? media.duration_ms ?? 10000,

    checksum_sha256: media.checksum_sha256 ?? "",
  };
}

// =========================================
// MANIFEST -> OLD UI STRUCTURE
// =========================================

function convertManifestToPlayerLayout(
  manifest: DeviceManifestResponse,
): PlayerLayoutResponse {
  let schedule = [...manifest.schedule];

  // =====================================
  // زمان‌بندی
  // =====================================

  if (RESPECT_SCHEDULE_WINDOWS) {
    schedule = schedule.filter((item) =>
      item.windows.some((window) =>
        isActiveWindow(window.start_at, window.end_at),
      ),
    );
  }

  const placements: Placement[] = [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
  ];

  const sections: LayoutSection[] = [];

  // =====================================
  // BUILD SECTIONS
  // =====================================

  for (const placement of placements) {
    const placementSchedule = schedule
      .filter((item) => item.placement === placement)
      .sort((a, b) => a.position - b.position);

    if (placementSchedule.length === 0) {
      continue;
    }

    const items = placementSchedule
      .map((scheduleItem) => createMediaItem(manifest, scheduleItem))
      .filter((item): item is MediaItem => item !== null);

    if (items.length === 0) {
      continue;
    }

    // =====================================
    // چند آیتم = SLIDER
    // =====================================

    if (items.length > 1) {
      sections.push({
        placement,

        type: "SLIDER",

        media: items,
      });

      continue;
    }

    // =====================================
    // یک آیتم
    // =====================================

    const item = items[0];

    sections.push({
      placement,

      type: item.type,

      media: item,
    });
  }

  return {
    layout: {
      type: manifest.layout.type,

      sections,
    },
  };
}

// =========================================
// API REQUEST
// =========================================

async function getRemotePlayerLayout(): Promise<PlayerLayoutResponse> {
  if (!BASE_URL) {
    throw new Error("EXPO_PUBLIC_BACKEND_URL is not configured");
  }

  console.log("GET MANIFEST:", API_URL);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(API_URL, {
      method: "GET",

      headers: {
        Accept: "application/json",

        Authorization: `Bearer ${DEVICE_TOKEN}`,
      },

      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  console.log("MANIFEST STATUS:", response.status);

  if (response.status === 401) {
    throw new Error("Device token نامعتبر است");
  }

  if (response.status === 403) {
    throw new Error("Device فعال نیست");
  }

  if (!response.ok) {
    throw new Error(`Manifest API Error: ${response.status}`);
  }

  const manifest: DeviceManifestResponse = await response.json();

  console.log(
    "MANIFEST RESPONSE:",
    JSON.stringify(manifest, null, 2),
  );

  // =====================================
  // VALIDATION
  // =====================================

  if (!Array.isArray(manifest.media)) {
    throw new Error("Manifest media not found");
  }

  if (!Array.isArray(manifest.schedule)) {
    throw new Error("Manifest schedule not found");
  }

  console.log("MANIFEST MEDIA:", manifest.media.length);

  console.log("MANIFEST SCHEDULE:", manifest.schedule.length);

  // =====================================
  // CONVERT
  // =====================================

  const result = convertManifestToPlayerLayout(manifest);

  console.log(
    "MANIFEST CONTENT:",
    JSON.stringify(
      {
        layout: manifest.layout,
        media: manifest.media,
        schedule: manifest.schedule,
      },
      null,
      2,
    ),
  );

  console.log("PLAYER LAYOUT:", JSON.stringify(result, null, 2));

  return result;
}

export async function getPlayerLayout(): Promise<PlayerLayoutResponse> {
  try {
    return await getRemotePlayerLayout();
  } catch (error) {
    console.warn(
      "Manifest is unavailable; using the bundled offline layout.",
      error,
    );

    return STATIC_PLAYER_LAYOUT;
  }
}
