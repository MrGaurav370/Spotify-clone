
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverUrl: string;
  previewUrl?: string; // URL for 30s audio preview
}

export interface Playlist {
  id: string;
  name: string;
  owner: string;
  coverUrl: string;
  tracks: Track[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export enum ViewType {
  HOME = 'home',
  SEARCH = 'search',
  LIBRARY = 'library',
  PLAYLIST = 'playlist'
}
