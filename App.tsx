
import React, { useState } from 'react';
import { ViewType, Track } from './types';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { MOCK_TRACKS } from './constants';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.HOME);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(MOCK_TRACKS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Dashboard 
            currentView={currentView}
            onPlayTrack={handlePlayTrack} 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </main>
      </div>
      <Player currentTrack={currentTrack} />
    </div>
  );
};

export default App;
