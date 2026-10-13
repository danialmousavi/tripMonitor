import {
  DeviceManifestResponse,
  LayoutSection,
  MediaItem,
  Placement,
  PlayerLayoutResponse,
} from "../types/player";

const BASE_URL = "http://46.34.163.41:8000";

const API_URL = `${BASE_URL}/api/v1/device/manifest`;

// این PLAYER_KEY نیست.
//
// باید device_token واقعی باشد
// که از POST /devices گرفتی.
const DEVICE_TOKEN = "BDxF1DTOHGGBi7ORTsRg4q53qLec_Gmqi5UXhOYM2NY";

// فعلاً برای اینکه محتوا حتماً نمایش داده شود false
// بعداً برای production می‌کنیم true
const RESPECT_SCHEDULE_WINDOWS = false;

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

export async function getPlayerLayout(): Promise<PlayerLayoutResponse> {
  console.log("GET MANIFEST:", API_URL);

  const response = await fetch(API_URL, {
    method: "GET",

    headers: {
      Accept: "application/json",

      Authorization: `Bearer ${DEVICE_TOKEN}`,
    },
  });

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

  console.log("PLAYER LAYOUT:", JSON.stringify(result, null, 2));

  return result;
}
