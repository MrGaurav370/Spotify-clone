
import { Track, Playlist } from './types';

export const MOCK_TRACKS: Track[] = [
  { id: '1', title: 'Starboy', artist: 'The Weeknd', album: 'Starboy', duration: '3:50', coverUrl: 'https://picsum.photos/seed/starboy/200/200' },
  { id: '2', title: 'Midnight City', artist: 'M83', album: 'Hurry Up, We\'re Dreaming', duration: '4:03', coverUrl: 'https://picsum.photos/seed/m83/200/200' },
  { id: '3', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: '3:23', coverUrl: 'https://picsum.photos/seed/dua/200/200' },
  { id: '4', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20', coverUrl: 'https://picsum.photos/seed/blinding/200/200' },
  { id: '5', title: 'Heat Waves', artist: 'Glass Animals', album: 'Dreamland', duration: '3:58', coverUrl: 'https://picsum.photos/seed/glass/200/200' },
  { id: '6', title: 'Circles', artist: 'Post Malone', album: 'Hollywood\'s Bleeding', duration: '3:35', coverUrl: 'https://picsum.photos/seed/post/200/200' },
];

export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'p1',
    name: 'Top 50 - Global',
    owner: 'Lumina',
    coverUrl: 'https://picsum.photos/seed/top50/300/300',
    tracks: MOCK_TRACKS
  },
  {
    id: 'p2',
    name: 'Chill Vibes',
    owner: 'User404',
    coverUrl: 'https://picsum.photos/seed/chill/300/300',
    tracks: MOCK_TRACKS.slice(0, 3)
  },
  {
    id: 'p3',
    name: 'Coding Focus',
    owner: 'Dev Beats',
    coverUrl: 'https://picsum.photos/seed/coding/300/300',
    tracks: MOCK_TRACKS.slice(2, 5)
  }
];
