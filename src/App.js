import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // For custom styling

const defaultSongs = [
  {
    title: 'Rainbow in the Dark',
    artist: 'Dio',
    src: process.env.PUBLIC_URL + 'songs/Rainbow in the Dark (2016 Remaster).mp3',
  },
  {
    title: 'Take Over',
    artist: 'Lyn',
    src: process.env.PUBLIC_URL +  'songs/Take Over.mp3',
  },
  {
    title: 'I',
    artist: 'Black Sabbath',
    src: process.env.PUBLIC_URL +  'songs/I.mp3',
  },
];

function MusicPlayerApp() {
  const [songs] = useState(defaultSongs);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const playPauseHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextSongHandler = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
    setIsPlaying(false);
  };

  const prevSongHandler = () => {
    setCurrentSongIndex(
      (prevIndex) => (prevIndex - 1 + songs.length) % songs.length
    );
    setIsPlaying(false);
  };

  const song = songs[currentSongIndex];

  return (
    <div className="container py-5">
      <div className="card text-center bg-dark text-white shadow-lg">
        <div className="card-header">
          <h2 className="text-uppercase">Music Player</h2>
        </div>
        <div className="card-body">
          <h4>{song.title}</h4>
          <p className="text-muted">{song.artist}</p>
          <audio ref={audioRef} src={song.src} onEnded={nextSongHandler}></audio>

          <div className="btn-group mt-3">
            <button
              className="btn btn-outline-light"
              onClick={prevSongHandler}
            >
              ⏮ Previous
            </button>
            <button
              className={`btn ${isPlaying ? 'btn-danger' : 'btn-success'}`}
              onClick={playPauseHandler}
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <button
              className="btn btn-outline-light"
              onClick={nextSongHandler}
            >
              ⏭ Next
            </button>
          </div>
        </div>
        <div className="card-footer text-muted">
          Enjoy your music!
        </div>
      </div>
    </div>
  );
}

export default MusicPlayerApp;