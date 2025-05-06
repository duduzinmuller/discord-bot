import axios from "axios";

const API_KEY = process.env.YOUTUBE_API_KEY;

async function searchYouTube(query: any) {
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      query
    )}&type=video&key=${API_KEY}`;
    const response = await axios.get(url);
    const video = response.data.items[0];

    return {
      title: video.snippet.title,
      url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      thumbnail: video.snippet.thumbnails.high.url,
      duration: video.snippet.publishedAt,
    };
  } catch (error) {
    console.error("Erro ao buscar no YouTube:", error);
    throw new Error("Não foi possível buscar a música no YouTube");
  }
}

export { searchYouTube };
