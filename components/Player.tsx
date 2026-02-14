
import React, { useState, useEffect, useRef } from 'react';
import { Track } from '../types';

interface PlayerProps {
  currentTrack: Track | null;
}

const Player: React.FC<PlayerProps> = ({ currentTrack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (currentTrack?.previewUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(currentTrack.previewUrl);
      } else {
        audioRef.current.src = currentTrack.previewUrl;
      }
      
      audioRef.current.volume = volume / 100;
      
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      }

      const updateProgress = () => {
        if (audioRef.current) {
          const curr = audioRef.current.currentTime;
          const dur = audioRef.current.duration;
          setCurrentTime(curr);
          setDuration(dur);
          setProgress((curr / dur) * 100);
        }
      };

      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));

      return () => {
        audioRef.current?.removeEventListener('timeupdate', updateProgress);
      };
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedProgress = x / rect.width;
    audioRef.current.currentTime = clickedProgress * duration;
  };

  if (!currentTrack) return null;

  return (
    <div className="h-24 bg-black border-t border-gray-900 px-4 flex items-center justify-between z-50 relative">
      <div className="flex items-center gap-4 w-1/3 min-w-0">
        <img 
          src={currentTrack.coverUrl} 
          alt={currentTrack.title} 
          className="w-14 h-14 rounded shadow-lg flex-shrink-0"
        />
        <div className="min-w-0 overflow-hidden">
          <h4 className="text-sm font-semibold truncate hover:underline cursor-pointer">
            {currentTrack.title}
          </h4>
          <p className="text-xs text-gray-400 truncate hover:underline cursor-pointer">
            {currentTrack.artist}
          </p>
        </div>
        <button className="text-gray-400 hover:text-green-500 ml-2 transition-colors">
          <i className="fa-regular fa-heart"></i>
        </button>
      </div>

      <div className="flex flex-col items-center max-w-xl w-full px-4">
        <div className="flex items-center gap-6 mb-2">
          <button className="text-gray-400 hover:text-white transition-all"><i className="fa-solid fa-shuffle"></i></button>
          <button className="text-gray-400 hover:text-white text-xl transition-all"><i className="fa-solid fa-backward-step"></i></button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
          >
            <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'} ${!isPlaying ? 'ml-0.5' : ''}`}></i>
          </button>
          <button className="text-gray-400 hover:text-white text-xl transition-all"><i className="fa-solid fa-forward-step"></i></button>
          <button className="text-gray-400 hover:text-white transition-all"><i className="fa-solid fa-repeat"></i></button>
        </div>
        
        <div className="w-full flex items-center gap-2 group">
          <span className="text-[10px] text-gray-400 min-w-[30px] text-right">{formatTime(currentTime)}</span>
          <div 
            className="h-1 flex-1 bg-gray-600 rounded-full relative cursor-pointer"
            onClick={handleProgressChange}
          >
            <div 
              className="absolute left-0 top-0 h-full bg-white group-hover:bg-green-500 rounded-full transition-colors"
              style={{ width: `${progress}%` }}
            ></div>
            <div 
              className="absolute h-3 w-3 bg-white rounded-full -top-1 hidden group-hover:block shadow-md"
              style={{ left: `calc(${progress}% - 6px)` }}
            ></div>
          </div>
          <span className="text-[10px] text-gray-400 min-w-[30px]">{currentTrack.previewUrl ? '0:30' : currentTrack.duration}</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 w-1/3">
        {!currentTrack.previewUrl && (
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter bg-zinc-800 px-2 py-0.5 rounded">No Preview</span>
        )}
        <button className="text-gray-400 hover:text-white text-sm"><i className="fa-solid fa-microphone-lines"></i></button>
        <button className="text-gray-400 hover:text-white text-sm"><i className="fa-solid fa-list-ul"></i></button>
        <button className="text-gray-400 hover:text-white text-sm"><i className="fa-solid fa-laptop-code"></i></button>
        <div className="flex items-center gap-2 w-24 group">
          <i className={`fa-solid ${volume === 0 ? 'fa-volume-xmark' : volume < 50 ? 'fa-volume-low' : 'fa-volume-high'} text-gray-400 text-xs`}></i>
          <div className="h-1 flex-1 bg-gray-600 rounded-full relative cursor-pointer">
             <input 
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
             />
             <div 
                className="absolute left-0 top-0 h-full bg-white group-hover:bg-green-500 rounded-full transition-colors"
                style={{ width: `${volume}%` }}
              ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
