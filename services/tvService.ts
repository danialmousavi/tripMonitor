const CHANNELS_API =
  "https://iptv-org.github.io/api/channels.json";

const STREAMS_API =
  "https://iptv-org.github.io/api/streams.json";

type Channel = {
  id: string;
  name: string;
  country: string;
  categories: string[];
  is_nsfw: boolean;
};

type Stream = {
  channel: string | null;
  title: string;
  url: string;
  quality: string | null;
  labels: string[];
  referrer: string | null;
  user_agent: string | null;
};

export type LiveChannel = {
  id: string;
  name: string;
  country: string;
  url: string;
  quality: string | null;
};

export async function getSportsStream(): Promise<LiveChannel | null> {
  try {
    const [channelsResponse, streamsResponse] = await Promise.all([
      fetch(CHANNELS_API),
      fetch(STREAMS_API),
    ]);

    if (!channelsResponse.ok || !streamsResponse.ok) {
      throw new Error("Failed to load IPTV API");
    }

    const channels: Channel[] =
      await channelsResponse.json();

    const streams: Stream[] =
      await streamsResponse.json();

    const sportsChannels = channels.filter(
      (channel) =>
        !channel.is_nsfw &&
        channel.categories?.includes("sports")
    );

    const sportsIds = new Set(
      sportsChannels.map((channel) => channel.id)
    );

    const usableStreams = streams.filter((stream) => {
      if (!stream.channel) return false;

      if (!sportsIds.has(stream.channel)) {
        return false;
      }

      if (!stream.url) return false;

      if (
        stream.labels?.includes("Geo-blocked") ||
        stream.labels?.includes("Not 24/7")
      ) {
        return false;
      }

      return true;
    });

    if (!usableStreams.length) {
      return null;
    }

    const stream = usableStreams[0];

    const channel = sportsChannels.find(
      (item) => item.id === stream.channel
    );

    if (!channel) {
      return null;
    }

    return {
      id: channel.id,
      name: channel.name,
      country: channel.country,
      url: stream.url,
      quality: stream.quality,
    };
  } catch (error) {
    console.log("SPORT STREAM ERROR:", error);

    return null;
  }
}