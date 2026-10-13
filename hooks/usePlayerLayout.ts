import {
  useQuery,
} from "@tanstack/react-query";

import {
  getPlayerLayout,
} from "../services/player";

const REFRESH_INTERVAL =
  1 * 60 * 1000;

export function usePlayerLayout() {
  return useQuery({
    queryKey: [
      "player-layout",
    ],

    queryFn:
      getPlayerLayout,

    // 4 دقیقه fresh
    staleTime:
       20 * 1000,

    refetchInterval:
      REFRESH_INTERVAL,

    retry: 2,

    refetchOnReconnect:
      true,

    refetchOnMount:
      true,
  });
}