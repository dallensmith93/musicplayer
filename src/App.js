import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; // Custom styling

const defaultSongs = [
  {
    title: "Rainbow in the Dark",
    artist: "Dio",
    src: "/songs/rainbow_in_the_dark.mp3",
  },
  {
    title: "Take Over",
    artist: "Lyn",
    src: "/songs/take_over.mp3",
  },
];

function MusicPlayerApp() {
  const [songs] = useState(defaultSongs);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // Current time in seconds
  const [duration, setDuration] = useState(0); // Total duration in seconds
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
    setProgress(0);
    setIsPlaying(false);
  };

  const prevSongHandler = () => {
    setCurrentSongIndex(
      (prevIndex) => (prevIndex - 1 + songs.length) % songs.length
    );
    setProgress(0);
    setIsPlaying(false);
  };

  const handleProgressChange = (event) => {
    const newTime = (event.target.value / 100) * duration;
    console.log("Seek to:", newTime); // Debug log
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const song = songs[currentSongIndex];

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      console.log("Progress updated:", audio.currentTime); // Debug log
      setProgress(audio.currentTime);
    };

    const setAudioMetadata = () => {
      console.log("Metadata loaded. Duration:", audio.duration); // Debug log
      setDuration(audio.duration || 0);
    };

    if (audio) {
      audio.addEventListener("timeupdate", updateProgress);
      audio.addEventListener("loadedmetadata", setAudioMetadata);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", updateProgress);
        audio.removeEventListener("loadedmetadata", setAudioMetadata);
      }
    };
  }, [audioRef, song.src]);

  return (
    <div className="container py-5">
      <div className="card text-center bg-dark text-white shadow-lg">
        <div className="card-header">
          <h2 className="text-uppercase">Music Player</h2>
        </div>
        <div className="card-body">
          <h4>{song.title}</h4>
          <p className="text-muted">{song.artist}</p>

          <audio ref={audioRef} src={song.src} key={song.src} onEnded={nextSongHandler}></audio>

          <div className="progress-container mt-3">
            <div className="timestamps">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              className="progress-bar"
              value={(progress / duration) * 100 || 0}
              max="100"
              onChange={handleProgressChange}
            />
          </div>

          <div className="btn-group mt-3">
            <button className="btn btn-outline-light" onClick={prevSongHandler}>
              ⏮ Previous
            </button>
            <button
              className={`btn ${isPlaying ? "btn-danger" : "btn-success"}`}
              onClick={playPauseHandler}
            >
              {isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>
            <button className="btn btn-outline-light" onClick={nextSongHandler}>
              ⏭ Next
            </button>
          </div>
        </div>
        <div className="card-footer text-muted">
          Now Playing: <strong>{song.title}</strong> by <em>{song.artist}</em>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default MusicPlayerApp;
