import React, { useEffect, useMemo, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const defaultSongs = [
  {
    id: "local-rainbow-in-the-dark",
    title: "Rainbow in the Dark",
    artist: "Dio",
    src: "/songs/rainbow_in_the_dark.mp3",
    artwork:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80",
    album: "Local Library",
    source: "Local",
  },
  {
    id: "local-take-over",
    title: "Take Over",
    artist: "Lyn",
    src: "/songs/take_over.mp3",
    artwork:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80",
    album: "Local Library",
    source: "Local",
  },
];

const searchTerms = ["rock", "pop", "jazz", "hip-hop", "electronic"];

function mapApiTrack(track) {
  return {
    id: `itunes-${track.trackId}`,
    title: track.trackName,
    artist: track.artistName,
    album: track.collectionName || "iTunes",
    artwork:
      track.artworkUrl100?.replace("100x100", "600x600") ||
      track.artworkUrl100 ||
      "",
    src: track.previewUrl,
    source: "iTunes Preview",
  };
}

function MusicPlayerApp() {
  const [apiSongs, setApiSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const audioRef = useRef(null);

  const songs = useMemo(() => [...defaultSongs, ...apiSongs], [apiSongs]);
  const song = songs[currentSongIndex] ?? defaultSongs[0];

  useEffect(() => {
    let cancelled = false;

    async function loadSongs() {
      setIsLoading(true);
      setLoadError("");

      try {
        const requests = searchTerms.map((term) =>
          fetch(
            `https://itunes.apple.com/search?term=${encodeURIComponent(
              term
            )}&entity=song&media=music&limit=12`
          ).then((response) => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json();
          })
        );

        const responses = await Promise.all(requests);
        const dedupedSongs = [];
        const seenIds = new Set(defaultSongs.map((track) => track.id));

        responses
          .flatMap((response) => response.results || [])
          .filter((track) => track.previewUrl)
          .map(mapApiTrack)
          .forEach((track) => {
            if (!seenIds.has(track.id)) {
              seenIds.add(track.id);
              dedupedSongs.push(track);
            }
          });

        if (!cancelled) {
          setApiSongs(dedupedSongs);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError("Could not load extra songs from the music API.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadSongs();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return undefined;
    }

    const updateProgress = () => {
      setProgress(audio.currentTime);
    };

    const setAudioMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const syncPlayState = () => setIsPlaying(true);
    const syncPauseState = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setAudioMetadata);
    audio.addEventListener("play", syncPlayState);
    audio.addEventListener("pause", syncPauseState);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setAudioMetadata);
      audio.removeEventListener("play", syncPlayState);
      audio.removeEventListener("pause", syncPauseState);
    };
  }, [song?.src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.load();
    setProgress(0);
    setDuration(0);

    if (isPlaying) {
      audio
        .play()
        .then(() => setLoadError(""))
        .catch(() =>
          setLoadError("Playback was blocked by the browser. Press play again.")
        );
    }
  }, [isPlaying, song?.src]);

  const playPauseHandler = async () => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      return;
    }

    try {
      await audioRef.current.play();
      setLoadError("");
    } catch (error) {
      setLoadError("Playback was blocked by the browser. Press play again.");
    }
  };

  const nextSongHandler = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % Math.max(songs.length, 1));
    setProgress(0);
  };

  const prevSongHandler = () => {
    setCurrentSongIndex(
      (prevIndex) => (prevIndex - 1 + Math.max(songs.length, 1)) % Math.max(songs.length, 1)
    );
    setProgress(0);
  };

  const selectSongHandler = (index) => {
    setCurrentSongIndex(index);
    setProgress(0);
  };

  const handleProgressChange = (event) => {
    if (!audioRef.current || !duration) {
      return;
    }

    const newTime = (event.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  return (
    <div className="app-shell">
      <div className="player-layout">
        <section className="player-card">
          <div className="eyebrow">Hybrid Library</div>
          <h1>Music Player</h1>
          <p className="subheading">
            Your local tracks stay available, and the app now loads extra preview
            songs from the iTunes Search API.
          </p>

          <div className="now-playing">
            <img
              className="cover-art"
              src={song.artwork}
              alt={`${song.title} cover art`}
            />
            <div className="track-meta">
              <span className="source-badge">{song.source}</span>
              <h2>{song.title}</h2>
              <p>{song.artist}</p>
              <span>{song.album}</span>
            </div>
          </div>

          <audio
            ref={audioRef}
            src={song.src}
            key={song.src}
            onEnded={nextSongHandler}
          />

          <div className="progress-container">
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

          <div className="controls">
            <button className="control-button secondary" onClick={prevSongHandler}>
              Prev
            </button>
            <button
              className={`control-button primary ${isPlaying ? "is-playing" : ""}`}
              onClick={playPauseHandler}
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button className="control-button secondary" onClick={nextSongHandler}>
              Next
            </button>
          </div>

          {loadError ? <p className="status-message error">{loadError}</p> : null}
          <p className="status-message">
            {isLoading
              ? "Loading more songs from the API..."
              : `Library ready with ${songs.length} tracks.`}
          </p>
        </section>

        <aside className="playlist-card">
          <div className="playlist-header">
            <h3>Queue</h3>
            <span>{songs.length} tracks</span>
          </div>

          <div className="playlist">
            {songs.map((track, index) => (
              <button
                key={track.id}
                className={`playlist-item ${
                  index === currentSongIndex ? "active" : ""
                }`}
                onClick={() => selectSongHandler(index)}
              >
                <img src={track.artwork} alt="" />
                <div>
                  <strong>{track.title}</strong>
                  <span>{track.artist}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

export default MusicPlayerApp;
