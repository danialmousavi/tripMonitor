import { PlayerLayoutResponse } from "../types/player";

const API_URL =
  "http://46.34.163.41:8000/api/v1/player/playlist";

const PLAYER_KEY =
  "xb6F02SuwYSCaP1lVc8BCcopbX1nxzhp9q54KPT1DhM";

export async function getPlayerLayout(): Promise<PlayerLayoutResponse> {
  const response = await fetch(API_URL, {
    method: "GET",

    headers: {
      Accept: "application/json",
      "x-player-key": PLAYER_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(
      `API Error: ${response.status}`
    );
  }

  const data: PlayerLayoutResponse =
    await response.json();

  if (!data.layout?.sections) {
    throw new Error(
      "Layout sections not found"
    );
  }

  return data;
}