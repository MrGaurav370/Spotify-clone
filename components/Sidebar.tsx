
import React from 'react';
import { ViewType } from '../types';
import { MOCK_PLAYLISTS } from '../constants';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, searchQuery, onSearchChange }) => {
  const navItems = [
    { id: ViewType.HOME, icon: 'fa-house', label: 'Home' },
    { id: ViewType.SEARCH, icon: 'fa-magnifying-glass', label: 'Search' },
    { id: ViewType.LIBRARY, icon: 'fa-lines-leaning', label: 'Your Library' },
  ];

  const filteredPlaylists = MOCK_PLAYLISTS.filter(playlist => 
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-64 bg-black h-full flex flex-col p-4 space-y-2 select-none">
      <div className="px-2 py-1 mb-4">
        <h1 className="text-2xl font-bold text-green-500 flex items-center gap-2">
          <i className="fa-brands fa-spotify text-3xl"></i>
          Lumina
        </h1>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex items-center gap-4 w-full px-2 py-3 text-md font-bold transition-all duration-200 rounded-md ${
              currentView === item.id ? 'text-white bg-zinc-900' : 'text-gray-400 hover:text-white'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-xl`}></i>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex flex-col flex-1 border-t border-gray-800 pt-6 space-y-4 overflow-hidden mt-4">
        <div className="flex items-center justify-between px-2">
          <button className="flex items-center gap-4 text-gray-400 font-bold hover:text-white transition-all">
            <div className="bg-gray-400/20 p-2 rounded-sm group-hover:bg-gray-400/40">
              <i className="fa-solid fa-plus"></i>
            </div>
            Create Playlist
          </button>
        </div>
        <div className="flex items-center justify-between px-2">
          <button className="flex items-center gap-4 text-gray-400 font-bold hover:text-white transition-all">
            <div className="bg-gradient-to-br from-indigo-700 to-blue-300 p-2 rounded-sm">
              <i className="fa-solid fa-heart text-white"></i>
            </div>
            Liked Songs
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 space-y-1 px-2 scrollbar-hide">
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest px-1 mb-2">Playlists</p>
          {filteredPlaylists.map((playlist) => (
            <button
              key={playlist.id}
              className="text-gray-400 hover:text-white text-sm block w-full text-left truncate py-1.5 transition-all"
            >
              {playlist.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
