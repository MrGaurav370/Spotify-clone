
import { Track } from '../types';

// Helper to sanitize token from storage or input
const sanitizeToken = (token: string | null): string | null => {
  if (!token || token === 'null' || token === 'undefined') return null;
  return token.trim().replace(/[\n\r]/g, '');
};

let accessToken: string | null = sanitizeToken(localStorage.getItem('spotify_token'));

export const setSpotifyToken = (token: string) => {
  const cleanToken = sanitizeToken(token);
  accessToken = cleanToken;
  if (cleanToken) {
    localStorage.setItem('spotify_token', cleanToken);
  } else {
    localStorage.removeItem('spotify_token');
  }
};

export const hasValidToken = () => {
  const token = sanitizeToken(accessToken);
  return !!token && token.length > 20;
};

export const clearToken = () => {
  accessToken = null;
  localStorage.removeItem('spotify_token');
};

const fetchSpotify = async (endpoint: string) => {
  const token = sanitizeToken(accessToken);
  if (!token) {
    return null;
  }

  try {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);

    const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
      method: 'GET',
      headers: headers,
    });

    if (response.status === 401) {
      console.warn("Spotify session expired. Token cleared.");
      clearToken();
      return null;
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Spotify API error (${response.status}):`, errText);
      return null;
    }

    return response.json();
  } catch (error) {
    // Only log unexpected errors, not the 401 which we handle above
    if (error instanceof TypeError && error.message.includes('Request')) {
      console.error("Malformed request detected. Clearing token.");
      clearToken();
    } else {
      console.error("Spotify Fetch Exception:", error);
    }
    return null;
  }
};

export const searchTracks = async (query: string): Promise<Track[]> => {
  if (!query.trim()) return [];
  try {
    const data = await fetchSpotify(`search?q=${encodeURIComponent(query.trim())}&type=track&limit=20`);
    if (!data || !data.tracks || !data.tracks.items) return [];

    return data.tracks.items.map((item: any) => ({
      id: item.id,
      title: item.name,
      artist: item.artists.map((a: any) => a.name).join(', '),
      album: item.album.name,
      duration: formatDuration(item.duration_ms),
      coverUrl: item.album.images[0]?.url || 'https://picsum.photos/200/200',
      previewUrl: item.preview_url,
    }));
  } catch (error) {
    return [];
  }
};

export const getNewReleases = async (): Promise<Track[]> => {
  try {
    const data = await fetchSpotify('browse/new-releases?limit=12');
    if (!data || !data.albums || !data.albums.items) return [];

    return data.albums.items.map((item: any) => ({
      id: item.id,
      title: item.name,
      artist: item.artists.map((a: any) => a.name).join(', '),
      album: item.name,
      duration: '--:--',
      coverUrl: item.images[0]?.url || 'https://picsum.photos/200/200',
      previewUrl: null,
    }));
  } catch (error) {
    return [];
  }
};

const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
