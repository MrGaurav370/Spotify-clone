
import React, { useState, useEffect } from 'react';
import { ViewType, Track } from '../types';
import { MOCK_TRACKS } from '../constants';
import { searchTracks, getNewReleases, setSpotifyToken, hasValidToken, clearToken } from '../services/spotifyService';
import AIDJ from './AIDJ';

interface DashboardProps {
  currentView: ViewType;
  onPlayTrack: (track: Track) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentView, onPlayTrack, searchQuery, onSearchChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [newReleases, setNewReleases] = useState<Track[]>([]);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [isConnected, setIsConnected] = useState(hasValidToken());

  // Periodically check if token is still valid (in case it was cleared by an API call elsewhere)
  useEffect(() => {
    const interval = setInterval(() => {
      const valid = hasValidToken();
      if (valid !== isConnected) {
        setIsConnected(valid);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isConnected]);

  useEffect(() => {
    const fetchHomeData = async () => {
      if (!hasValidToken()) {
        setIsConnected(false);
        setNewReleases([]);
        return;
      }

      const releases = await getNewReleases();
      if (releases && releases.length > 0) {
        setNewReleases(releases);
        setIsConnected(true);
      } else {
        // If releases is null/empty, check if token was cleared during fetch
        setIsConnected(hasValidToken());
      }
    };
    fetchHomeData();
  }, [isConnected]);

  useEffect(() => {
    if (searchQuery.length > 2 && isConnected) {
      const delayDebounceFn = setTimeout(async () => {
        setIsLoading(true);
        const results = await searchTracks(searchQuery);
        setSearchResults(results);
        setIsLoading(false);
        
        // Sync connection state in case token expired during search
        if (!hasValidToken()) {
          setIsConnected(false);
        }
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, isConnected]);

  const handleSaveToken = () => {
    if (tokenInput.trim()) {
      setSpotifyToken(tokenInput.trim());
      setIsConnected(true);
      setShowTokenModal(false);
      setTokenInput('');
    }
  };

  const handleDisconnect = () => {
    clearToken();
    setIsConnected(false);
    setNewReleases([]);
    setSearchResults([]);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-zinc-900 to-black p-8 relative scroll-smooth">
      <header className="flex items-center justify-between mb-8 sticky top-0 z-20 pb-4 bg-gradient-to-b from-zinc-900 via-zinc-900 to-transparent -mx-8 px-8 backdrop-blur-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex gap-2">
            <button className="bg-black/40 w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/60 transition-all">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button className="bg-black/40 w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/60 transition-all">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          {currentView === ViewType.SEARCH && (
            <div className="relative max-w-md w-full ml-4 animate-in fade-in slide-in-from-left-4 duration-500">
              <i className={`fa-solid ${isLoading ? 'fa-circle-notch animate-spin text-green-500' : 'fa-magnifying-glass'} absolute left-4 top-1/2 -translate-y-1/2 transition-all text-gray-400`}></i>
              <input
                autoFocus
                type="text"
                placeholder="What do you want to listen to?"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-white text-black text-sm rounded-full py-3 pl-12 pr-10 outline-none placeholder:text-gray-500 font-medium shadow-2xl focus:ring-2 focus:ring-green-500 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`}></div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isConnected ? 'text-zinc-500' : 'text-red-500'}`}>
              {isConnected ? 'Spotify Live' : 'Session Expired'}
            </span>
          </div>

          <button 
            onClick={() => isConnected ? handleDisconnect() : setShowTokenModal(true)}
            className={`border ${isConnected ? 'border-red-500/30 text-red-500 hover:bg-red-500/10' : 'border-green-500 text-green-500 hover:bg-green-500/10'} font-bold py-1.5 px-4 rounded-full text-sm transition-all whitespace-nowrap`}
          >
            {isConnected ? 'Disconnect' : 'Renew Token'}
          </button>
          
          <button className="bg-black/60 p-1 rounded-full flex items-center gap-2 pr-3 hover:bg-gray-800 transition-all">
            <img src="https://picsum.photos/seed/user/32/32" className="w-7 h-7 rounded-full" alt="avatar" />
            <span className="text-xs font-bold hidden sm:inline">Dante</span>
            <i className="fa-solid fa-caret-down text-[10px]"></i>
          </button>
        </div>
      </header>

      {/* Token Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowTokenModal(false)}></div>
          <div className="relative bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-black mb-2">Connect to Spotify</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Your previous session may have expired. Paste a new temporary access token to continue with real music.
            </p>
            
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-6">
              <h3 className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                <i className="fa-solid fa-info-circle"></i> Quick Link:
              </h3>
              <p className="text-xs text-blue-200/70 mb-2">
                Tokens typically expire every 60 minutes.
              </p>
              <a href="https://developer.spotify.com/documentation/web-api/reference/get-new-releases" target="_blank" className="inline-block bg-blue-500 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded hover:bg-blue-400 transition-colors">
                Get New Token <i className="fa-solid fa-external-link ml-1"></i>
              </a>
            </div>

            <div className="space-y-4">
              <textarea
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Paste Bearer Token here..."
                className="w-full bg-black/50 border border-zinc-700 rounded-xl p-4 text-sm font-mono text-zinc-300 focus:outline-none focus:border-green-500 h-24"
              />
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowTokenModal(false)}
                  className="flex-1 py-3 font-bold text-zinc-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveToken}
                  className="flex-[2] bg-green-500 text-black font-black py-3 rounded-xl hover:scale-105 active:scale-95 transition-all"
                >
                  Update Connection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === ViewType.HOME && !searchQuery && (
        <>
          <section className="mb-8">
            <h1 className="text-3xl font-black mb-6">{greeting()}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(newReleases.length > 0 ? newReleases.slice(0, 6) : MOCK_TRACKS).map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onPlayTrack(item)}
                  className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 rounded-md overflow-hidden cursor-pointer transition-all pr-4 relative"
                >
                  <img src={item.coverUrl} alt={item.title} className="w-20 h-20 shadow-2xl object-cover" />
                  <span className="font-bold truncate">{item.title}</span>
                  <button className="absolute right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black text-xl shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                    <i className="fa-solid fa-play ml-1"></i>
                  </button>
                </div>
              ))}
            </div>
          </section>
          
          <section className="mb-12">
            <AIDJ onPlayTrack={onPlayTrack} />
          </section>

          <section className="mb-8">
             <h2 className="text-2xl font-bold mb-4">New Releases</h2>
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {(newReleases.length > 0 ? newReleases : MOCK_TRACKS).map((track) => (
                   <div 
                    key={track.id}
                    onClick={() => onPlayTrack(track)}
                    className="bg-zinc-900/40 hover:bg-zinc-800/60 p-4 rounded-lg cursor-pointer transition-all group"
                   >
                     <div className="relative mb-4">
                        <img src={track.coverUrl} alt={track.title} className="w-full aspect-square rounded-md shadow-xl object-cover" />
                        <button className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-black shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                          <i className="fa-solid fa-play"></i>
                        </button>
                     </div>
                     <h3 className="font-bold truncate text-sm mb-1">{track.title}</h3>
                     <p className="text-xs text-zinc-400 truncate">{track.artist}</p>
                   </div>
                ))}
             </div>
          </section>
        </>
      )}

      {currentView === ViewType.SEARCH && !searchQuery && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-2xl font-bold mb-6">Browse all</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {['Podcasts', 'Live Events', 'Pop', 'Hip-Hop', 'Rock', 'Latin', 'Mood', 'Dance', 'Indie', 'Relax'].map((genre, i) => (
              <div 
                key={genre}
                className="aspect-square rounded-lg p-4 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform shadow-lg"
                style={{ backgroundColor: `hsl(${i * 42}, 60%, 40%)` }}
              >
                <span className="text-xl font-bold leading-tight">{genre}</span>
                <img src={`https://picsum.photos/seed/genre${i}/100/100`} className="w-20 h-20 absolute -bottom-2 -right-4 rotate-[25deg] shadow-2xl opacity-40 group-hover:opacity-100 transition-opacity" alt={genre} />
              </div>
            ))}
          </div>
        </section>
      )}

      {searchQuery && (
        <div className="animate-in fade-in duration-500">
          {isLoading ? (
            <div className="flex flex-col gap-6 py-10">
              <div className="h-8 bg-zinc-800 rounded w-1/4 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1,2,3,4,5,6].map(n => <div key={n} className="h-16 bg-zinc-800 rounded-lg animate-pulse"></div>)}
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <section className="mb-12">
              <h2 className="text-2xl font-black mb-6">Top results for "{searchQuery}"</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                {searchResults.map((track) => (
                  <div 
                    key={track.id}
                    onClick={() => onPlayTrack(track)}
                    className="flex items-center gap-4 p-2 rounded-md hover:bg-white/10 cursor-pointer group transition-all"
                  >
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <img src={track.coverUrl} alt={track.title} className="w-full h-full rounded shadow-md object-cover" />
                      <div className="absolute inset-0 bg-black/40 items-center justify-center hidden group-hover:flex">
                         <i className="fa-solid fa-play text-white"></i>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate text-sm group-hover:text-green-500 transition-colors">{track.title}</h3>
                      <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                    </div>
                    <div className="flex items-center gap-4">
                       {!track.previewUrl && <span className="text-[8px] border border-zinc-700 text-zinc-500 px-1 rounded font-bold">LOCKED</span>}
                       <span className="text-xs text-gray-500 pr-2">{track.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
              <div className="bg-zinc-800 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                <i className="fa-solid fa-magnifying-glass text-4xl text-zinc-500"></i>
              </div>
              <h3 className="text-2xl font-black mb-2">{isConnected ? 'No results found' : 'Connection Lost'}</h3>
              <p className="text-gray-400 max-w-sm">
                {isConnected ? `We couldn't find anything matching "${searchQuery}"` : 'Your Spotify access token has expired or is invalid. Please renew it to enable live searching.'}
              </p>
              {!isConnected && (
                <button 
                  onClick={() => setShowTokenModal(true)}
                  className="mt-6 bg-white text-black font-black py-3 px-8 rounded-full hover:scale-105 transition-all"
                >
                  Renew Access Token
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
