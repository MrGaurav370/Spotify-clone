
import React, { useState } from 'react';
import { getMusicRecommendations } from '../services/geminiService';
import { searchTracks } from '../services/spotifyService';
import { Track } from '../types';

interface AIDJProps {
  onPlayTrack: (track: Track) => void;
}

const AIDJ: React.FC<AIDJProps> = ({ onPlayTrack }) => {
  const [mood, setMood] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAskDJ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim()) return;
    setLoading(true);
    
    // 1. Get creative recommendations from Gemini
    const results = await getMusicRecommendations(mood);
    
    // 2. Try to find these tracks on Spotify
    const enrichedResults = await Promise.all(results.map(async (rec: any) => {
      const searchRes = await searchTracks(`${rec.title} ${rec.artist}`);
      return {
        ...rec,
        trackData: searchRes[0] || null
      };
    }));

    setRecommendations(enrichedResults);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-indigo-950 to-purple-950 rounded-2xl p-8 shadow-2xl relative overflow-hidden group border border-white/5">
      <div className="absolute top-0 right-0 p-8 text-purple-400 opacity-10 group-hover:opacity-20 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110">
        <i className="fa-solid fa-wand-magic-sparkles text-8xl"></i>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
             <i className="fa-solid fa-sparkles text-purple-400 text-sm"></i>
          </div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            AI DJ <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-indigo-500/20">Active</span>
          </h2>
        </div>
        <p className="text-indigo-100/60 mb-8 max-w-md font-medium">Describe your vibe, and I'll curate a real-time playback list from the Spotify library.</p>
        
        <form onSubmit={handleAskDJ} className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="e.g., Late night drive through Tokyo, Cyberpunk workout..."
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all backdrop-blur-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-indigo-950 px-8 py-3 rounded-xl font-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-xl"
          >
            {loading ? <i className="fa-solid fa-circle-notch animate-spin text-xl"></i> : 'Curate List'}
          </button>
        </form>

        {recommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {recommendations.map((rec, idx) => (
              <div 
                key={idx} 
                className={`bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 transition-all flex items-center gap-4 group/item cursor-pointer ${!rec.trackData ? 'opacity-50 grayscale' : ''}`}
                onClick={() => rec.trackData && onPlayTrack(rec.trackData)}
              >
                {rec.trackData ? (
                  <img src={rec.trackData.coverUrl} className="w-12 h-12 rounded shadow-lg" alt="" />
                ) : (
                  <div className="w-12 h-12 bg-zinc-800 rounded flex items-center justify-center">
                    <i className="fa-solid fa-music text-zinc-600"></i>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white truncate">{rec.title}</h4>
                  <p className="text-xs text-purple-200/50 truncate mb-1">{rec.artist}</p>
                  <p className="text-[10px] text-zinc-400 italic line-clamp-1">{rec.reason}</p>
                </div>
                {rec.trackData && (
                  <button className="bg-white/10 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all hover:bg-green-500 hover:text-black">
                    <i className="fa-solid fa-play ml-1"></i>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDJ;
