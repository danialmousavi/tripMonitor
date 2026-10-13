export type MediaItem = {
  id: string;
  title: string;

  type:
    | "VIDEO"
    | "IMAGE";

  url: string;

  duration_ms: number;

  checksum_sha256: string;
};

export type Placement =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type LayoutSection = {
  placement: Placement;

  type:
    | "VIDEO"
    | "IMAGE"
    | "SLIDER";

  media:
    | MediaItem
    | MediaItem[];
};

export type PlayerLayoutResponse = {
  layout: {
    type: string;

    sections:
      LayoutSection[];
  };
};

// =========================================
// DEVICE MANIFEST
// =========================================

export type ManifestMedia = {
  media_id: string;

  type:
    | "IMAGE"
    | "VIDEO";

  url: string;

  checksum_sha256:
    | string
    | null;

  size_bytes: number;

  duration_ms:
    | number
    | null;
};

export type ManifestWindow = {
  start_at: string;
  end_at: string;
};

export type ManifestScheduleItem = {
  campaign_id: string;

  media_id: string;

  placement:
    Placement;

  position: number;

  display_duration_ms:
    | number
    | null;

  windows:
    ManifestWindow[];

  rules: Record<
    string,
    unknown
  >;
};

export type DeviceManifestResponse = {
  manifest_version: string;

  device_id: string;

  generated_at: string;

  valid_until:
    | string
    | null;

  poll_interval_seconds: number;

  layout: {
    type: string;
  };

  media:
    ManifestMedia[];

  schedule:
    ManifestScheduleItem[];
};