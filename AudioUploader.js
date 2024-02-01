import React, { useState, useEffect } from 'react';

const AudioPlayer = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSection, setActiveSection] = useState('playlist'); // Added state for active section
  

  useEffect(() => {
    // Load saved data from localStorage on page load
    const storedIndex = localStorage.getItem('currentPlayingIndex');
    const storedTime = localStorage.getItem('currentTime');

    if (storedIndex && storedTime) {
      setCurrentPlayingIndex(Number(storedIndex));
      setCurrentTime(Number(storedTime));
    }
  }, []);

  useEffect(() => {
    // Save current playing file index and playback position in localStorage
    localStorage.setItem('currentPlayingIndex', currentPlayingIndex);
    localStorage.setItem('currentTime', currentTime);
  }, [currentPlayingIndex, currentTime]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const blob = URL.createObjectURL(file);
      setAudioFiles((prevFiles) => [...prevFiles, { file, url: blob }]);
    }
  };

  const handlePlayClick = (index) => {
    setCurrentPlayingIndex(index);
    setCurrentTime(0);
  };

  
  const handleAudioEnd = () => {
    // Check if there's a next file in the playlist
    if (currentPlayingIndex < audioFiles.length - 1) {
      setCurrentPlayingIndex((prevIndex) => prevIndex + 1);
      setCurrentTime(0);
    } else {
      // Stop playback when there's no next file
      setCurrentPlayingIndex(-1);
      setCurrentTime(0);
    }
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav>
        <button onClick={() => setActiveSection('playlist')}>Playlist</button>
        <button onClick={() => setActiveSection('upload')}>Upload</button>
      </nav>
      

      {/* Content based on active section */}
      {activeSection === 'playlist' && (
        <div>
          <ul>
            {audioFiles.map((audio, index) => (
              <li key={index}>
                <p>{audio.file.name}</p>
                <button onClick={() => handlePlayClick(index)}>
                  {index === currentPlayingIndex ? 'Pause' : 'Play'}
                </button>
              </li>
            ))}
          </ul>
          {currentPlayingIndex !== -1 && (
            <audio
              src={audioFiles[currentPlayingIndex].url}
              controls
              onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
              onEnded={handleAudioEnd}
            />
          )}
          {currentPlayingIndex !== -1 && (
            <p>
              Elapsed Time: {Math.floor(currentTime)}s | Remaining Time:{' '}
              {Math.floor(
                audioFiles[currentPlayingIndex].file.duration - currentTime
              )}{' '}
              s
            </p>
          )}
        </div>
      )}

      {activeSection === 'upload' && (
        <div>
          <input type="file" accept="audio/*" onChange={handleFileChange} />
        </div>
      )}
    </div>
  );
};

export default AudioPlayer; 