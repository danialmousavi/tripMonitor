export type MediaItem = {
  id: string;
  title: string;
  type: "VIDEO" | "IMAGE";
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
  type: "VIDEO" | "IMAGE" | "SLIDER";
  media: MediaItem | MediaItem[];
};

export type PlayerLayoutResponse = {
  layout: {
    type: string;
    sections: LayoutSection[];
  };
};