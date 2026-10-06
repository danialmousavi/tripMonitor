import { useQuery } from "@tanstack/react-query";
import { getPlayerLayout } from "../services/player";


const REFRESH_INTERVAL =
  60 * 60 * 1000;

export function usePlayerLayout() {
  return useQuery({
    queryKey: ["player-layout"],

    queryFn: getPlayerLayout,

    // تا 5 دقیقه دیتا fresh محسوب شود
    staleTime:
      5* 60 * 1000,

    // هر یک ساعت از سرور بررسی شود
    refetchInterval:
      REFRESH_INTERVAL,

    // اگر request fail شد
    retry: 2,

    // هنگام برگشت اینترنت مجدد بررسی شود
    refetchOnReconnect: true,

    // هر بار mount شد بی‌دلیل request جدید نزند
    refetchOnMount: false,
  });
}